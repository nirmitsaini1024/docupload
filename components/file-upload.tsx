"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import type { Document } from "@/types/document"
import { v4 as uuidv4 } from "uuid"
import { Upload, FileIcon, FileText } from "lucide-react"

interface FileUploadProps {
  onAddDocument: (document: Document) => void
}

export function FileUpload({ onAddDocument }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [documentName, setDocumentName] = useState("")
  const [domain, setDomain] = useState("")
  const [department, setDepartment] = useState("")
  const [category, setCategory] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  // Common function to handle file setting
  const handleFile = (selectedFile: File) => {
    setFile(selectedFile)
    setDocumentName(selectedFile.name)
  }

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      const fileExtension = droppedFile.name.split(".").pop()?.toLowerCase() || ""
      
      // Check if file type is accepted
      if (["pdf", "doc", "docx"].includes(fileExtension)) {
        handleFile(droppedFile)
      } else {
        alert("Please upload a PDF, DOC, or DOCX file")
      }
    }
  }

  // Open file browser when drop area is clicked
  const onButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!file || !domain || !department || !category) {
      alert("Please fill in all required fields and upload a file")
      return
    }

    const fileExtension = file.name.split(".").pop()?.toLowerCase()
    const isFinal = fileExtension === "pdf"
    const status = isFinal ? "final" : "working"

    const newDocument: Document = {
      id: uuidv4(),
      name: documentName,
      domain,
      department,
      category,
      fileType: fileExtension || "",
      isFinal,
      status,
      file,
    }

    onAddDocument(newDocument)

    // Reset form
    setFile(null)
    setDocumentName("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="domain">Domain</Label>
              <Select value={domain} onValueChange={setDomain} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Domain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Finance">Airline</SelectItem>
                  <SelectItem value="HR">Airport</SelectItem>
                  <SelectItem value="IT">Ports</SelectItem>
                  {/* <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem> */}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={department} onValueChange={setDepartment} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Accounts">TSA</SelectItem>
                  <SelectItem value="Recruitment">HR</SelectItem>
                  <SelectItem value="Development">Cargo</SelectItem>
                  <SelectItem value="Digital">Ground Staff</SelectItem>
                  <SelectItem value="Logistics">Logistics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Document Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Policies">Policies</SelectItem>
                  <SelectItem value="Reports">ASP</SelectItem>
                  <SelectItem value="Forms">Ground Security Process</SelectItem>
                  <SelectItem value="Procedures">Evaculation Procedure</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Upload Document</Label>
            <Input
              ref={fileInputRef}
              id="file"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              required={!file}
            />
            
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                dragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:border-blue-300"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={onButtonClick}
            >
              {file ? (
                <div className="flex flex-col items-center">
                  {file.type.includes("pdf") ? (
                    <FileIcon className="h-12 w-12 text-red-500 mb-2" />
                  ) : (
                    <FileText className="h-12 w-12 text-blue-500 mb-2" />
                  )}
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="h-12 w-12 text-blue-300 mb-2" />
                  <p className="text-lg font-medium">Drag and drop your file here</p>
                  <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                  <p className="text-xs text-gray-400 mt-4">
                    Accepted formats: PDF (Final Version), DOC/DOCX (Working Copy)
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentName">Document Name</Label>
            <Input
              id="documentName"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="Document name (defaults to file name)"
              required
            />
          </div>
          
          <Button type="submit" className="flex items-center gap-2 w-full mt-4">
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}