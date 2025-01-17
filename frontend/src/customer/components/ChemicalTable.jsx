import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ChemicalTable({ chemicals, onRemoveChemical, refetch }) {
  const [page, setPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  // Calculate pagination
  const totalPages = Math.ceil((chemicals?.length || 0) / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentChemicals = chemicals?.slice(startIndex, endIndex);

  return (
    <div className="border rounded-md mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>Chemical Name</TableHead>
            <TableHead>CAS Number</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chemicals?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No chemicals found for this customer.
              </TableCell>
            </TableRow>
          ) : (
            currentChemicals?.map((chemical) => (
              <TableRow key={chemical._id}>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemoveChemical(chemical)}
                  >
                    Delete
                  </Button>
                </TableCell>
                <TableCell>{chemical.name}</TableCell>
                <TableCell>{chemical.cas_number}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-2 border-t">
        <div className="text-sm text-gray-500">
          Items per page:{' '}
          <select
            className="border rounded"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setPage(1); // Reset to first page when changing items per page
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="flex items-center gap-1">
            <span className="text-sm text-gray-500">
              {startIndex + 1} - {Math.min(endIndex, chemicals?.length || 0)} of{' '}
              {chemicals?.length || 0}
            </span>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
