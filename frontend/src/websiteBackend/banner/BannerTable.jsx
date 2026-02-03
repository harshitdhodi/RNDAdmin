import { React, useEffect, useState } from 'react';
import { Table, Button, Space, message, Breadcrumb } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, HomeOutlined } from '@ant-design/icons';
import { useGetAllBannersQuery, useDeleteBannerMutation } from '../../slice/banner/banner';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";

const BannerTable = () => {
  const navigate = useNavigate();
  const { data: bannerData, isLoading } = useGetAllBannersQuery();
  const [deleteBanner] = useDeleteBannerMutation();
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");

  const handleDelete = async (id) => {
    try {
      await deleteBanner(id);
      message.success('Banner deleted successfully');
    } catch (error) {
      message.error('Failed to delete banner');
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: '20%',
      render: (image) => (
        <img
          src={`/api/image/download/${image}`}
          alt="Banner"
          className="w-36 h-12 object-cover"
        />

      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '15%',
    },
    {
      title: 'Heading',
      dataIndex: 'heading',
      key: 'heading',
      width: '15%',
      render: (text) => text || '-',
    },
    {
      title: 'Subheading',
      dataIndex: 'subheading',
      key: 'subheading',
      width: '15%',
      render: (text) => text || '-',
    },
    {
      title: 'Page Slug',
      dataIndex: 'pageSlug',
      key: 'pageSlug',
      width: '15%',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      render: (_, record) => (
        <Space>
          <Button
            type="button"
            icon={<EditOutlined />}
            onClick={() => navigate(`/edit-banner-form/${record._id}`)}
            className='bg-[#ebb207] text-white hover:bg-yellow-700 transition whitespace-nowrap'
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  const notify = () => {
    toast.success("Updated Successfully!");
  };

  const fetchHeadings = async () => {
    try {
      const response = await axios.get('/api/pageHeading/heading?pageType=banner', { withCredentials: true });
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
      await axios.put('/api/pageHeading/updateHeading?pageType=banner', {
        pagetype: 'banner',
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
    <div>
      <Breadcrumb className='px-4 py-6'>

        <Breadcrumb.Item>
          <Link to="/dashboard">
            <HomeOutlined /> Dashboard
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Banner Management</Breadcrumb.Item>
      </Breadcrumb>
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

      <div className='p-6 flex justify-between items-center'>

        <div className='text-2xl font-bold'>
          <h1>Banner Management</h1>
        </div>
        <div>
          <Button
            type='button'
            icon={<PlusOutlined />}
            onClick={() => navigate('/add-banner')}
            className='px-3 py-5 bg-[#ebb207] text-white !font-bold rounded-lg hover:bg-yellow-700 transition whitespace-nowrap'
          >
            Add New Banner
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={bannerData}
        loading={isLoading}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default BannerTable;