import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, message, Breadcrumb } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const PrivacyForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [privacyPolicy, setPrivacyPolicy] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isExistingData, setIsExistingData] = useState(false);
  const [privacyId, setPrivacyId] = useState(null);

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
    const fetchPrivacyData = async () => {
      try {
        const response = await axios.get('/api/privacy');
        if (response.data.length > 0) {
          const privacyData = response.data[0];
          setPrivacyPolicy(privacyData.privacyPolicy);
          setPrivacyId(privacyData._id);
          form.setFieldsValue({
            privacyPolicy: privacyData.privacyPolicy,
          });
          setIsExistingData(true);
        }
      } catch (error) {
        message.error('Failed to fetch privacy data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrivacyData();
  }, [form]);

  const handleEditorChange = (content) => {
    setPrivacyPolicy(content);
    // Update form field value to trigger validation
    form.setFieldsValue({ privacyPolicy: content });
  };

  const handleFinish = async () => {
    try {
      const dataToSend = { privacyPolicy };
      
      if (isExistingData) {
        await axios.put(`/api/privacy/${privacyId}`, dataToSend);
        message.success('Privacy data updated successfully');
      } else {
        await axios.post('/api/privacy/add', dataToSend);
        message.success('Privacy data created successfully');
      }
      navigate('/privacypolicy-terms');
    } catch (error) {
      message.error('Failed to save privacy data');
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
        <Breadcrumb.Item>Privacy Form</Breadcrumb.Item>
      </Breadcrumb>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item 
          name="privacyPolicy" 
          label="Privacy Policy" 
          rules={[
            { 
              required: true, 
              message: 'Please enter the privacy policy' 
            },
            {
              validator: (_, value) => {
                // Check if content is empty (Quill returns '<p><br></p>' for empty content)
                const textContent = value?.replace(/<[^>]*>/g, '').trim();
                if (!textContent || textContent === '') {
                  return Promise.reject('Please enter the privacy policy');
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <ReactQuill
            theme="snow"
            value={privacyPolicy}
            onChange={handleEditorChange}
            modules={modules}
            formats={formats}
            placeholder="Start typing your privacy policy..."
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

export default PrivacyForm;