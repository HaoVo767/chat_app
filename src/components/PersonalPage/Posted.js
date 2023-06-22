import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { useParams } from "react-router-dom";

export default function Posted() {
  const { id } = useParams();
  console.log("id", id);
  const [posts, setPost] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:9000/user/${id}`)
      .then((response) => response.text())
      .then((result) => setPost(JSON.parse(result)))
      .catch((error) => console.log(error));
  }, [id]);
  return <>{!!posts && posts?.map((item, index) => <PostCard key={index} post={item} />)}</>;
}
