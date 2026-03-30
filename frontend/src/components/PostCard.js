// src/components/PostCard.js

import React from "react";

function getInitial(username) {
  return username ? username.charAt(0).toUpperCase() : "?";
}

function PostCard({ post, apiBaseUrl }) {
  const imageUrl = `${apiBaseUrl}${post.image}`;

  return (
    <article className="post-card">
      <header className="post-header">
        <div className="post-avatar" aria-hidden="true">
          {getInitial(post.user)}
        </div>
        <span className="post-username">{post.user}</span>
      </header>

      <div className="post-image-wrapper">
        <img
          src={imageUrl}
          alt={`Post by ${post.user}`}
          className="post-image"
          loading="lazy"
        />
      </div>

      <div className="post-caption">
        <strong>{post.user}</strong>
        <p>{post.caption}</p>
      </div>
    </article>
  );
}

export default PostCard;
