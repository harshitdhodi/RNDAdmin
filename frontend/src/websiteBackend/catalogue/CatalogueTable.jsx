import React from 'react';
import { useGetAllCataloguesQuery, useDeleteCatalogueMutation } from '@/slice/catalogue/catalogueSlice';
import { Table, Button, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const CatalogueTable = () => {
  const navigate = useNavigate();
  const { data: catalogues, isLoading } = useGetAllCataloguesQuery();
  const [deleteCatalogue] = useDeleteCatalogueMutation();

  const handleDelete = async (id) => {
    try {
      await deleteCatalogue(id).unwrap();
      message.success('Catalogue deleted successfully');
    } catch (error) {
      message.error('Failed to delete catalogue');
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Catalogue',
      dataIndex: 'catalogue',
      key: 'catalogue',
      render: (catalogue) => <a href={`/api/catalogues/download/${catalogue}`} target="_blank" rel="noopener noreferrer">Download</a>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/edit-catalogue/${record._id}`)}
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
    <Table columns={columns} dataSource={catalogues} rowKey="_id" />
  );
};

export default CatalogueTable;