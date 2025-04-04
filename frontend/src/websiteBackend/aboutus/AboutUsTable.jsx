import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAboutUsQuery, useDeleteAboutUsMutation } from '../../slice/aboutUs/aboutUs';
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useToast } from 'react-toastify';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Pencil, Trash, Plus } from 'lucide-react';

const AboutUsTable = () => {
  const navigate = useNavigate();
  const { data: aboutUsData, isLoading } = useGetAboutUsQuery();
  const [deleteAboutUs] = useDeleteAboutUsMutation();
;

  const handleDelete = async (id) => {
    try {
      await deleteAboutUs(id);
      toast({ title: 'Success', description: 'About Us entry deleted successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete About Us entry', variant: 'destructive' });
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
          className="w-[100px] h-[50px] object-cover rounded-md shadow"
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      render: (_, record) => (
        <div className="flex gap-3">
          <Button 
            variant="outline"
            size="icon"
            onClick={() => navigate(`/edit-about-us-form/${record._id}`)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Dialog>
            <Dialog.Trigger>
              <Button variant="destructive" size="icon">
                <Trash className="w-4 h-4" />
              </Button>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Title>Confirm Deletion</Dialog.Title>
              <Dialog.Description>
                Are you sure you want to delete this entry?
              </Dialog.Description>
              <Dialog.Footer>
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive" onClick={() => handleDelete(record._id)}>Delete</Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog>
        </div>
      ),
    },
  ];

  return (
    <div className="px-6 py-4">
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => navigate("/dashboard")}>Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item>About Us</Breadcrumb.Item>
        </Breadcrumb>
        <Button variant="default" onClick={() => navigate('/about-us-form')}>
          <Plus className="w-4 h-4 mr-2" /> Add About Us
        </Button>
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
