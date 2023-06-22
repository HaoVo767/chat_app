import React, { useEffect, useState } from "react";
import { Card, Input, Button } from "antd";
import { Upload } from "antd";
import ImgCrop from "antd-img-crop";

export default function CreateNew() {
  const { TextArea } = Input;
  const [fileList, setFileList] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [textValue, setTextValue] = useState("");
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const handleChangeTextValue = (e) => {
    setTextValue(e.target.value);
  };

  const handleAddPost = () => {
    let list = [];
    fileList.map((file) => {
      list.push(file.thumbUrl);
    });
    return fetch("", {
      body: JSON.stringify({
        creator: user.displayName,
        postContent: textValue,
        media: list,
        comment: [],
        heart: [],
      }),
    });
  };
  return (
    <div className="">
      <Card
        title="Status"
        bordered={false}
        style={{
          width: "50%",
          margin: "auto",
        }}
        extra={
          <Button style={{ color: "#fff", background: "#1677ff" }} onClick={handleAddPost}>
            Đăng
          </Button>
        }
      >
        <TextArea rows={4} value={textValue} onChange={handleChangeTextValue} />
        <div className="mt-2"></div>
        <ImgCrop rotationSlider>
          <Upload
            // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            fileList={fileList}
            onChange={onChange}
            onPreview={onPreview}
          >
            {fileList.length < 6 && "+ Upload"}
          </Upload>
        </ImgCrop>
      </Card>
    </div>
  );
}
