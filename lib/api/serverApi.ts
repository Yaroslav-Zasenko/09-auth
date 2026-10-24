import { api } from "@/lib/api/api";
import { cookies } from "next/headers";
import type { Note } from "@/types/note";
import { User } from "@/types/user";

const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  return {
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
};

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
}: FetchNotesParams = {}) => {
  const headers = await getAuthHeaders();
  const response = await api.get("/notes", {
    ...headers,
    params: {
      page,
      perPage,
      ...(search ? { search } : {}),
      ...(tag && tag !== "all" ? { tag } : {}),
    },
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const headers = await getAuthHeaders();
  const response = await api.get<Note>(`/notes/${id}`, headers);
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const headers = await getAuthHeaders();
  const response = await api.get<User>("/users/me", headers);
  return response.data;
};

export const checkSession = async (): Promise<User | null> => {
  const headers = await getAuthHeaders();
  const response = await api.get<User>("/auth/session", headers);
  return response.data;
};
export const getNotes = fetchNotes;
