function json(res,status,body){return res.status(status).json(body);}
function config(){return {url:(process.env.SUPABASE_URL||'').trim().replace(/\\/+$/,''),key:(process.env.SUPABASE_SECRET_KEY||'').trim()};}
async function request(path){
  const {url,key}=config();
  if(!url||!key){const e=new Error('Database is not configured');e.code='NOT_CONFIGURED';throw e;}
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),8000);
  try{
    const response=await fetch(url+'/rest/v1/'+path,{headers:{apikey:key,'Content-Type':'application/json'},signal:controller.signal});
    const text=await response.text();let data=null;try{data=text?JSON.parse(text):null;}catch{}
    if(!response.ok){const e=new Error('Database request failed');e.status=response.status;throw e;}
    return Array.isArray(data)?data:[];
  }finally{clearTimeout(timer);}
}
export default async function handler(req,res){
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');res.setHeader('Content-Type','application/json; charset=utf-8');
  if(req.method!=='GET'){res.setHeader('Allow','GET');return json(res,405,{error:'Method not allowed'});}
  try{
    const rows=await request('observations?select=id,source,observed_at,confidence,metadata&status=eq.approved&order=observed_at.desc&limit=1000');
    const now=Date.now();
    const fresh=rows.filter(row=>{const t=Date.parse(row.observed_at||'');return Number.isFinite(t)&&now-t<=30*86400000;}).length;
    const timestamped=rows.filter(row=>Boolean(row.observed_at)).length;
    const withProvenance=rows.filter(row=>row.metadata&&typeof row.metadata==='object'&&!Array.isArray(row.metadata)&&Object.keys(row.metadata).length>0).length;
    const sources=new Set(rows.map(row=>row.source).filter(Boolean));
    const avg=rows.length?rows.reduce((sum,row)=>sum+(Number(row.confidence)||0),0)/rows.length:null;
    const quality={
      approved_observations:rows.length,
      returned_sample_limit:1000,
      sample_truncated:rows.length===1000,
      sources:sources.size,
      fresh_within_30d:fresh,
      timestamped:timestamped,
      with_provenance:withProvenance,
      average_confidence:avg===null?null:Number(avg.toFixed(3))
    };
    res.setHeader('Cache-Control','public, max-age=60, s-maxage=60, stale-while-revalidate=120');
    res.setHeader('X-Odd-One-API','observation-quality-v1');
    return json(res,200,{api_version:'observation-quality-v1',scope:'approved_sample',quality});
  }catch(error){
    console.error('[observation-quality] request failed',{status:error.status||0,name:error.name||'Error'});
    return json(res,error.code==='NOT_CONFIGURED'?503:502,{api_version:'observation-quality-v1',error:error.code==='NOT_CONFIGURED'?'Observation database is not configured':'Observation quality unavailable'});
  }
}
