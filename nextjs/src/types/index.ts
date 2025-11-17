
export * from './resume';

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

export interface PDFGenerationRequest {
  html: string;
  filename?: string;
}

export interface PDFGenerationResponse {
  success: boolean;
  message?: string;
  error?: string;
}
