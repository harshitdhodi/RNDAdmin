import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";
import { useCreateMenuListingMutation, useUpdateMenuListingMutation, useGetMenuListingByIdQuery, useGetAllMenuListingsQuery } from "@/slice/menuListing/menuList";

const MenuListingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetMenuListingByIdQuery(id, { skip: !id });
  const { refetch: refetchAllMenuListings } = useGetAllMenuListingsQuery();
  const [createMenuListing] = useCreateMenuListingMutation();
  const [updateMenuListing] = useUpdateMenuListingMutation();

  const [formData, setFormData] = React.useState({
    parent: { name: "", path: "" },
    children: [],
  });

  useEffect(() => {
    if (data) {
      setFormData(data.data);
    }
  }, [data]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChildChange = (index, field, value) => {
    const updatedChildren = [...formData.children];
    updatedChildren[index][field] = value;
    setFormData((prev) => ({ ...prev, children: updatedChildren }));
  };

  const handleAddChild = () => {
    setFormData((prev) => ({
      ...prev,
      children: [...prev.children, { name: "", path: "", subChildren: [] }],
    }));
  };

  const handleRemoveChild = (index) => {
    setFormData((prev) => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    try {
      if (id) {
        await updateMenuListing({ id, ...formData });
        toast.success("Menu updated successfully!");
      } else {
        await createMenuListing(formData);
        toast.success("Menu created successfully!");
      }
      await refetchAllMenuListings();
      navigate("/menu-listing-table");
    } catch (error) {
      toast.error("Failed to save menu.");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">{id ? "Update Menu Listing" : "Create Menu Listing"}</h2>

      {/* Parent Menu */}
      <Card className="p-4 mb-4">
        <h3 className="text-lg font-semibold mb-3">Parent Menu</h3>
        <Input
          placeholder="Enter parent menu name"
          value={formData.parent.name}
          onChange={(e) => handleInputChange("parent", { ...formData.parent, name: e.target.value })}
        />
        <Input
          className="mt-2"
          placeholder="Enter parent menu path"
          value={formData.parent.path}
          onChange={(e) => handleInputChange("parent", { ...formData.parent, path: e.target.value })}
        />
      </Card>

      {/* Children Menus */}
      <Card className="p-4 mb-4">
        <h3 className="text-lg font-semibold mb-3">Children Menus</h3>
        {formData.children.map((child, index) => (
          <Card key={index} className="p-3 mb-3">
            <div className="flex items-center gap-3">
              <Input
                placeholder="Enter child name"
                value={child.name}
                onChange={(e) => handleChildChange(index, "name", e.target.value)}
              />
              <Input
                placeholder="Enter child path"
                value={child.path}
                onChange={(e) => handleChildChange(index, "path", e.target.value)}
              />
              <Button variant="outline" onClick={() => handleRemoveChild(index)}>
                <Minus className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
        <Button variant="outline" onClick={handleAddChild} className="w-full">
          <Plus className="w-4 h-4 mr-2" /> Add Child
        </Button>
      </Card>

      {/* Submit Button */}
      <Button className="w-full mt-4" onClick={handleSubmit}>
        {id ? "Update" : "Create"}
      </Button>
    </Card>
  );
};

export default MenuListingForm;
