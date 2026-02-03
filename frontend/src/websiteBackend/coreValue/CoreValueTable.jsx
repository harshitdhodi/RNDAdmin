import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Breadcrumb, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, HomeOutlined } from '@ant-design/icons';
import { useGetAllCoreValuesQuery, useDeleteCoreValueMutation } from '../../slice/coreValue/coreValue';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";

const CoreValueTable = () => {
  const navigate = useNavigate();
  const { data: coreValueData, isLoading } = useGetAllCoreValuesQuery();
  const [deleteCoreValue] = useDeleteCoreValueMutation();
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");

  const handleDelete = async (id) => {
    try {
      await deleteCoreValue(id);
      message.success('Core Value deleted successfully');
    } catch (error) {
      message.error('Failed to delete Core Value');
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
          alt="Core Value"
          className="w-36 h-12 object-contain"
        />

      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '20%',
    },
    {
      title: 'details',
      dataIndex: 'details',
      key: 'details',
      width: '30%',
      render: (text) => <div dangerouslySetInnerHTML={{ __html: text?.substring(0, 50) + '...' }} />
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/edit-core-value/${record._id}`)}
          />
          <Popconfirm
            title="Delete Core Value"
            details="Are you sure you want to delete this core value?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const notify = () => {
    toast.success("Updated Successfully!");
  };

  const fetchHeadings = async () => {
    try {
      const response = await axios.get('/api/pageHeading/heading?pageType=coreValue', { withCredentials: true });
      const { heading, subheading } = response.data;
      setHeading(heading || '');
      setSubheading(subheading || '');
    } catch (error) {
      console.error(error);
    }
  };

  const saveHeadings = async () => {

    try {
      await axios.put('/api/pageHeading/updateHeading?pageType=coreValue', {
        pagetype: 'coreValue',
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
        <Breadcrumb.Item>Core Value Management</Breadcrumb.Item>
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
          <h1>Core Value Management</h1>
        </div>
        <div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/add-core-value')}
            className='mb-4'
          >
            Add New Core Value
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={coreValueData}
        loading={isLoading}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default CoreValueTable;