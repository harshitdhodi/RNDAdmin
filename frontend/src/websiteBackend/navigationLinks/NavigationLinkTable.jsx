<<<<<<< HEAD
import React from 'react';
import { Table, Button, Space, message, Breadcrumb } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useGetAllNavigationLinksQuery, useDeleteNavigationLinkMutation } from '@/slice/navigationLink/navigationSlice';

const NavigationLinkTable = () => {
  const navigate = useNavigate();
  const { data: navigationLinks, isLoading } = useGetAllNavigationLinksQuery();
  const [deleteNavigationLink] = useDeleteNavigationLinkMutation();

  const handleDelete = async (id) => {
    try {
      await deleteNavigationLink(id).unwrap();
      message.success('Navigation link deleted successfully');
    } catch (error) {
      message.error('Failed to delete navigation link');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Icon',
      dataIndex: 'icon',
      key: 'icon',
      render: (icon) => (
        <img
          src={`/api/logo/download/${icon}`}
          alt="Icon"
          className="w-12 h-12 object-contain"
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/edit-navigation-link/${record._id}`)}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          />
        </div>
      ),
    },
  ];
  

  if (isLoading) return <p>Loading...</p>;

  return (
<>
  <div className="mb-4">
    <Breadcrumb>
      <Breadcrumb.Item>
        <Link to="/dashboard">Dashboard</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>Navigation Links</Breadcrumb.Item>
    </Breadcrumb>
  </div>

  <div className="flex justify-between items-center mb-4">
    <h1 className="font-bold text-2xl">Navigation Links</h1>
    <Button
      type="primary"
      icon={<PlusOutlined />}
      onClick={() => navigate('/navigationLink-form')}
    >
      Add Navigation Link
    </Button>
  </div>

  <Table columns={columns} dataSource={navigationLinks} rowKey="_id" />
</>

  );
};

=======
import React from 'react';
import { Table, Button, Space, message, Breadcrumb } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useGetAllNavigationLinksQuery, useDeleteNavigationLinkMutation } from '@/slice/navigationLink/navigationSlice';

const NavigationLinkTable = () => {
  const navigate = useNavigate();
  const { data: navigationLinks, isLoading } = useGetAllNavigationLinksQuery();
  const [deleteNavigationLink] = useDeleteNavigationLinkMutation();

  const handleDelete = async (id) => {
    try {
      await deleteNavigationLink(id).unwrap();
      message.success('Navigation link deleted successfully');
    } catch (error) {
      message.error('Failed to delete navigation link');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Icon',
      dataIndex: 'icon',
      key: 'icon',
      render: (icon) => (
        <img
          src={`/api/logo/download/${icon}`}
          alt="Icon"
          className="w-12 h-12 object-contain"
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/edit-navigation-link/${record._id}`)}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          />
        </div>
      ),
    },
  ];
  

  if (isLoading) return <p>Loading...</p>;

  return (
<>
  <div className="mb-4">
    <Breadcrumb>
      <Breadcrumb.Item>
        <Link to="/dashboard">Dashboard</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>Navigation Links</Breadcrumb.Item>
    </Breadcrumb>
  </div>

  <div className="flex justify-between items-center mb-4">
    <h1 className="font-bold text-2xl">Navigation Links</h1>
    <Button
      type="primary"
      icon={<PlusOutlined />}
      onClick={() => navigate('/navigationLink-form')}
    >
      Add Navigation Link
    </Button>
  </div>

  <Table columns={columns} dataSource={navigationLinks} rowKey="_id" />
</>

  );
};

>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b
export default NavigationLinkTable;