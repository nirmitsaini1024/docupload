"use client"

import type { Document } from "@/types/document"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X, ClipboardCheck } from "lucide-react"

interface DocumentTableProps {
  documents: Document[]
  onToggleStatus: (id: string, field: "isFinal") => void
}

export function DocumentTable({ documents, onToggleStatus }: DocumentTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-blue-50">
            <TableHead className="font-semibold">Document Name</TableHead>
            <TableHead className="font-semibold">Domain</TableHead>
            <TableHead className="font-semibold">Department</TableHead>
            <TableHead className="font-semibold">Category</TableHead>
            <TableHead className="font-semibold">File Type</TableHead>
            <TableHead className="font-semibold">Final Version</TableHead>
            <TableHead className="font-semibold">Working Copy</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id} className="hover:bg-blue-50 transition-colors">
              <TableCell className="font-medium">{doc.name}</TableCell>
              <TableCell>{doc.domain}</TableCell>
              <TableCell>{doc.department}</TableCell>
              <TableCell>{doc.category}</TableCell>
              <TableCell className="uppercase text-xs">{doc.fileType}</TableCell>
              <TableCell>
                <button
                  onClick={() => onToggleStatus(doc.id, "isFinal")}
                  className="cursor-pointer hover:bg-blue-100 p-1 rounded-full transition-colors"
                >
                  {doc.isFinal ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-gray-300" />}
                </button>
              </TableCell>
              <TableCell>
                <button
                  onClick={() => onToggleStatus(doc.id, "isFinal")}
                  className="cursor-pointer hover:bg-blue-100 p-1 rounded-full transition-colors"
                >
                  {!doc.isFinal ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-gray-300" />
                  )}
                </button>
              </TableCell>
              <TableCell>
                {doc.status === "review" ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
                    <ClipboardCheck className="h-3 w-3" /> In Review
                  </span>
                ) : doc.status === "final" ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                    Final
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                    Working
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
