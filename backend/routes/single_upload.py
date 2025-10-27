from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from uuid import uuid4
import os, json
from datetime import datetime
from services.parser import extract_text_from_docx, extract_text_from_pdf, parse_info
from core.db import cv_collection

router = APIRouter()
UPLOAD_DIR = "uploads"
RESULTS_DIR = "results"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_id = str(uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}_{file.filename}")

    with open(file_path, "wb") as f:
        f.write(await file.read())

    if file.filename.endswith(".docx"):
        text = extract_text_from_docx(file_path)
    elif file.filename.endswith(".pdf"):
        text = extract_text_from_pdf(file_path)
    else:
        raise HTTPException(status_code=400, detail="Only .pdf or .docx supported")

    parsed = parse_info(text, pdf_path=file_path)
    result_data = {"cv_result": parsed}

    # --- Simpan ke MongoDB ---
    await cv_collection.insert_one({
        "_id": file_id,
        "file_name": file.filename,
        "parsed_data": parsed,
        "uploaded_at": datetime.utcnow(),
    })

    # --- Simpan juga ke file JSON (backup opsional) ---
    result_path = os.path.join(RESULTS_DIR, f"{file_id}.json")
    with open(result_path, "w", encoding="utf-8") as f:
        json.dump(result_data, f, indent=4, ensure_ascii=False)

    return JSONResponse(content={"id": file_id, "result": result_data})
