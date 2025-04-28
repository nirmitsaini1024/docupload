"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Document } from "@/types/document"
import { v4 as uuidv4 } from "uuid"
import { Upload, FileText, FileIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface FileUploadProps {
  onAddDocument: (document: Document) => void
}

export function FileUpload({ onAddDocument }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [documentName, setDocumentName] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [domain, setDomain] = useState("")
  const [department, setDepartment] = useState("")
  const [category, setCategory] = useState("")
  const [isFinal, setIsFinal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const domains = ["Finance", "HR", "IT", "Marketing", "Operations", "Legal"]
  const departments = {
    Finance: ["Accounting", "Budgeting", "Payroll", "Tax"],
    HR: ["Recruitment", "Training", "Benefits", "Employee Relations"],
    IT: ["Development", "Infrastructure", "Support", "Security"],
    Marketing: ["Digital", "Content", "Brand", "Analytics"],
    Operations: ["Logistics", "Production", "Quality", "Facilities"],
    Legal: ["Compliance", "Contracts", "Intellectual Property", "Litigation"],
  }
  const categories = ["Policies", "Reports", "Forms", "Procedures", "Guidelines", "Templates"]

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile)
    setDocumentName(selectedFile.name)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0])
    }
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleDomainChange = (value: string) => {
    setDomain(value)
    setDepartment("") // Reset department when domain changes
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!file || !domain || !department || !category) {
      alert("Please fill in all required fields and upload a file")
      return
    }

    const fileExtension = file.name.split(".").pop()?.toLowerCase()
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

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <Card className="border border-blue-100 shadow-md overflow-hidden">
      <div className="p-4 bg-blue-50 border-b border-blue-100">
        <h2 className="text-xl font-semibold text-blue-800">Upload Document</h2>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="domain">Domain</Label>
              <Select value={domain} onValueChange={handleDomainChange} required>
                <SelectTrigger className="border-blue-100 focus:border-blue-300">
                  <SelectValue placeholder="Select Domain" />
                </SelectTrigger>
                <SelectContent>
                  {domains.map((domain) => (
                    <SelectItem key={domain} value={domain}>
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={department} onValueChange={setDepartment} disabled={!domain} required>
                <SelectTrigger className="border-blue-100 focus:border-blue-300">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {domain &&
                    departments[domain as keyof typeof departments]?.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Document Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="border-blue-100 focus:border-blue-300">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-blue-300"
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleInputChange}
              className="hidden"
            />

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
                <p className="text-xs text-gray-400 mt-4">Accepted formats: PDF, DOC, DOCX</p>
              </div>
            )}
          </div>

          {file && (
            <>
              <div className="space-y-2">
                <Label htmlFor="documentName" className="text-sm font-medium">
                  Document Name
                </Label>
                <Input
                  id="documentName"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="Document name (defaults to file name)"
                  className="border-blue-100 focus:border-blue-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Document Type</Label>
                <RadioGroup
                  defaultValue={isFinal ? "final" : "working"}
                  onValueChange={(value) => setIsFinal(value === "final")}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="final" id="final" />
                    <Label htmlFor="final">Final Version</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="working" id="working" />
                    <Label htmlFor="working">Working Copy</Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}

          {file && (
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                Upload Document
              </Button>
            </div>
          )}
        </form>
      </div>
    </Card>
  )
}
