import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "react-toastify";
import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useGetAllNavigationLinksQuery, useDeleteNavigationLinkMutation } from "@/slice/navigationLink/navigationSlice";
import { Pencil, Trash, Plus } from "lucide-react";

const NavigationLinkTable = () => {
  const navigate = useNavigate();
;
  const { data: navigationLinks, isLoading } = useGetAllNavigationLinksQuery();
  const [deleteNavigationLink] = useDeleteNavigationLinkMutation();

  const handleDelete = async (id) => {
    try {
      await deleteNavigationLink(id).unwrap();
      toast({ title: "Success", description: "Navigation link deleted successfully", variant: "success" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete navigation link", variant: "destructive" });
    }
  };

  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Icon",
      accessorKey: "icon",
      cell: ({ row }) => (
        <img src={`/api/logo/download/${row.original.icon}`} alt="Icon" className="w-12 h-12" />
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={() => navigate(`/edit-navigation-link/${row.original._id}`)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="destructive" size="icon" onClick={() => handleDelete(row.original._id)}>
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <Breadcrumb items={[
        { label: "Dashboard", link: "/dashboard" },
        { label: "Navigation Links" },
      ]} className="mb-4" />
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-2xl">Navigation Links</h1>
        <Button onClick={() => navigate("/navigationLink-form")}>
          <Plus className="mr-2 w-4 h-4" /> Add Navigation Link
        </Button>
      </div>
      <Table columns={columns} data={navigationLinks} rowKey="_id" />
    </div>
  );
};

export default NavigationLinkTable;
