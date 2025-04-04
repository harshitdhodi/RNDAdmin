import React from "react";
import { useGetAllCataloguesQuery, useDeleteCatalogueMutation } from "@/slice/catalogue/catalogueslice";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { toast } from "react-toastify";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";

const CatalogueTable = () => {
  const navigate = useNavigate();
  const { data: catalogues, isLoading } = useGetAllCataloguesQuery();
  const [deleteCatalogue] = useDeleteCatalogueMutation();

  const handleDelete = async (id) => {
    try {
      await deleteCatalogue(id).unwrap();
      toast.success("Catalogue deleted successfully");
    } catch (error) {
      toast.error("Failed to delete catalogue");
    }
  };

  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>Catalogue Table</BreadcrumbItem>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mb-3">Catalogue Table</h1>

      <Card className="overflow-hidden">
        <table className="w-full border-collapse border border-gray-300 rounded-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border border-gray-300 p-2">Title</th>
              <th className="border border-gray-300 p-2">Catalogue</th>
              <th className="border border-gray-300 p-2">Image</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {catalogues?.map((item) => (
              <tr key={item._id} className="border border-gray-200">
                <td className="border border-gray-200 p-2">{item.title}</td>
                <td className="border border-gray-200 p-2">
                  <Link to={`/api/image/pdf/view/${item.catalogue}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    Download
                  </Link>
                </td>
                <td className="border border-gray-200 p-2">
                  <img src={`/api/image/view/${item.image}`} alt="Catalogue" className="w-24 rounded-md" />
                </td>
                <td className="border border-gray-200 p-2">
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => navigate(`/edit-catalogue/${item._id}`)}>Edit</Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>Are you sure?</AlertDialogHeader>
                        <p>This action cannot be undone.</p>
                        <AlertDialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button variant="destructive" onClick={() => handleDelete(item._id)}>Delete</Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default CatalogueTable;
