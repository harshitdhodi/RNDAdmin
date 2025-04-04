import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const StaticMetaForm = () => {
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const form = useForm();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get("/api/menulist/get-menu");
        if (response.data && Array.isArray(response.data.data)) {
          setMenuList(response.data.data);
        } else {
          console.error("Unexpected API response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching menu list:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  useEffect(() => {
    if (id) {
      axios.get(`/api/meta/get-meta/${id}`).then((response) => {
        if (response.data?.success) {
          form.reset(response.data.data);
        }
      }).catch(error => console.error("Error fetching meta data:", error));
    }
  }, [id, form]);

  const generateSlug = (pageName) => {
    return pageName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  };

  const handlePageChange = (value) => {
    form.setValue("pageSlug", generateSlug(value));
  };

  const onSubmit = async (values) => {
    try {
      if (id) {
        await axios.put(`/api/meta/update-meta/${id}`, values);
        toast.success("Meta data updated successfully!");
      } else {
        await axios.post("/api/meta/add-meta", values);
        toast.success("Meta data added successfully!");
        form.reset();
      }
      navigate("/meta-table");
    } catch (error) {
      toast.error("Failed to save meta data.");
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/meta-table">Meta List</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>{id ? "Edit Meta" : "Add Meta"}</BreadcrumbItem>
      </Breadcrumb>

      <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
        <FormField control={form.control} name="pageName" rules={{ required: "Please select a page" }}>
          <FormItem>
            <FormLabel>Page Name</FormLabel>
            <Select onValueChange={handlePageChange} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Select a page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Static Page">Static Page</SelectItem>
                {menuList.map(menu => (
                  <React.Fragment key={menu._id}>
                    <SelectItem value={menu.parent.name}>{menu.parent.name}</SelectItem>
                    {menu.children.map(child => (
                      <React.Fragment key={child._id}>
                        <SelectItem value={child.name}> ├── {child.name}</SelectItem>
                        {child.subChildren.map(subChild => (
                          <SelectItem key={subChild._id} value={subChild.name}> ├──── {subChild.name}</SelectItem>
                        ))}
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField control={form.control} name="pageSlug" rules={{ required: "Slug is required" }}>
          <FormItem>
            <FormLabel>Page Slug</FormLabel>
            <FormControl>
              <Input placeholder="Auto-generated slug" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField control={form.control} name="metaTitle" rules={{ required: "Please enter meta title" }}>
          <FormItem>
            <FormLabel>Meta Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter Meta Title" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField control={form.control} name="metaDescription" rules={{ required: "Please enter meta description" }}>
          <FormItem>
            <FormLabel>Meta Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter Meta Description" rows={4} />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField control={form.control} name="metaKeyword" rules={{ required: "Please enter meta keywords" }}>
          <FormItem>
            <FormLabel>Meta Keywords</FormLabel>
            <FormControl>
              <Input placeholder="Enter Meta Keywords" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <Button type="submit">{id ? "Update Meta" : "Add Meta"}</Button>
      </Form>
    </div>
  );
};

export default StaticMetaForm;