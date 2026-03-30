# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routers.posts import router as posts_router

app = FastAPI(
    title="Minimal Instagram Viewer API",
    description="Clean, distraction-free Instagram-like feed API.",
    version="1.1.0",
)

# CORS — restrict origins in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static image serving
app.mount(
    "/images",
    StaticFiles(directory="static/images"),
    name="images",
)

# Register routers
app.include_router(posts_router)
