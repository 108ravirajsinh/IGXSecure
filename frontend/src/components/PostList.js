// src/components/PostList.js

import React, { useEffect, useState } from "react";
import { apiBaseUrl } from "../config/api";
import PostCard from "./PostCard";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(`${apiBaseUrl}/posts`);
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message || "Could not load posts. Is the backend running?");
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="spinner" role="status" aria-label="Loading" />
        <span>Loading feed...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-wrapper">
        <span className="error-icon">⚠️</span>
        <span>{error}</span>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="empty-wrapper">
        <p>No posts yet. Add some to get started.</p>
      </div>
    );
  }

  return (
    <section className="feed">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} apiBaseUrl={apiBaseUrl} />
      ))}
    </section>
  );
}

export default PostList;
