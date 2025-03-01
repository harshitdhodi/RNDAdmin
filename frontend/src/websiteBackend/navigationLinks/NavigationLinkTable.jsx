import React from 'react';
import { Table, Button, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useGetAllNavigationLinksQuery,useDeleteNavigationLinkMutation} from '@/slice/navigationLink/navigationSlice';

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
      render: (icon) => <img src={`/api/logo/download/${icon}`} alt="Icon" style={{ width: '50px', height: '50px' }} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
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
        </Space>
      ),
    },
  ];

  if (isLoading) return <p>Loading...</p>;

  return (
    <Table columns={columns} dataSource={navigationLinks} rowKey="_id" />
  );
};

export default NavigationLinkTable;