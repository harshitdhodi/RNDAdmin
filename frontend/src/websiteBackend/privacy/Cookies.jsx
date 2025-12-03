import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, message, Breadcrumb } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const CookiesForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [cookiesPolicy, setCookiesPolicy] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isExistingData, setIsExistingData] = useState(false);
  const [cookiesId, setCookiesId] = useState(null);

  // Quill modules configuration
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [
          { list: 'ordered' },
          { list: 'bullet' },
          { indent: '-1' },
          { indent: '+1' },
        ],
        ['link', 'image', 'video'],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        ['clean'],
      ],
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  // Quill formats
  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
    'align',
    'color',
    'background',
  ];

  useEffect(() => {
    const fetchCookiesData = async () => {
      try {
        const response = await axios.get('/api/cookies');
        if (response.data.length > 0) {
          const cookiesData = response.data[0];
          setCookiesPolicy(cookiesData.cookiesPolicy);
          setCookiesId(cookiesData._id);
          form.setFieldsValue({
            cookiesPolicy: cookiesData.cookiesPolicy,
          });
          setIsExistingData(true);
        }
      } catch (error) {
        message.error('Failed to fetch cookies data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCookiesData();
  }, [form]);

  const handleEditorChange = (content) => {
    setCookiesPolicy(content);
    // Update form field value to trigger validation
    form.setFieldsValue({ cookiesPolicy: content });
  };
  
  const handleFinish = async () => {
    try {
      const dataToSend = { cookiesPolicy };
      
      if (isExistingData) {
        await axios.put(`/api/cookies/${cookiesId}`, dataToSend);
        message.success('Cookies data updated successfully');
      } else {
        await axios.post('/api/cookies', dataToSend);
        message.success('Cookies data created successfully');
      }
      navigate('/cookies-policy');
    } catch (error) {
      message.error('Failed to save cookies data');
      console.error('Error:', error);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <Breadcrumb className='mb-4'>
        <Breadcrumb.Item>
          <Link to="/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Cookies Form</Breadcrumb.Item>
      </Breadcrumb>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item 
          name="cookiesPolicy" 
          label="Cookies Policy" 
          rules={[
            { 
              required: true, 
              message: 'Please enter the cookies policy' 
            },
            {
              validator: (_, value) => {
                // Check if content is empty (Quill returns '<p><br></p>' for empty content)
                const textContent = value?.replace(/<[^>]*>/g, '').trim();
                if (!textContent || textContent === '') {
                  return Promise.reject('Please enter the cookies policy');
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <ReactQuill
            theme="snow"
            value={cookiesPolicy}
            onChange={handleEditorChange}
            modules={modules}
            formats={formats}
            placeholder="Start typing your cookies policy..."
            style={{ height: '400px', marginBottom: '50px' }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isExistingData ? 'Update' : 'Save'}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default CookiesForm;