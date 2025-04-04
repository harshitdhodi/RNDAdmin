import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { Pencil, Trash, Plus } from "lucide-react";

const SlideShowTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/slideShow/getAll");
      if (response.data && Array.isArray(response.data)) {
        setData(response.data);
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        setData(response.data.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to fetch slideshow data." });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/slideShow/delete?id=${id}`);
      toast({ title: "Image deleted successfully!" });
      fetchData();
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to delete image." });
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-6">
      <div className="w-full mb-4 flex justify-between items-center">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate("/dashboard")}>
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>Slideshow</BreadcrumbItem>
        </Breadcrumb>
        <Button onClick={() => navigate("/slideShow-form")}>
          <Plus className="w-4 h-4 mr-2" /> Add Image
        </Button>
      </div>
      <Card className="w-full max-w-7xl shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Slideshow Images</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Alt Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    {item.image ? (
                      <img
                        src={`/api/logo/download/${item.image}`}
                        alt="Slide"
                        className="w-20 h-12 rounded-lg shadow object-contain"
                      />
                    ) : (
                      "No Image"
                    )}
                  </TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.altText}</TableCell>
                  <TableCell>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(`/edit-image/${item._id}`)}
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
                          <p>Are you sure you want to delete this image?</p>
                          <div className="flex justify-end gap-3 mt-4">
                            <Button variant="outline">Cancel</Button>
                            <Button variant="destructive" onClick={() => handleDelete(item._id)}>
                              Yes, Delete
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default SlideShowTable;