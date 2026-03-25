// src/components/PostCard.js

import React from "react";

function PostCard({ post, apiBaseUrl }) {
  const imageUrl = `${apiBaseUrl}${post.image}`;

  return (
    <article className="post-card">
      <header className="post-header">
        <span className="post-username">{post.user}</span>
      </header>
      <div className="post-image-wrapper">
        <img src={imageUrl} alt={post.caption} className="post-image" />
      </div>
      <div className="post-caption">
        <p>{post.caption}</p>
      </div>
    </article>
  );
}

export default PostCard;
