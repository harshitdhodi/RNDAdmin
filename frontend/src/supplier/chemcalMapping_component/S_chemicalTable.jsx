import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useDeleteChemicalFromSupplierMutation } from '@/slice/supplierSlice/SupplierSlice'
export function S_ChemicalTable({ chemicals, supplierId, onRemoveChemical }) {
  console.log(chemicals) // To check the format of the data
  const [page, setPage] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(10)
  const [deleteChemicalFromSupplier] = useDeleteChemicalFromSupplierMutation()

  const handleRemoveChemical = async (chemical) => {
    try {
      if (!supplierId) {
        console.error('No supplier ID provided');
        return;
      }

      await deleteChemicalFromSupplier({
        supplierId: supplierId,
        chemicalId: chemical._id
      })
      onRemoveChemical(chemical)
      // Reset to first page if current page becomes empty
      if (currentChemicals.length === 1 && page > 1) {
        setPage(1)
      }
    } catch (error) {
      console.error('Error removing chemical:', error)
    }
  }
  // Calculate pagination
  const totalPages = Math.ceil(chemicals.length / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentChemicals = chemicals.slice(startIndex, endIndex)

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
                No chemicals found for this Supplier.
              </TableCell>
            </TableRow>
          ) : (
            chemicals?.map((chemical) => (
              <TableRow key={chemical._id}>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveChemical(chemical)}
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
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
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
                {startIndex + 1} - {Math.min(endIndex, chemicals.length)} of{' '}
                {chemicals.length}
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
  )
}
