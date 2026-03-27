export type MainSection = {
  heading: string;
  content: string;
};

export type DocumentAnalysis = {
  title: string | null;
  author: string | null;
  summary: string;
  main_sections: MainSection[];
};

export type AnalyzeResponse = {
  filename: string;
  extraction_method?: "direct" | "ocr";
  extracted_text_preview: string;
  analysis: DocumentAnalysis;
};