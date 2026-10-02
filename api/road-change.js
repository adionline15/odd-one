const MAX_SPAN = 20;
function json(res,status,body){return res.status(status).json(body);}
function valid(v,min,max){return Number.isFinite(v)&&v>=min&&v<=max;}
function config(){return {url:(process.env.SUPABASE_URL||'').trim().replace(/\\/+$/,''),key:(process.env.SUPABASE_SECRET_KEY||'').trim()};}
async function request(path,options={}){
  const {url,key}=config();
  if(!url||!key){const e=new Error('Database is not configured');e.code='NOT_CONFIGURED';throw e;}
  const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),8000);
  try{
    const response=await fetch(url+'/rest/v1/'+path,{...options,headers:{apikey:key,'Content-Type':'application/json',...(options.headers||{})},signal:controller.signal});
    const text=await response.text(); let data=null; try{data=text?JSON.parse(text):null;}catch{}
    if(!response.ok){const e=new Error('Database request failed');e.status=response.status;throw e;}
    return data;
  }finally{clearTimeout(timer);}
}
export default async function handler(req,res){
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');res.setHeader('Permissions-Policy','geolocation=(), camera=(), microphone=()');res.setHeader('Content-Type','application/json; charset=utf-8');
  if(req.method!=='GET'){res.setHeader('Allow','GET');return json(res,405,{error:'Method not allowed'});}
  const q=req.query||{}; const minLat=Number(q.minLat),minLon=Number(q.minLon),maxLat=Number(q.maxLat),maxLon=Number(q.maxLon);
  if(![minLat,minLon,maxLat,maxLon].every(Number.isFinite)||!valid(minLat,-90,90)||!valid(maxLat,-90,90)||!valid(minLon,-180,180)||!valid(maxLon,-180,180)||minLat>=maxLat||minLon>=maxLon||maxLat-minLat>MAX_SPAN||maxLon-minLon>MAX_SPAN){
    return json(res,400,{error:'Invalid change bounds',max_span:MAX_SPAN});
  }
  try{
    const data=await request('rpc/approved_road_change_in_view',{method:'POST',body:JSON.stringify({p_min_lat:minLat,p_min_lon:minLon,p_max_lat:maxLat,p_max_lon:maxLon})});
    const changes=Array.isArray(data)?data:[];
    res.setHeader('Cache-Control','public, max-age=30, s-maxage=30, stale-while-revalidate=60');
    res.setHeader('X-Odd-One-API','road-change-v1');
    return json(res,200,{api_version:'road-change-v1',scope:'approved',count:changes.length,changes});
  }catch(error){
    console.error('[road-change] request failed',{status:error.status||0,name:error.name||'Error'});
    return json(res,error.code==='NOT_CONFIGURED'?503:502,{api_version:'road-change-v1',error:error.code==='NOT_CONFIGURED'?'Observation database is not configured':'Road change data unavailable'});
  }
}
