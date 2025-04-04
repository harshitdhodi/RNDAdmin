import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CareerInfoForm = () => {
  const [form] = Form.useForm();
  const [info, setInfo] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [careerInfo, setCareerInfo] = useState(null);

  const fetchCareerInfo = async () => {
    try {
      const response = await axios.get("/api/careerInfo");
      if (response.data.length > 0) {
        const data = response.data[0];
        setCareerInfo(data);
        setInfo(data.info);
        form.setFieldsValue({ info: data.info });
        if (data.image) {
          setImageUrl(`/api/image/download/${data.image}`);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch career info.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCareerInfo();
  }, [form]);

  const handleInfoChange = (newInfo) => {
    setInfo(newInfo);

    // Convert white text to black for visibility
    const parser = new DOMParser();
    const doc = parser.parseFromString(newInfo, "text/html");
    const elements = doc.getElementsByTagName("*");
    for (let element of elements) {
      if (element.style.color === "white" || element.style.color === "#ffffff") {
        element.style.color = "black";
      }
    }
    setInfo(doc.body.innerHTML);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file)); // Show preview
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("info", info);
    if (image) {
      formData.append("image", image);
    }

    try {
      if (careerInfo) {
        await axios.put(`/api/careerInfo/${careerInfo._id}`, formData);
        toast({ title: "Success", description: "Career info updated successfully!" });
      } else {
        await axios.post("/api/careerInfo", formData);
        toast({ title: "Success", description: "Career info created successfully!" });
      }
      fetchCareerInfo();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save career info.", variant: "destructive" });
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-xl font-bold">Career Info</h2>
      </CardHeader>
      <CardContent>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="info">Info</Label>
            <ReactQuill
              id="info"
              value={info}
              onChange={handleInfoChange}
              modules={{
                toolbar: [
                  [{ header: "1" }, { header: "2" }, { font: [] }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["bold", "italic", "underline", "blockquote"],
                  [{ align: [] }],
                  ["link", "image", "video"],
                  ["clean"],
                ],
              }}
              formats={[
                "header",
                "font",
                "list",
                "bold",
                "italic",
                "underline",
                "blockquote",
                "align",
                "link",
                "image",
                "video",
              ]}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="image">Image</Label>
            {imageUrl && <img className="w-32 mb-2 rounded" src={imageUrl} alt="Career Info" />}
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <Button type="submit" className="w-full">
            {careerInfo ? "Update Career Info" : "Submit Career Info"}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CareerInfoForm;
