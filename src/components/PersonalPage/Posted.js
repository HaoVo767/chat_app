import React, { useState } from "react";
import PostCard from "./PostCard";

export default function Posted() {
  const [posts, setPost] = useState([]);
  fetch("http://localhost:9000/me")
    .then((response) => response.json)
    .then((result) => setPost(result))
    .catch((error) => console.log(error));
  return (
    <>
      {posts.map((item) => (
        <PostCard />
      ))}
    </>
  );
}
