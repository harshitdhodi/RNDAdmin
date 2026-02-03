import { React, useEffect, useState } from 'react';
import { Table, Button, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useGetAboutUsQuery, useDeleteAboutUsMutation } from '../../slice/aboutUs/aboutUs';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";

const AboutUsTable = () => {
  const navigate = useNavigate();
  const { data: aboutUsData, isLoading } = useGetAboutUsQuery();
  const [deleteAboutUs] = useDeleteAboutUsMutation();
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");

  const notify = () => {
    toast.success("Updated Successfully!");
  };

  const handleDelete = async (id) => {
    try {
      await deleteAboutUs(id);
      message.success('About Us entry deleted successfully');
    } catch (error) {
      message.error('Failed to delete About Us entry');
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '10%',
    },
    {
      title: 'Short Description',
      dataIndex: 'shortDescription',
      key: 'shortDescription',
      ellipsis: true,
      width: '40%',
      render: (shortDescription) => (
        <div dangerouslySetInnerHTML={{ __html: shortDescription }} />
      ),
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: '15%',
      render: (image) => (
        <img
          src={`/api/image/download/${image}`}
          alt="About Us"
          className='w-[100px] h-[50px] object-cover'
        />
      ),
    },

    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      render: (_, record) => (
        <Space>
          <Button
            type='button'
            icon={<EditOutlined />}
            onClick={() => navigate(`/edit-about-us-form/${record._id}`)}
            className=' bg-[#ebb207] text-white hover:bg-yellow-700 transition whitespace-nowrap'
          >
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          >
          </Button>
        </Space>
      ),
    },
  ];

  const fetchHeadings = async () => {
    try {
      const response = await axios.get('/api/pageHeading/heading?pageType=aboutus', { withCredentials: true });
      const { heading, subheading } = response.data;
      setHeading(heading || '');
      setSubheading(subheading || '');
    } catch (error) {
      console.error(error);
    }
  };

  const saveHeadings = async () => {
    console.log("Save Called");

    try {
      await axios.put('/api/pageHeading/updateHeading?pageType=aboutus', {
        pagetype: 'aboutus',
        heading,
        subheading,
      }, { withCredentials: true });
      notify();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHeadings();
  }, []);

  const handleHeadingChange = (e) => setHeading(e.target.value);
  const handleSubheadingChange = (e) => setSubheading(e.target.value);

  return (
    <div className='p-4'>
      <ToastContainer />
      <div className="mb-8 border border-gray-200 shadow-lg p-4 rounded ">
        <div className="grid md:grid-cols-2 md:gap-2 grid-cols-1">
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">Heading</label>
            <input
              type="text"
              value={heading}
              onChange={handleHeadingChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-yellow-500 transition duration-300"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">Sub heading</label>
            <input
              type="text"
              value={subheading}
              onChange={handleSubheadingChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-yellow-500 transition duration-300"
            />
          </div>
        </div>
        <button
          onClick={saveHeadings}
          className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300 font-serif"
        >
          Save
        </button>
      </div>
      <div className='flex justify-between p-6 items-center'>

        <div className='text-2xl font-bold'>
          <h1>About Us</h1>
        </div>
        <div>
          <Button
            type="button"
            icon={<PlusOutlined />}
            onClick={() => navigate('/about-us-form')}
            className='px-3 py-5 bg-[#ebb207] text-white !font-bold rounded-lg hover:bg-yellow-700 transition whitespace-nowrap'
          >
            Add About Us
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={aboutUsData}
        loading={isLoading}
        rowKey="_id"
        pagination={false}
      />
    </div>
  );
};

export default AboutUsTable;
