from celery import Celery
import os, json
from services.parser import extract_text_from_docx, extract_text_from_pdf, parse_info
from core.db import sync_batches, sync_cvs
from dotenv import load_dotenv
load_dotenv()


celery = Celery("tasks", broker="redis://localhost:6379/0")

@celery.task
def process_cv(file_path, filename, batch_id):
    try:
        if filename.endswith(".docx"):
            text = extract_text_from_docx(file_path)
        elif filename.endswith(".pdf"):
            text = extract_text_from_pdf(file_path)
        else:
            return {"error": "Unsupported format"}

        parsed = parse_info(text, pdf_path=file_path)

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
