import React, { useEffect, useState } from "react";
import { Avatar, Card, Image, Modal } from "antd";
import { AiFillHeart } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
export default function PostCard({ post }) {
  const { creator, postContent, media, heart, comment, _id } = post;
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [displayHeart, setDisplayHeart] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likeList, setLikeList] = useState([]);

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    var urlencoded = new URLSearchParams();
    urlencoded.append("name", user.displayName);
    urlencoded.append("photoURL", user.photoURL);
    urlencoded.append("uid", user.uid);
    fetch(`http://localhost:9000/update-like/${_id}`, {
      headers: myHeaders,
      body: urlencoded,
      method: "POST",
    })
      .then((response) => response.text())
      .then((result) => setLikeList(JSON.parse(result)))
      .catch((err) => console.log(err));
  }, [displayHeart]);
  useEffect(() => {
    console.log(likeList);
  }, [likeList]);
  const handleAddHeart = () => {
    setDisplayHeart(!displayHeart);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleShowLikeList = () => {
    setIsModalOpen(true);
  };
  return (
    <div className="">
      <Card
        title={
          <div className="flex">
            <div>
              <Avatar size="large" src={user?.photoURL} className="text-2xl mr-1 bg-slate-100 cursor-pointer">
                {user?.photoURL ? "" : user?.displayName?.charAt(0).toUpperCase()}
              </Avatar>
              {creator}
            </div>
          </div>
        }
        bordered={false}
        style={{
          width: "50%",
          margin: "auto",
        }}
      >
        <div className="mb-5 text-base">{postContent}</div>
        <Image.PreviewGroup>
          <div>
            {media &&
              media.map(
                (item, index) => index < 6 && <Image style={{ width: 292 }} src={item} key={index} className="mr-2" />
              )}
          </div>
        </Image.PreviewGroup>
        <div className="mt-3 flex">
          {displayHeart && (
            <div className="flex">
              <div className="text-3xl hover: cursor-pointer mr-1" onClick={handleAddHeart}>
                <AiFillHeart style={{ color: "gray" }} />
              </div>
              <div className="text-base mt-0.5 mr-8 hover: cursor-pointer" onClick={handleShowLikeList}>
                {heart?.length} lượt thích
              </div>
            </div>
          )}

          {!displayHeart && (
            <div className="flex">
              <div className="text-3xl hover: cursor-pointer mr-1" onClick={handleAddHeart}>
                <AiFillHeart style={{ color: "red" }} />
              </div>
              <div className="text-base mt-0.5 mr-8 hover: cursor-pointer" onClick={handleShowLikeList}>
                {heart?.length + 1} lượt thích
              </div>
            </div>
          )}
          <div className="flex flex-1 hover:cursor-pointer">
            <div className="mr-1 text-lg">Comment</div>
            <div className="text-base mt-0.5 mr-1">({comment?.length})</div> <BiComment className=" text-2xl mt-1" />
          </div>
        </div>
      </Card>
      <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
        {likeList.map((item, index) => {
          return (
            <div className="flex mt-2" key={index}>
              <AiFillHeart style={{ color: "red" }} className="mr-3 mt-2 text-2xl" />
              <Avatar size="large" src={item?.photoURL} className="text-2xl mr-1 bg-slate-100 cursor-pointer">
                {item?.photoURL ? "" : item?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <div className="mt-2 ml-1">{item?.name}</div>
            </div>
          );
        })}
      </Modal>
    </div>
  );
}
