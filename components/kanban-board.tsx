"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Document } from "@/types/document"
import { Card, CardContent } from "@/components/ui/card"
import { File, FileText, ClipboardCheck } from "lucide-react"
import { useDroppable } from "@dnd-kit/core"

interface KanbanBoardProps {
  id: string
  title: string
  documents: Document[]
  highlight?: boolean
}

function DocumentCard({ document }: { document: Document }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: document.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="mb-3 cursor-grab active:cursor-grabbing"
    >
      <Card className="border border-blue-100 shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {document.isFinal ? (
              <File className="h-5 w-5 text-red-500 flex-shrink-0" />
            ) : (
              <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
            )}
            <div className="truncate font-medium">{document.name}</div>
          </div>
          <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
            <span className="uppercase font-medium">{document.fileType}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function KanbanBoard({ id, title, documents, highlight = false }: KanbanBoardProps) {
  const { setNodeRef } = useDroppable({
    id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg shadow-sm p-4 ${
        highlight
          ? "bg-amber-50 border border-amber-200"
          : id === "final"
            ? "bg-red-50 border border-red-100"
            : "bg-blue-50 border border-blue-100"
      }`}
    >
      <h3 className="font-medium mb-4 flex items-center gap-2 pb-2 border-b border-blue-100">
        {id === "final" ? (
          <File className="h-5 w-5 text-red-500" />
        ) : id === "working" ? (
          <FileText className="h-5 w-5 text-blue-500" />
        ) : (
          <ClipboardCheck className="h-5 w-5 text-amber-500" />
        )}
        {title} ({documents.length})
      </h3>

      <div className="min-h-[300px]">
        {documents.map((doc) => (
          <DocumentCard key={doc.id} document={doc} />
        ))}

        {documents.length === 0 && (
          <div className="h-[150px] border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400 bg-white/50">
            Drag documents here
          </div>
        )}
      </div>
    </div>
  )
}
