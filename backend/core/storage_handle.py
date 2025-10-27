import json
from pathlib import Path

STORAGE_PATH = Path("storage.json")

def load_storage():
    if not STORAGE_PATH.exists():
        return {"skills_keywords": []}
    with open(STORAGE_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def save_storage(data):
    with open(STORAGE_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
