from fastapi import FastAPI
from app.backend.api.routes import api
from app.backend.db.db import Base, engine


def create_tables():
    Base.metadata.create_all(bind=engine)


create_tables()

app = FastAPI()

app.include_router(api, prefix="/api")


@app.get("/")
def read_root():
    return {"Hello": "World"}
