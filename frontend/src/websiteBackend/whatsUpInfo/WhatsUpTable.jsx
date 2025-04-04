import React, { useState } from "react";
import { useGetWhatsUpInfoQuery, useDeleteWhatsUpInfoByIdMutation } from "@/slice/whatsUpInfo/WhatsUpInfo";
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
import { Skeleton } from "@/components/ui/skeleton";
import WhatsUpInfoForm from "./WhatUpForm";
import EventModal from "@/dashboard/calender/event-modal";
import { Edit, Trash2 } from "lucide-react";

const WhatsUpInfoTable = () => {
  const { data: whatsUpInfo, isLoading } = useGetWhatsUpInfoQuery();
  const [deleteWhatsUpInfoById] = useDeleteWhatsUpInfoByIdMutation();
  const [editingInfo, setEditingInfo] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDelete = async (id) => {
    try {
      await deleteWhatsUpInfoById(id).unwrap();
      toast.success("WhatsUp Info deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete WhatsUp Info.");
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">WhatsUp Info</h2>
        <Button onClick={() => {
          setEditingInfo(null);
          setIsModalVisible(true);
        }}>Add WhatsUp Info</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell colSpan={3}><Skeleton className="h-6 w-full" /></TableCell>
              </TableRow>
            ))
          ) : (
            whatsUpInfo?.length > 0 ? (
              whatsUpInfo.map((info) => (
                <TableRow key={info.id}>
                  <TableCell>{info.name}</TableCell>
                  <TableCell>{info.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-x-2 justify-end">
                      <Button size="sm" variant="outline" onClick={() => {
                        setEditingInfo(info);
                        setIsModalVisible(true);
                      }}>
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
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button variant="destructive" onClick={() => handleDelete(info.id)}>
                              Confirm
                            </Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">No WhatsUp Info found</TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>

      {isModalVisible && (
        <EventModal
          title={editingInfo ? "Edit WhatsUp Info" : "Add WhatsUp Info"}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <WhatsUpInfoForm initialValues={editingInfo} onClose={() => setIsModalVisible(false)} />
        </EventModal>
      )}
    </Card>
  );
};

export default WhatsUpInfoTable;