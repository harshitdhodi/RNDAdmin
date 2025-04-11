import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllBannersQuery, useDeleteBannerMutation } from '../../slice/banner/banner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'react-toastify';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Pencil, Trash, Plus, Home } from 'lucide-react';

const BannerTable = () => {
  const navigate = useNavigate();
  const { data: bannerData = [], isLoading } = useGetAllBannersQuery();
  const [deleteBanner] = useDeleteBannerMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const handleDelete = async (id) => {
    try {
      await deleteBanner(id);
      toast.success('Banner deleted successfully');
    } catch (error) {
      toast.error('Failed to delete banner');
    }
  };

  const paginatedData = bannerData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(bannerData.length / pageSize);

  return (
    <div className="px-6 py-4">
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate("/dashboard")} className="flex items-center">
              <Home className="w-4 h-4 mr-2" /> Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Banner Management</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Button variant="default" onClick={() => navigate('/add-banner')}>
          <Plus className="w-4 h-4 mr-2" /> Add New Banner
        </Button>
      </div>

      <div className="overflow-x-auto border rounded-md shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Page Slug</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" className="text-center p-4">Loading...</td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4">No banners found</td>
              </tr>
            ) : (
              paginatedData.map((banner) => (
                <tr key={banner._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <img
                      src={`/api/image/download/${banner.image}`}
                      alt="Banner"
                      className="w-32 h-12 object-cover rounded-md"
                    />
                  </td>
                  <td className="px-4 py-2">{banner.imgName}</td>
                  <td className="px-4 py-2">{banner.pageSlug}</td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(`/edit-banner-form/${banner._id}`)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" size="icon">
                            <Trash className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogTitle>Confirm Deletion</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this banner?
                          </DialogDescription>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button variant="destructive" onClick={() => handleDelete(banner._id)}>
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-end items-center mt-4 gap-2">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          variant="outline"
        >
          Previous
        </Button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default BannerTable;