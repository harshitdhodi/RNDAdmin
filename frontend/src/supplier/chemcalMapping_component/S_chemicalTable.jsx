import React, { useState } from 'react';
import { useDeleteChemicalFromSupplierMutation } from '@/slice/supplierSlice/SupplierSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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

export function S_ChemicalTable({ chemicals, refetch, supplierId, onRemoveChemical }) {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteChemicalFromSupplier] = useDeleteChemicalFromSupplierMutation();
  const [selectedChemical, setSelectedChemical] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmDelete = (chemical) => {
    setSelectedChemical(chemical);
    setIsModalOpen(true);
  };

  const handleRemoveChemical = async () => {
    if (!supplierId || !selectedChemical) return;
    try {
      await deleteChemicalFromSupplier({
        supplierId: supplierId,
        chemicalId: selectedChemical._id,
      });
      onRemoveChemical(selectedChemical);
      refetch();
      setIsModalOpen(false);
      setSelectedChemical(null);
      if (currentChemicals.length === 1 && page > 1) {
        setPage(1);
      }
    } catch (error) {
      console.error('Error removing chemical:', error);
    }
  };

  const totalPages = Math.ceil(chemicals.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentChemicals = chemicals.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="border rounded-md mt-4 p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Action</TableHead>
            <TableHead>Chemical Name</TableHead>
            <TableHead>CAS Number</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentChemicals.map((chemical) => (
            <TableRow key={chemical._id}>
              <TableCell>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleConfirmDelete(chemical)}
                >
                  Delete
                </Button>
              </TableCell>
              <TableCell>{chemical.name}</TableCell>
              <TableCell>{chemical.cas_number}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="flex items-center justify-end space-x-4 py-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Rows per page</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="40">40</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-end">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Calculate which page numbers to show
                let pageNum;
                if (totalPages <= 5) {
                  // Show all pages if 5 or fewer
                  pageNum = i + 1;
                } else if (page <= 3) {
                  // Near the start
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  // Near the end
                  pageNum = totalPages - 4 + i;
                } else {
                  // In the middle
                  pageNum = page - 2 + i;
                }
                
                return (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNum)}
                      isActive={page === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                  className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedChemical?.name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRemoveChemical}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}