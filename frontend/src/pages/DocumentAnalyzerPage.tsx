import { useRef, useState } from "react";
import type { AnalyzeResponse } from "@/types/document";
import { Upload, FileText, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axiosClient from "@/utils/axios";

export default function DocumentAnalyzerPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const validateFile = (file: File) => {
    const isValidType =
      allowedTypes.includes(file.type) ||
      file.name.toLowerCase().endsWith(".pdf") ||
      file.name.toLowerCase().endsWith(".docx");

    if (!isValidType) {
      return "Only PDF and DOCX files are allowed.";
    }

    const maxSizeInMB = 10;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      return `File is too large. Maximum allowed size is ${maxSizeInMB}MB.`;
    }

    return "";
  };

  const handleFileChange = (file: File | null) => {
    setError("");
    setResult(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setSelectedFile(null);
      setError(validationError);
      return;
    }

    setSelectedFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0] || null;
    handleFileChange(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axiosClient.post<AnalyzeResponse>("/api/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(response.data);
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        "Something went wrong while analyzing the document.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setSelectedFile(null);
    setError("");
    setResult(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              AI Document Analyzer
            </Badge>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Upload and analyze a document
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
            Upload a PDF or DOCX file and extract its title, author, summary, and key sections.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Upload document</CardTitle>
              <CardDescription>
                Supported formats: PDF and DOCX
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(true);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(false);
                }}
                onDrop={handleDrop}
                className={`rounded-2xl border border-dashed p-6 text-center transition ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-slate-300 bg-white"
                }`}
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                  <Upload className="h-6 w-6 text-slate-700" />
                </div>

                <h3 className="text-base font-medium">Drag and drop your file here</h3>
                <p className="mt-1 text-sm text-slate-500">
                  or click below to choose a file
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={handleInputChange}
                />

                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 rounded-xl"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose file
                </Button>
              </div>

              {selectedFile && (
                <div className="rounded-2xl border bg-white p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-slate-100 p-2">
                      <FileText className="h-5 w-5 text-slate-700" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-slate-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <Alert variant="destructive" className="rounded-2xl">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Upload error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={loading || !selectedFile}
                  className="flex-1 rounded-xl"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze document"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={resetAll}
                  disabled={loading}
                  className="rounded-xl"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <div>
            {!result ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
                  <div className="mb-4 rounded-2xl bg-slate-100 p-4">
                    <FileText className="h-8 w-8 text-slate-700" />
                  </div>
                  <h2 className="text-xl font-semibold">No analysis yet</h2>
                  <p className="mt-2 max-w-md text-sm text-slate-500">
                    Upload a valid PDF or DOCX file and run analysis to view the extracted
                    information here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5" />
                          Analysis result
                        </CardTitle>
                        <CardDescription className="mt-1">
                          File: {result.filename}
                        </CardDescription>
                      </div>

                      {result.extraction_method && (
                        <Badge variant="outline" className="w-fit rounded-full px-3 py-1">
                          Extraction: {result.extraction_method.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                          Title
                        </p>
                        <p className="text-sm font-medium text-slate-900">
                          {result.analysis.title || "Not clearly detected"}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                          Author
                        </p>
                        <p className="text-sm font-medium text-slate-900">
                          {result.analysis.author || "Not clearly detected"}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                        Summary
                      </p>
                      <p className="text-sm leading-7 text-slate-700">
                        {result.analysis.summary || "No summary returned."}
                      </p>
                    </div>


                    <div>
                      <h3 className="mb-3 text-base font-semibold">Main sections</h3>

                      {result.analysis.main_sections?.length ? (
                        <div className="space-y-4">
                          {result.analysis.main_sections.map((section, index) => (
                            <div
                              key={`${section.heading}-${index}`}
                              className="rounded-2xl border bg-white p-4"
                            >
                              <h4 className="text-sm font-semibold text-slate-900">
                                {section.heading || `Section ${index + 1}`}
                              </h4>
                              <p className="mt-2 text-sm leading-7 text-slate-600">
                                {section.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed p-4 text-sm text-slate-500">
                          No major sections were returned.
                        </div>
                      )}
                    </div>


                    <div>
                      <h3 className="mb-3 text-base font-semibold">Extracted text preview</h3>
                      <div className="max-h-72 overflow-auto rounded-2xl bg-slate-950 p-4">
                        <pre className="whitespace-pre-wrap break-words text-xs leading-6 text-slate-100">
                          {result.extracted_text_preview || "No preview available."}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}