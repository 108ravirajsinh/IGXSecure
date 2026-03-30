// src/App.js

import React from "react";
import PostList from "./components/PostList";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>📷 Clinsta</h1>
      </header>
      <main className="app-main">
        <PostList />
      </main>
      <footer className="app-footer">
        Distraction-free • No ads • No reels • No suggestions
      </footer>
    </div>
  );
}

export default App;
