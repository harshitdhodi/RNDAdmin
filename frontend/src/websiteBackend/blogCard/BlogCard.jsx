import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from 'react-toastify';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const BlogCardForm = () => {
  const [form] = Form.useForm();
  const [blogCard, setBlogCard] = useState('');
  const [displayContent, setDisplayContent] = useState('');
  const [blogCardId, setBlogCardId] = useState(null);
;

  const fetchBlogCard = async () => {
    try {
      const response = await axios.get('/api/blogCard/getCard');
      const blogCardData = response.data[0];
      setBlogCardId(blogCardData._id);
      setBlogCard(blogCardData.blogCard);

      const parser = new DOMParser();
      const doc = parser.parseFromString(blogCardData.blogCard, 'text/html');
      const elements = doc.getElementsByTagName('*');
      for (let element of elements) {
        if (element.style.color === 'white' || element.style.color === '#ffffff') {
          element.style.color = 'black';
        }
      }
      setDisplayContent(doc.body.innerHTML);
      form.setFieldsValue({ blogCard: blogCardData.blogCard });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch blog card.', variant: 'destructive' });
    }
  };

  useEffect(() => {
    fetchBlogCard();
  }, [form]);

  const handleEditorChange = (newContent) => {
    setBlogCard(newContent);
    const parser = new DOMParser();
    const doc = parser.parseFromString(newContent, 'text/html');
    const elements = doc.getElementsByTagName('*');
    for (let element of elements) {
      if (element.style.color === 'white' || element.style.color === '#ffffff') {
        element.style.color = 'black';
      }
    }
    setDisplayContent(doc.body.innerHTML);
  };

  const onFinish = async () => {
    try {
      if (blogCardId) {
        await axios.put(`/api/blogCard/editCard/${blogCardId}`, { blogCard });
        toast({ title: 'Success', description: 'Blog card updated successfully!' });
      } else {
        await axios.post('/api/blogCard/addCard', { blogCard });
        toast({ title: 'Success', description: 'Blog card added successfully!' });
      }
      form.resetFields();
      setBlogCard('');
      setDisplayContent('');
      fetchBlogCard();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save blog card.', variant: 'destructive' });
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-xl font-bold">Blog Card Form</h2>
      </CardHeader>
      <CardContent>
        <Form form={form} layout="vertical" onFinish={onFinish} name="blog_card_form">
          <div className="mb-4">
            <Label htmlFor="blogCard">Blog Card Content</Label>
            <ReactQuill
              id="blogCard"
              value={displayContent || blogCard}
              onChange={handleEditorChange}
              modules={{
                toolbar: [
                  [{ header: '1' }, { header: '2' }, { font: [] }],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['bold', 'italic', 'underline', 'blockquote'],
                  [{ align: [] }],
                  ['link', 'image', 'video'],
                  ['clean']
                ]
              }}
              formats={[
                'header', 'font', 'list', 'bold', 'italic', 'underline',
                'blockquote', 'align', 'link', 'image', 'video'
              ]}
            />
          </div>
          <Button type="submit" className="w-full">
            {blogCardId ? 'Update Blog Card' : 'Add Blog Card'}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BlogCardForm;