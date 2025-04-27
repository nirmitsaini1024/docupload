"use client"

import type { Document } from "@/types/document"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { File, FileText, FilePenLineIcon as Signature } from "lucide-react"

interface ReviewModalProps {
  documents: Document[]
  onClose: () => void
}

export function ReviewModal({ documents, onClose }: ReviewModalProps) {
  const finalVersions = documents.filter((doc) => doc.isFinal)
  const workingCopies = documents.filter((doc) => !doc.isFinal)

  const handleAskForSignature = () => {
    alert("Signature request sent!")
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Review Process</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <File className="h-5 w-5 text-red-500" />
              PDF Files (Final Version)
            </h3>
            {finalVersions.length > 0 ? (
              <ul className="space-y-2">
                {finalVersions.map((doc) => (
                  <li key={doc.id} className="flex items-center gap-2 text-sm">
                    <File className="h-4 w-4 text-red-500" />
                    {doc.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No PDF files available</p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Word Files (Working Copy)
            </h3>
            {workingCopies.length > 0 ? (
              <ul className="space-y-2">
                {workingCopies.map((doc) => (
                  <li key={doc.id} className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-blue-500" />
                    {doc.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No Word files available</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAskForSignature} className="flex items-center gap-2">
            <Signature className="h-4 w-4" />
            Ask for Signature
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
