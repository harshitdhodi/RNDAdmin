import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { Plus, Trash, Edit } from "lucide-react";
import { useGetAllMenuListingsQuery, useDeleteMenuListingMutation } from "@/slice/menuListing/menuList";
import { useState } from "react";
import { createPortal } from "react-dom";

const Popconfirm = ({ title, onConfirm, children }) => {
  const [visible, setVisible] = useState(false);

  const showConfirm = () => setVisible(true);
  const hideConfirm = () => setVisible(false);

  const handleConfirm = () => {
    onConfirm();
    hideConfirm();
  };

  return (
    <div className="relative inline-block">
      <span onClick={showConfirm}>{children}</span>

      {visible &&
        createPortal(
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Card className="p-5 w-80 text-center shadow-lg bg-white rounded-lg">
              <p className="text-lg font-semibold">{title}</p>
              <div className="mt-4 flex justify-center gap-4">
                <Button variant="outline" onClick={hideConfirm}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleConfirm}>
                  Confirm
                </Button>
              </div>
            </Card>
          </div>,
          document.body
        )}
    </div>
  );
};



const MenuListingTable = () => {
  const { data, error, isLoading, refetch } = useGetAllMenuListingsQuery();
  const [deleteMenuListing] = useDeleteMenuListingMutation();
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/menu-listing-form/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await deleteMenuListing(id);
      toast.success("Menu deleted successfully!");
      refetch();
    } catch (err) {
      toast.error("Failed to delete menu");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  const menuListings = data?.data || [];

  const formattedData = menuListings.map((menu) => ({
    key: menu._id,
    name: menu.parent.name,
    path: menu.parent.path,
    isParent: true,
    children: menu.children.length > 0 ? menu.children.map((child) => ({
      key: child._id,
      name: `└── ${child.name}`,
      path: child.path,
      isParent: false,
      children: child.subChildren?.length > 0 ? child.subChildren.map((sub) => ({
        key: sub._id,
        name: `    └── ${sub.name}`,
        path: sub.path,
        isParent: false,
      })) : undefined,
    })) : undefined,
  }));

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Path", dataIndex: "path", key: "path" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record.key)}>
            <Button variant="destructive" size="icon">
              <Trash className="w-4 h-4" />
            </Button>
          </Popconfirm>

          {!record.name.includes("└──") && (
            <Button variant="outline" size="icon" onClick={() => handleEdit(record.key)}>
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Menu Listings</h2>
        <Link to="/menu-listing-form">
          <Button>
            <Plus className="w-4 h-4 mr-2" /> Add Menu
          </Button>
        </Link>
      </div>
      <Table columns={columns} dataSource={formattedData} expandable={{ defaultExpandAllRows: false }} />
    </Card>
  );
};

export default MenuListingTable;
