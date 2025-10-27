from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.batch import router as batch_router
from routes.single_upload import router as single_router
from routes.keywords import router as keyword_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(batch_router, prefix="/api")
app.include_router(single_router, prefix="/api")
app.include_router(keyword_router, prefix="/api")
