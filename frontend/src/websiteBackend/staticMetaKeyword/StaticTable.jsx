import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton"; // Optional for loading

const MetaList = () => {
  const [metaList, setMetaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const response = await axios.get("/api/meta/get-meta");
        if (response.data && Array.isArray(response.data.data)) {
          setMetaList(response.data.data);
        } else {
          console.error("Unexpected API response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching meta data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeta();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/meta/delete-meta/${id}`);
      toast.success("Meta data deleted successfully!");
      setMetaList((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      toast.error("Failed to delete meta data.");
      console.error("Delete error:", error);
    }
  };

  return (
    <Card className="p-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>Meta Data</BreadcrumbItem>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Static Page Meta</h2>
        <Button onClick={() => navigate("/meta-form")}>Add Meta</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Page Name</TableHead>
            <TableHead>Meta Title</TableHead>
            <TableHead>Meta Description</TableHead>
            <TableHead>Meta Keywords</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            : metaList.length > 0
            ? metaList.map((meta) => (
                <TableRow key={meta._id}>
                  <TableCell>{meta.pageName}</TableCell>
                  <TableCell>{meta.metaTitle}</TableCell>
                  <TableCell>{meta.metaDescription}</TableCell>
                  <TableCell>{meta.metaKeyword}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-x-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/edit-meta-form/${meta._id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure you want to delete this meta data?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDelete(meta._id)}
                            >
                              Confirm
                            </Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No meta data found
                </TableCell>
              </TableRow>
            )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default MetaList;
