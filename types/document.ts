export interface Document {
  id: string
  name: string
  domain: string
  department: string
  category: string
  fileType: string
  isFinal: boolean
  file: File
  status: "final" | "working" | "review"
}
