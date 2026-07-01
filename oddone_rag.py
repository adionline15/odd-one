import google.generativeai as genai
import requests
import xml.etree.ElementTree as ET
import time

# API key environment variable se lo — GitHub pe kabhi hardcode mat karo
import os
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "YOUR_KEY_HERE")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash')

def get_alerts(city):
    alerts = []
    queries = [f"{city} road blocked", f"{city} traffic jam"]
    for query in queries:
        url = f"https://news.google.com/rss/search?q={query.replace(' ','+')}&hl=en-IN&gl=IN&ceid=IN:en"
        try:
            resp = requests.get(url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
            root = ET.fromstring(resp.content)
            for item in root.findall('.//item')[:2]:
                title = item.find('title').text or ""
                alerts.append(title.split(' - ')[0][:80])
        except:
            pass
    return alerts

def get_road_data(origin, destination):
    bbox = "29.90,77.90,30.40,78.20"
    query = "[out:json][timeout:30];(way[highway](" + bbox + "););out body;>;out skel qt;"
    resp = requests.post(
        "https://overpass.kumi.systems/api/interpreter",
        data={"data": query}, timeout=60
    )
    data = resp.json()
    complete = []
    missing = []
    for element in data.get("elements", []):
        if element["type"] == "way":
            tags = element.get("tags", {})
            if tags.get("name"):
                complete.append(tags.get("name"))
            else:
                missing.append(tags.get("highway", "unknown"))
    return {
        "complete_roads": complete[:20],
        "missing_count": len(missing),
        "total": len(complete) + len(missing)
    }

def smart_rag_navigate(user_query, origin, destination):
    road_info = get_road_data(origin, destination)
    origin_alerts = get_alerts(origin)
    dest_alerts = get_alerts(destination)
    
    context = f"""You are Odd-One.in navigation companion for India.
Route: {origin} to {destination}
Missing roads: {road_info['missing_count']} out of {road_info['total']}
Known roads: {', '.join(road_info['complete_roads'][:5])}
Alerts {origin}: {origin_alerts[0] if origin_alerts else 'None'}
Alerts {destination}: {dest_alerts[0] if dest_alerts else 'None'}
User: {user_query}
Reply in Hindi, be friendly like local friend, suggest route, halts, food, time estimate."""
    
    time.sleep(5)
    try:
        response = model.generate_content(context)
        return response.text
    except Exception as e:
        return f"Error: {e}"

if __name__ == "__main__":
    result = smart_rag_navigate(
        user_query="Dehradun se Delhi jaana hai subah 8 baje car se",
        origin="Dehradun",
        destination="Delhi"
    )
    print(result)
