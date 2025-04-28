"use client"

import { useState } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { KanbanBoard } from "@/components/kanban-board"
import { DocumentTable } from "@/components/document-table"
import { FileUpload } from "@/components/file-upload"
import { ReviewModal } from "@/components/review-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Document } from "@/types/document"

export default function Home() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState("")

  const departments = ["Accounts", "Recruitment", "Development", "Marketing", "Sales", "Legal", "Operations"]

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

  const toggleDocumentStatus = (id: string, field: "isFinal") => {
    const updatedDocuments = [...documents]
    const documentIndex = updatedDocuments.findIndex((doc) => doc.id === id)

    if (documentIndex !== -1) {
      updatedDocuments[documentIndex][field] = !updatedDocuments[documentIndex][field]
      // Also update the status to match
      updatedDocuments[documentIndex].status = updatedDocuments[documentIndex].isFinal ? "final" : "working"
      setDocuments(updatedDocuments)
    }
  }

  const finalVersionDocs = documents.filter((doc) => doc.status === "final")
  const workingCopyDocs = documents.filter((doc) => doc.status === "working")
  const reviewDocs = documents.filter((doc) => doc.status === "review")

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto p-6 max-w-6xl">
        <h1 className="text-3xl font-bold mb-10 text-center pt-6 text-blue-800">Document Management System</h1>

        <div className="mb-10">
          <FileUpload onAddDocument={handleAddDocument} />
        </div>

        {documents.length > 0 && (
          <div className="mb-10 bg-white rounded-xl shadow-md overflow-hidden border border-blue-100">
            <div className="p-4 bg-blue-50 border-b border-blue-100">
              <h2 className="text-xl font-semibold text-blue-800">Document List</h2>
            </div>
            <DocumentTable documents={documents} onToggleStatus={toggleDocumentStatus} />
          </div>
        )}

        <div className="mb-10">
          <div className="p-4 bg-white rounded-t-xl shadow-sm border border-blue-100 border-b-0">
            <h2 className="text-xl font-semibold text-blue-800">Document Workflow</h2>
          </div>
          <div className="bg-white rounded-b-xl shadow-md border border-blue-100 p-6">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KanbanBoard id="final" title="Final Version" documents={finalVersionDocs} />
                <KanbanBoard id="working" title="Working Copy" documents={workingCopyDocs} />
                <KanbanBoard id="review" title="In Review" documents={reviewDocs} highlight={true} />
              </div>
            </DndContext>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10">
          <div className="w-full md:w-64">
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="border-blue-100 focus:border-blue-300">
                <SelectValue placeholder="Select Department for Review" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <button
            onClick={() => setShowReviewModal(true)}
            className={`px-8 py-3 rounded-md text-white font-medium shadow-md transition-all transform hover:scale-105 ${
              reviewDocs.length === 0 || !selectedDepartment
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={reviewDocs.length === 0 || !selectedDepartment}
          >
            Start Review Process
          </button>
        </div>

        {showReviewModal && (
          <ReviewModal
            documents={reviewDocs}
            department={selectedDepartment}
            onClose={() => setShowReviewModal(false)}
          />
        )}
      </div>
    </main>
  )
}
