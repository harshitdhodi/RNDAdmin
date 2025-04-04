import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const EventForm = () => {
  const [events, setEvents] = useState("");
  const [eventId, setEventId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/events/getEvent?t=${new Date().getTime()}`);
      const eventData = response.data[0];
      setEventId(eventData._id);
      setEvents(eventData.events);
    } catch (error) {
      console.error("Failed to fetch event:", error);
      toast.error("Failed to fetch event.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  const handleChange = (newContent) => {
    setEvents(newContent);
  };

  const handleUpdate = async () => {
    try {
      if (!eventId) {
        toast.error("No event ID available");
        return;
      }
      setLoading(true);
      await axios.put(`/api/events/editEvent/${eventId}`, { events });
      toast.success("Event updated successfully!");
      await fetchEvent();
    } catch (error) {
      console.error("Failed to update event:", error);
      toast.error("Failed to update event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Event</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Event Description</label>
        <ReactQuill 
          value={events} 
          onChange={handleChange} 
          modules={{ toolbar: [['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['link', 'image']] }} 
          className="border rounded-md"
        />
      </div>

      <div className="flex gap-3">
        <Button onClick={handleUpdate} disabled={loading}>
          {loading ? "Updating..." : "Update Event"}
        </Button>
        <Button variant="outline" onClick={fetchEvent} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>
    </Card>
  );
};

export default EventForm;
