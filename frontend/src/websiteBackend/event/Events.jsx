import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, message } from 'antd';
import JoditEditor from 'jodit-react';

const EventForm = () => {
  const [form] = Form.useForm();
  const [events, setEvents] = useState('');
  const [eventId, setEventId] = useState(null); // Added to store the event ID

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
    ],
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get('/api/events/getEvent');
        const eventData = response.data[0];
        setEventId(eventData._id); // Store the ID in state
        setEvents(eventData.events);
        form.setFieldsValue({ events: eventData.events });
      } catch (error) {
        console.error('Failed to fetch event:', error);
        message.error('Failed to fetch event.');
      }
    };

    fetchEvent();
  }, [form]);

  const onFinish = async (values) => { // Changed to accept form values
    try {
      if (!eventId) {
        message.error('No event ID available');
        return;
      }

      await axios.put(`/api/events/editEvent/${eventId}`, {
        events: events,
      });
      message.success('Event updated successfully!');
      form.resetFields();
      setEvents('');
    } catch (error) {
      console.error('Failed to update event:', error);
      message.error('Failed to update event.');
    }
  };

  return (
    <Form 
      form={form} 
      layout="vertical" 
      onFinish={onFinish}
      name="event_form" // Added form name
    >
      <Form.Item
        name="events" // Added name prop to link with form
        label="Event Description"
        rules={[{ required: true, message: 'Please input the event details!' }]}
      >
        <JoditEditor 
          ref={editorRef} 
          value={events} 
          config={config} 
          onChange={(newContent) => setEvents(newContent)} // Fixed onChange handler
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Update Event
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EventForm;