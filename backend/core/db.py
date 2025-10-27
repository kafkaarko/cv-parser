import os
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB = os.getenv("MONGO_DB")

# ✅ Async untuk FastAPI
async_client = AsyncIOMotorClient(MONGO_URI)
async_db = async_client[MONGO_DB]
batch_collection = async_db["batches"]
cv_collection = async_db["cvs"]

# ✅ Sync untuk Celery worker
sync_client = MongoClient(MONGO_URI)
sync_db = sync_client[MONGO_DB]
sync_batches = sync_db["batches"]
sync_cvs = sync_db["cvs"]

