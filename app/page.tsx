"use client"

import { useState } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { KanbanBoard } from "@/components/kanban-board"
import { DocumentTable } from "@/components/document-table"
import { FileUpload } from "@/components/file-upload"
import { FilterDropdowns } from "@/components/filter-dropdowns"
import { ReviewModal } from "@/components/review-modal"
import type { Document } from "@/types/document"

export default function Home() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [showReviewModal, setShowReviewModal] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleAddDocument = (newDocument: Document) => {
    setDocuments([...documents, newDocument])
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id && over.id) {
      const updatedDocuments = [...documents]
      const documentIndex = updatedDocuments.findIndex((doc) => doc.id === active.id)

      if (documentIndex !== -1) {
        // Update document status based on the container it was dropped into
        updatedDocuments[documentIndex].status = over.id
        setDocuments(updatedDocuments)
      }
    }
  }

  const finalVersionDocs = documents.filter((doc) => doc.status === "final")
  const workingCopyDocs = documents.filter((doc) => doc.status === "working")
  const reviewDocs = documents.filter((doc) => doc.status === "review")

  return (
    <main className="container mx-auto p-6 max-w-6xl bg-gradient-to-b from-white to-blue-50/50">
      <h1 className="text-2xl font-bold mb-8 text-center">Document Review Management System</h1>

      {/* <div className="mb-8">
        <FilterDropdowns />
      </div> */}

      <div className="mb-8">
        <FileUpload onAddDocument={handleAddDocument} />
      </div>

      {documents.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Document List</h2>
          <DocumentTable documents={documents} />
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Document Workflow</h2>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KanbanBoard id="final" title="Final Version" documents={finalVersionDocs} />
            <KanbanBoard id="working" title="Working Copy" documents={workingCopyDocs} />
            <KanbanBoard id="review" title="In Review" documents={reviewDocs} highlight={true} />
          </div>
        </DndContext>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => setShowReviewModal(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          disabled={reviewDocs.length === 0}
        >
          Start Review Process
        </button>
      </div>

      {showReviewModal && <ReviewModal documents={reviewDocs} onClose={() => setShowReviewModal(false)} />}
    </main>
  )
}
