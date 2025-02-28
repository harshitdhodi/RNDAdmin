import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, message } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EventForm = () => {
  const [form] = Form.useForm();
  const [events, setEvents] = useState('');

  // Quill Image Handler
  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Image = reader.result;
          const quill = document.querySelector('.ql-editor');
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', base64Image);
        };
        reader.readAsDataURL(file);
      }
    };
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: '1' }, { header: '2' }, { font: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        ['link', 'image'], // Image button added
        ['clean'],
      ],
      handlers: {
        image: handleImageUpload,
      },
    },
  };

  const onFinish = async (values) => {
    try {
      await axios.post('/api/events/addEvent', {
        events, // Sending only events field
      });
      message.success('Event added successfully!');
      form.resetFields();
      setEvents('');
    } catch (error) {
      console.error('Failed to add event:', error);
      message.error('Failed to add event.');
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Event Description"
        rules={[{ required: true, message: 'Please input the event details!' }]}
      >
        <ReactQuill value={events} onChange={setEvents} modules={modules} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Event
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EventForm;
