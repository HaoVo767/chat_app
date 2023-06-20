import React, { useEffect, useState } from "react";
import { Card, Input, Button } from "antd";
import { Upload } from "antd";
import ImgCrop from "antd-img-crop";

export default function CreateNew() {
  const { TextArea } = Input;
  const [fileList, setFileList] = useState([]);
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
  useEffect(() => {
    console.log(fileList);
  }, [fileList]);
  return (
    <div className="">
      <Card
        title="Status"
        bordered={false}
        style={{
          width: "50%",
          margin: "auto",
        }}
        extra={<Button style={{ color: "#fff", background: "#1677ff" }}>Đăng</Button>}
      >
        <TextArea rows={4} />
        <div className="mt-2"></div>
        <ImgCrop rotationSlider>
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            fileList={fileList}
            onChange={onChange}
            onPreview={onPreview}
          >
            {fileList.length < 7 && "+ Upload"}
          </Upload>
        </ImgCrop>
      </Card>
    </div>
  );
}
