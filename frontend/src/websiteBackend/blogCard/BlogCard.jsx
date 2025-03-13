import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, message } from 'antd';
import JoditEditor from 'jodit-react';

const BlogCardForm = () => {
  const [form] = Form.useForm();
  const [blogCard, setBlogCard] = useState('');
  const [displayContent, setDisplayContent] = useState(''); // New state for display
  const [blogCardId, setBlogCardId] = useState(null);

  const editorRef = useRef(null);

  const config = {
    uploader: { insertImageAsBase64URI: true },
    toolbarAdaptive: false,
    toolbarSticky: false,
    buttons: [
      'bold',
      'italic',
      'underline',
      'ul',
      'ol',
      'fontsize',
      'paragraph',
      'link',
      'image',
      'video',
      'table',
      'align',
      'undo',
      'redo',
      'font',
      'fontsize',
      'brush',
      'foreColor',
      'backColor',
    ],
    // Force black text in editor display
    style: {
      color: 'black'
    }
  };

  const fetchBlogCard = async () => {
    try {
      const response = await axios.get('/api/blogCard/getCard');
      const blogCardData = response.data[0];
      console.log(response);
      setBlogCardId(blogCardData._id);
      
      // Store original content (with white text)
      setBlogCard(blogCardData.blogCard);
      
      // Convert white text to black for display
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
      console.error('Failed to fetch blog card:', error);
      message.error('Failed to fetch blog card.');
    }
  };

  useEffect(() => {
    fetchBlogCard();
  }, [form]);

  const handleEditorChange = (newContent) => {
    // Keep the original content with white text in blogCard state
    setBlogCard(newContent);
    
    // Convert white text to black for display
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

  const onFinish = async (values) => {
    try {
      if (blogCardId) {
        // Update existing blog card
        await axios.put(`/api/blogCard/editCard/${blogCardId}`, {
          blogCard: blogCard,
        });
        message.success('Blog card updated successfully!');
      } else {
        // Add new blog card
        await axios.post('/api/blogCard/addCard', {
          blogCard: blogCard,
        });
        message.success('Blog card added successfully!');
      }
      form.resetFields();
      setBlogCard('');
      setDisplayContent('');
      fetchBlogCard(); // Fetch the updated data
    } catch (error) {
      console.error('Failed to save blog card:', error);
      message.error('Failed to save blog card.');
    }
  };

  return (
    <Form 
      form={form} 
      layout="vertical" 
      onFinish={onFinish}
      name="blog_card_form"
    >
      <Form.Item
        name="blogCard"
        label="Blog Card Content"
        rules={[{ required: true, message: 'Please input the blog card content!' }]}
      >
        <JoditEditor 
          ref={editorRef} 
          value={displayContent || blogCard} // Use displayContent if available
          config={config} 
          onChange={handleEditorChange}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {blogCardId ? 'Update Blog Card' : 'Add Blog Card'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BlogCardForm;