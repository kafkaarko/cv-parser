from fastapi import APIRouter, UploadFile, File, Form
import aiofiles, os
from datetime import datetime
from uuid import uuid4
from typing import List
from core.db import batch_collection, cv_collection
from services.tasks import process_cv
from fastapi import APIRouter, HTTPException

router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/batch/create")
async def create_batch(
    role: str = Form(...),
    uploaded_by: str = Form(...),
    batch_name: str = Form(...)
):
    batch_id = batch_name.strip().replace(" ", "_").lower()
    uploaded_at = datetime.now().isoformat()

    existing = await batch_collection.find_one({"batch_id": batch_id})
    if existing:
        return {"error": "Batch name already exists!"}

    await batch_collection.insert_one({
        "batch_id": batch_id,
        "role": role,
        "uploaded_by": uploaded_by,
        "uploaded_at": uploaded_at,
        "cvs": []
    })
    return {"batch_id": batch_id, "message": "Batch created successfully"}

@router.post("/batch/upload")
async def upload_to_batch(
    batch_id: str = Form(...),
    files: List[UploadFile] = File(...)
):
    batch = await batch_collection.find_one({"batch_id": batch_id})
    if not batch:
        return {"error": "Batch not found"}

    for file in files:
        file_path = os.path.join("uploads", f"{batch_id}_{file.filename}")
        async with aiofiles.open(file_path, "wb") as f:
            await f.write(await file.read())

        # update batch doc
        await batch_collection.update_one(
            {"batch_id": batch_id},
            {"$push": {"cvs": {"file_name": file.filename, "status": "pending"}}}
        )

        # kirim ke celery
        process_cv.delay(file_path, file.filename, batch_id)

    return {"batch_id": batch_id, "uploaded": [f.filename for f in files]}
    

# 🧩 Lihat semua batch (buat HRD)
@router.get("/batches")
async def get_all_batches():
    batches = await batch_collection.find({}, {"_id": 0}).to_list(None)
    return {"count": len(batches), "batches": batches}


# 🔍 Lihat detail batch tertentu + hasil parsing CV-nya
@router.get("/batch/{batch_id}")
async def get_batch_detail(batch_id: str):
    batch = await batch_collection.find_one({"batch_id": batch_id}, {"_id": 0})
    if not batch:
        return {"error": "Batch not found"}

    cvs = await cv_collection.find({"batch_id": batch_id}, {"_id": 0}).to_list(None)
    batch["results"] = cvs
    return batch

@router.get("/batch/{batch_id}/results")
async def get_batch_results(batch_id: str):
    """
    HRD bisa lihat hasil parsing setiap CV di batch ini.
    """
    # cek dulu batch-nya ada gak
    batch = await batch_collection.find_one({"batch_id": batch_id}, {"_id": 0})
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    # ambil hasil parsing semua CV di batch ini
    results = await cv_collection.find({"batch_id": batch_id}, {"_id": 0}).to_list(None)

    if not results:
        return {"message": "Parsing masih diproses, belum ada hasil."}

    return {
        "batch_id": batch_id,
        "uploaded_by": batch["uploaded_by"],
        "role": batch["role"],
        "uploaded_at": batch["uploaded_at"],
        "count": len(results),
        "results": results
    }
