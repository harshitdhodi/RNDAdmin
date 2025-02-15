import React, { useState } from "react";
import { Form, Input, Upload, Button, message, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const ImageUploadForm = () => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [preview, setPreview] = useState(null);

  const onFinish = async (values) => {
    if (fileList.length === 0) {
      message.error("Please upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", fileList[0].originFileObj);
    formData.append("altText", values.altText);
    formData.append("title", values.title);

    setLoading(true);
    try {
      const response = await axios.post("/api/slideShow/addimages", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Image uploaded successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      message.error("Failed to upload image.");
      console.error(error);
    } finally {
      setLoading(false);
      setFileList([]);
      setPreview(null); // Clear preview after upload
    }
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList.slice(-1)); // Keep only the latest file

    // Generate preview URL
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="flex justify-center bg-gray-100 ">
      <Card className="w-full max-w-4lg shadow-lg rounded-xl ">
        <h2 className="text-xl font-semibold text-center mb-4">Upload Image</h2>
        <Form layout="vertical" onFinish={onFinish}>
          {/* Image Title */}
          <Form.Item
            label="Image Title"
            name="title"
            rules={[{ required: true, message: "Please enter image title" }]}
          >
            <Input placeholder="Enter image title" />
          </Form.Item>

          {/* Alt Name */}
          <Form.Item
            label="Alt Name"
            name="altText"
            rules={[{ required: true, message: "Please enter alt text" }]}
          >
            <Input placeholder="Enter alt text" />
          </Form.Item>

          {/* Image Upload */}
          <Form.Item label="Upload Image">
            <Upload
              fileList={fileList}
              beforeUpload={() => false} // Prevent auto upload
              maxCount={1}
              onChange={handleFileChange}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Form.Item>

          {/* Image Preview */}
          {preview && (
            <div className="flex justify-center mb-4">
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border border-gray-300"
              />
            </div>
          )}

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              className="mt-4"
            >
              {loading ? "Uploading..." : "Upload Image"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ImageUploadForm;
