// src/components/PostList.js
import React, { useEffect, useState } from 'react';
import { apiBaseUrl } from '../config/api';
import PostCard from './PostCard';

function PostList() {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    fetch(`${apiBaseUrl}/feed`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data.success) setPosts(data.data);
        else setError(data.error || 'Failed to load feed');
      })
      .catch(err => setError(err.message || 'Network error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="loading-wrapper">
      <div className="spinner" role="status" aria-label="Loading posts" />
      <span>Loading feed…</span>
    </div>
  );

  if (error) return (
    <div className="error-wrapper">
      <span className="error-icon">⚠️</span>
      <span>{error}</span>
    </div>
  );

  if (!posts.length) return (
    <div className="empty-wrapper">
      <p>No posts found in your feed.</p>
    </div>
  );

  return (
    <section className="feed">
      {posts.map(post => <PostCard key={post.id} post={post} />)}
    </section>
  );
}

export default PostList;