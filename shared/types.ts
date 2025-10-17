export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// Minimal real-world chat example types (shared by frontend and worker)
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number; // epoch millis
}
// Clarity Cash Transaction Type
export interface Transaction {
  id: string;
  description: string;
  amount: number; // in cents
  type: 'income' | 'expense';
  category: string;
  date: string; // ISO 8601 string
}