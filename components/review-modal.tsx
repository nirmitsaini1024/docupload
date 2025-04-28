"use client"

import type { Document } from "@/types/document"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { File, FileText, FilePenLineIcon as Signature } from "lucide-react"

interface ReviewModalProps {
  documents: Document[]
  department: string
  onClose: () => void
}

export function ReviewModal({ documents, department, onClose }: ReviewModalProps) {
  const finalVersions = documents.filter((doc) => doc.isFinal)
  const workingCopies = documents.filter((doc) => !doc.isFinal)

  const handleAskForSignature = () => {
    alert("Signature request sent!")
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border border-blue-100">
        <DialogHeader className="bg-blue-50 -mx-6 -mt-6 p-6 border-b border-blue-100">
          <DialogTitle className="text-blue-800 text-xl">Review Process - {department}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2 text-red-700">
              <File className="h-5 w-5 text-red-500" />
              Final Version Documents
            </h3>
            {finalVersions.length > 0 ? (
              <ul className="space-y-2">
                {finalVersions.map((doc) => (
                  <li key={doc.id} className="flex items-center gap-2 text-sm p-2 bg-red-50 rounded-md">
                    <File className="h-4 w-4 text-red-500" />
                    {doc.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">No final version documents available</p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2 text-blue-700">
              <FileText className="h-5 w-5 text-blue-500" />
              Working Copy Documents
            </h3>
            {workingCopies.length > 0 ? (
              <ul className="space-y-2">
                {workingCopies.map((doc) => (
                  <li key={doc.id} className="flex items-center gap-2 text-sm p-2 bg-blue-50 rounded-md">
                    <FileText className="h-4 w-4 text-blue-500" />
                    {doc.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">No working copy documents available</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-blue-200 text-blue-700">
            Cancel
          </Button>
          <Button onClick={handleAskForSignature} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
            <Signature className="h-4 w-4" />
            Ask for Signature
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
