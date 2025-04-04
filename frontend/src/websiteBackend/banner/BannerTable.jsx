import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllBannersQuery, useDeleteBannerMutation } from '../../slice/banner/banner';
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useToast } from 'react-toastify';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Pencil, Trash, Plus, Home } from 'lucide-react';

const BannerTable = () => {
  const navigate = useNavigate();
  const { data: bannerData, isLoading } = useGetAllBannersQuery();
  const [deleteBanner] = useDeleteBannerMutation();
;

  const handleDelete = async (id) => {
    try {
      await deleteBanner(id);
      toast({ title: 'Success', description: 'Banner deleted successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete banner', variant: 'destructive' });
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
          className="w-[150px] h-[50px] object-cover rounded-md shadow"
        />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'imgName',
      key: 'title',
      width: '20%',
    },
    {
      title: 'Page Slug',
      dataIndex: 'pageSlug',
      key: 'pageSlug',
      width: '20%',
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
            onClick={() => navigate(`/edit-banner-form/${record._id}`)}
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
                Are you sure you want to delete this banner?
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
          <Breadcrumb.Item onClick={() => navigate("/dashboard")}> <Home className="w-4 h-4 mr-2" /> Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item>Banner Management</Breadcrumb.Item>
        </Breadcrumb>
        <Button variant="default" onClick={() => navigate('/add-banner')}>
          <Plus className="w-4 h-4 mr-2" /> Add New Banner
        </Button>
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
