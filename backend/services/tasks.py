from celery import Celery
import os, json
from services.parser import extract_text_from_docx, extract_text_from_pdf, parse_info
from core.db import sync_batches, sync_cvs
from dotenv import load_dotenv
from PIL import Image
import pytesseract
load_dotenv()

celery = Celery("tasks", broker="redis://localhost:6379/0")

def extract_text_from_image(image_path: str) -> str:
    """Ekstrak teks dari file gambar (JPG, PNG) pakai Tesseract OCR"""
    try:
        img = Image.open(image_path)
        text = pytesseract.image_to_string(img, lang="eng")
        return text
    except Exception as e:
        return f"Error reading image: {e}"

@celery.task
def process_cv(file_path, filename, batch_id):
    try:
        ext = filename.lower().split(".")[-1]
        text = ""

        if ext == "docx":
            text = extract_text_from_docx(file_path)
        elif ext == "pdf":
            text = extract_text_from_pdf(file_path)
        elif ext in ["jpg", "jpeg", "png"]:
            text = extract_text_from_image(file_path)
        else:
            return {"error": f"Unsupported format: {ext}"}

        parsed = parse_info(text, pdf_path=file_path if ext == "pdf" else None)

        sync_cvs.insert_one({
            "batch_id": batch_id,
            "filename": filename,
            "parsed": parsed,
            "status": "done"
        })

        sync_batches.update_one(
            {"batch_id": batch_id, "cvs.file_name": filename},
            {"$set": {"cvs.$.status": "done"}}
        )

        return {"status": "completed", "file": filename}

    except Exception as e:
        return {"error": str(e)}
