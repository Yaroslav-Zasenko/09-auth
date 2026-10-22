import axios from "axios";
import type { Note, CreateNotePayload } from "@/types/note";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export const apiClient = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = "",
  tag = "all",
}: FetchNotesParams = {}): Promise<FetchNotesResponse> => {
  const response = await apiClient.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      ...(search ? { search } : {}),
      ...(tag && tag !== "all" ? { tag } : {}),
    },
  });
  return response.data;
};

export const getNotes = fetchNotes;

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await apiClient.get<Note>(`/notes/${id}`);
  return response.data;
}

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  const response = await apiClient.post<Note>("/notes", payload);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await apiClient.delete<Note>(`/notes/${id}`);
  return response.data;
};
