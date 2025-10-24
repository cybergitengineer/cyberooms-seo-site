import os, requests, json
from datetime import datetime

# Notion secrets from Vercel/GitHub environment
NOTION_TOKEN = os.getenv("NOTION_TOKEN")
DATABASE_ID = os.getenv("NOTION_DB_ID")

headers = {
    "Authorization": f"Bearer {NOTION_TOKEN}",
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json"
}

url = f"https://api.notion.com/v1/databases/{DATABASE_ID}/query"
res = requests.post(url, headers=headers)
data = res.json()

# create /content if missing
os.makedirs("content", exist_ok=True)

timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
with open("content/notion_sync.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"[{timestamp}] Pulled {len(data.get('results', []))} Notion records.")
