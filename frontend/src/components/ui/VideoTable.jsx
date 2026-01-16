import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VideoTable = () => {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  const fetchVideos = async () => {
    try {
      const response = await axios.get('/api/video/getVideos');
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await axios.delete(`/api/video/deleteVideo?id=${id}`);
        fetchVideos();
      } catch (error) {
        console.error("Error deleting video:", error);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/video-form?id=${id}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Video Management</h1>
        <Button onClick={() => navigate('/video-form')}>
          <Plus className="mr-2 h-4 w-4" /> Add New Video
        </Button>
      </div>

      <div className="overflow-x-auto border rounded-lg shadow">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-6 py-3">Heading</th>
              <th className="px-6 py-3">Subheading</th>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Video</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos.length > 0 ? (
              videos.map((video) => (
                <tr key={video._id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{video.heading}</td>
                  <td className="px-6 py-4">{video.subheading}</td>
                  <td className="px-6 py-4">
                    {video.image ? (
                      <img
                        src={`/api/uploads/${video.image}`}
                        alt={video.alt || "Video Thumbnail"}
                        className="h-16 w-24 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {video.video ? (
                      <video
                        src={`/api/video/download/${video.video}`}
                        className="h-16 w-24 object-cover rounded"
                        controls
                        preload="metadata"
                      />
                    ) : (
                      <span className="text-gray-400">No Video</span>
                    )}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(video._id)}>
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(video._id)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No videos found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VideoTable;