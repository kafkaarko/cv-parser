from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.storage_handler import load_storage, save_storage

router = APIRouter()

class KeywordUpdate(BaseModel):
    skills_keywords: list[str]

@router.get("/keywords")
async def get_keywords():
    storage = load_storage()
    return storage.get("skills_keywords", [])

@router.post("/keywords")
async def update_keywords(data: KeywordUpdate):
    storage = load_storage()
    storage["skills_keywords"] = data.skills_keywords
    save_storage(storage)
    return {"message": "updated"}
