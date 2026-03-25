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
          throw new Error(`Failed to fetch posts: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="status-message">Loading feed...</div>;
  }

  if (error) {
    return <div className="status-message error">Error: {error}</div>;
  }

  if (!posts.length) {
    return <div className="status-message">No posts available.</div>;
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
