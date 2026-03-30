# routers/posts.py

from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from data.mock_posts import MOCK_POSTS

router = APIRouter(
    prefix="/posts",
    tags=["posts"],
)


class Post(BaseModel):
    id: int
    user: str
    image: str
    caption: str


@router.get("", response_model=List[Post])
async def get_all_posts() -> List[Post]:
    """
    Return all posts.
    """
    return MOCK_POSTS


@router.get("/{post_id}", response_model=Post)
async def get_post_by_id(post_id: int) -> Post:
    """
    Return a single post by ID.
    """
    post: Optional[dict] = next(
        (p for p in MOCK_POSTS if p["id"] == post_id), None
    )
    if not post:
        raise HTTPException(status_code=404, detail=f"Post {post_id} not found")
    return post
