from celery import Celery

celery_app = Celery(
    "cv_parser",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/1",
)

celery_app.conf.update(
    task_routes={
        "services.tasks.*": {"queue": "cv_tasks"},
    },
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
)
