from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI(
    title="Minimal Instagram Viewer API",
    version="1.0.0",
)


# CORS configuration
# For production, you should restrict allow_origins to specific frontend URLs.
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static images from /images/*
app.mount(
    "/images",
    StaticFiles(directory="static/images"),
    name="images",
)


class Post(BaseModel):
    id: int
    user: str
    image: str  # relative path, e.g. "/images/sample.jpg"
    caption: str


# Mock in-memory data for Phase 1
MOCK_POSTS: List[Post] = [
    Post(
        id=1,
        user="minimal_user",
        image="/images/img1.jpg",
        caption="This is a sample caption for the minimal Instagram viewer.",
    ),
    Post(
        id=2,
        user="another_user",
        image="/images/img2.jpg",
        caption="Another clean, distraction-free post.",
    ),
]


@app.get("/posts", response_model=List[Post])
async def get_posts() -> List[Post]:
    """
    Return all posts as a list of JSON objects.
    """
    return MOCK_POSTS
