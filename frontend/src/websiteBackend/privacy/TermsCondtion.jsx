import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, message, Breadcrumb } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const TermsConditionForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [termsCondition, setTermsCondition] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isExistingData, setIsExistingData] = useState(false);
  const [termsConditionId, setTermsConditionId] = useState(null);

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
    const fetchTermsConditionData = async () => {
      try {
        const response = await axios.get('/api/terms');
        if (response.data.length > 0) {
          const termsConditionData = response.data[0];
          setTermsCondition(termsConditionData.termsCondition);
          setTermsConditionId(termsConditionData._id);
          form.setFieldsValue({
            termsCondition: termsConditionData.termsCondition,
          });
          setIsExistingData(true);
        }
      } catch (error) {
        message.error('Failed to fetch terms and conditions data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTermsConditionData();
  }, [form]);

  const handleEditorChange = (content) => {
    setTermsCondition(content);
    // Update form field value to trigger validation
    form.setFieldsValue({ termsCondition: content });
  };

  const handleFinish = async () => {
    try {
      const dataToSend = { termsCondition };
      
      if (isExistingData) {
        await axios.put(`/api/terms/${termsConditionId}`, dataToSend);
        message.success('Terms and conditions updated successfully');
      } else {
        await axios.post('/api/terms/add', dataToSend);
        message.success('Terms and conditions created successfully');
      }
      // navigate('/termscondition');
    } catch (error) {
      message.error('Failed to save terms and conditions');
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
        <Breadcrumb.Item>Terms and Conditions Form</Breadcrumb.Item>
      </Breadcrumb>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item 
          name="termsCondition" 
          label="Terms and Conditions" 
          rules={[
            { 
              required: true, 
              message: 'Please enter the terms and conditions' 
            },
            {
              validator: (_, value) => {
                // Check if content is empty (Quill returns '<p><br></p>' for empty content)
                const textContent = value?.replace(/<[^>]*>/g, '').trim();
                if (!textContent || textContent === '') {
                  return Promise.reject('Please enter the terms and conditions');
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <ReactQuill
            theme="snow"
            value={termsCondition}
            onChange={handleEditorChange}
            modules={modules}
            formats={formats}
            placeholder="Start typing your terms and conditions..."
            style={{ height: '400px', marginBottom: '50px' }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isExistingData ? 'Update' : 'Save'}
          </Button>
        </Form.Item>
      </Form>

      {/* Custom CSS for better Quill editor styling */}
      <style jsx>{`
        /* Quill Editor Customization */
        :global(.ql-container) {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          font-size: 16px;
        }

        :global(.ql-toolbar) {
          background-color: #fafafa;
          border: 1px solid #d9d9d9;
          border-bottom: none;
          border-radius: 6px 6px 0 0;
        }

        :global(.ql-container.ql-snow) {
          border: 1px solid #d9d9d9;
          border-radius: 0 0 6px 6px;
        }

        :global(.ql-editor) {
          min-height: 400px;
          font-size: 16px;
          line-height: 1.6;
        }

        :global(.ql-editor.ql-blank::before) {
          color: #bfbfbf;
          font-style: normal;
        }

        /* Toolbar button hover effects */
        :global(.ql-toolbar button:hover),
        :global(.ql-toolbar button:focus) {
          color: #1890ff;
        }

        :global(.ql-toolbar button.ql-active) {
          color: #1890ff;
        }

        :global(.ql-toolbar .ql-stroke) {
          stroke: #595959;
        }

        :global(.ql-toolbar button:hover .ql-stroke),
        :global(.ql-toolbar button:focus .ql-stroke),
        :global(.ql-toolbar button.ql-active .ql-stroke) {
          stroke: #1890ff;
        }

        :global(.ql-toolbar .ql-fill) {
          fill: #595959;
        }

        :global(.ql-toolbar button:hover .ql-fill),
        :global(.ql-toolbar button:focus .ql-fill),
        :global(.ql-toolbar button.ql-active .ql-fill) {
          fill: #1890ff;
        }

        /* Picker hover effects */
        :global(.ql-toolbar .ql-picker-label:hover),
        :global(.ql-toolbar .ql-picker-item:hover) {
          color: #1890ff;
        }

        /* Editor content styling */
        :global(.ql-editor h1) {
          font-size: 2em;
          font-weight: 700;
          margin-bottom: 0.5em;
        }

        :global(.ql-editor h2) {
          font-size: 1.5em;
          font-weight: 600;
          margin-bottom: 0.5em;
        }

        :global(.ql-editor h3) {
          font-size: 1.25em;
          font-weight: 600;
          margin-bottom: 0.5em;
        }

        :global(.ql-editor p) {
          margin-bottom: 1em;
        }

        :global(.ql-editor ul),
        :global(.ql-editor ol) {
          padding-left: 1.5em;
          margin-bottom: 1em;
        }

        :global(.ql-editor blockquote) {
          border-left: 4px solid #1890ff;
          padding-left: 16px;
          margin: 1em 0;
          font-style: italic;
          color: #595959;
        }

        :global(.ql-editor a) {
          color: #1890ff;
          text-decoration: underline;
        }

        :global(.ql-editor a:hover) {
          color: #40a9ff;
        }

        :global(.ql-editor img) {
          max-width: 100%;
          height: auto;
        }

        /* Focus state */
        :global(.ql-container.ql-snow:focus-within) {
          border-color: #40a9ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
        }

        /* Scrollbar styling */
        :global(.ql-editor::-webkit-scrollbar) {
          width: 8px;
        }

        :global(.ql-editor::-webkit-scrollbar-track) {
          background: #f1f1f1;
        }

        :global(.ql-editor::-webkit-scrollbar-thumb) {
          background: #d9d9d9;
          border-radius: 4px;
        }

        :global(.ql-editor::-webkit-scrollbar-thumb:hover) {
          background: #bfbfbf;
        }
      `}</style>
    </>
  );
};

export default TermsConditionForm;