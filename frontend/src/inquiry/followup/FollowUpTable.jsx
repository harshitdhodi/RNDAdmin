import { useState } from "react";
import { useUpdateMessageMutation, useGetMessagesQuery } from "@/slice/followUp/followUp";
import { Pencil, Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export function FollowUpTable({
    followUps,
    onEdit,
    onDelete,
    currentPage,
    totalPages,
    onPageChange,
}) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);

    const [updateMessage] = useUpdateMessageMutation();
    const { refetch } = useGetMessagesQuery();

    const handleUpdate = async (id, updateData) => {
        try {
            const result = await updateMessage({ 
                id,
                ...updateData
            }).unwrap();
            await refetch();
            console.log('Update result:', result);
        } catch (error) {
            console.error(`Failed to update message ID: ${id}`, error);
        }
    };

    const handleStatusChange = (id, newStatus) => {
        handleUpdate(id, { status: newStatus });
    };

    const handleDeleteClick = (id) => {
        setDeleteItemId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (deleteItemId) {
            await onDelete(deleteItemId);
            await refetch();
            
            if (followUps.length === 1 && currentPage > 1) {
                onPageChange(currentPage - 1);
            } else {
                refetch();
            }
            
            setIsDeleteModalOpen(false);
            setDeleteItemId(null);
        }
    };

    // Function to generate pagination items
    const renderPaginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        // Adjust startPage if endPage is at maximum
        if (endPage === totalPages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // Add previous button
        items.push(
            <PaginationItem key="prev">
                <PaginationPrevious 
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
            </PaginationItem>
        );
        
        // Add ellipsis if needed at the start
        if (startPage > 1) {
            items.push(
                <PaginationItem key="start-ellipsis">
                    <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
                </PaginationItem>
            );
            if (startPage > 2) {
                items.push(
                    <PaginationItem key="ellipsis-1">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }
        }
        
        // Add page numbers
        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink 
                        onClick={() => onPageChange(i)}
                        isActive={currentPage === i}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }
        
        // Add ellipsis if needed at the end
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                items.push(
                    <PaginationItem key="ellipsis-2">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }
            items.push(
                <PaginationItem key="end-page">
                    <PaginationLink onClick={() => onPageChange(totalPages)}>
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }
        
        // Add next button
        items.push(
            <PaginationItem key="next">
                <PaginationNext 
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
            </PaginationItem>
        );
        
        return items;
    };

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {followUps.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                                <TableCell>{item.message}</TableCell>
                                <TableCell>
                                    <Select
                                        value={item.status || "New"}
                                        onValueChange={(value) => handleStatusChange(item._id, value)}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder={item.status || "New"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="New">New</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onEdit(item._id)}
                                            className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(item._id)}
                                            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="mt-4">
                    <Pagination>
                        <PaginationContent>
                            {renderPaginationItems()}
                        </PaginationContent>
                    </Pagination>
                </div>
            )}

            <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this follow-up?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleConfirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Yes, delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}