"use client"

import type { Document } from "@/types/document"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X, ClipboardCheck } from "lucide-react"

interface DocumentTableProps {
  documents: Document[]
}

export function DocumentTable({ documents }: DocumentTableProps) {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Department</TableHead>
            <TableHead>Document Category</TableHead>
            <TableHead>Document Name</TableHead>
            <TableHead>Final Version (PDF)</TableHead>
            <TableHead>Working Copy (Word)</TableHead>
            <TableHead>Document Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>{doc.department}</TableCell>
              <TableCell>{doc.category}</TableCell>
              <TableCell>{doc.name}</TableCell>
              <TableCell>
                {doc.isFinal ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-gray-300" />}
              </TableCell>
              <TableCell>
                {!doc.isFinal ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-gray-300" />}
              </TableCell>
              <TableCell>
                {doc.status === "review" ? (
                  <span className="flex items-center gap-1 text-amber-600">
                    <ClipboardCheck className="h-4 w-4" /> In Review
                  </span>
                ) : doc.status === "final" ? (
                  <span className="text-red-600">Final</span>
                ) : (
                  <span className="text-blue-600">Working</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
