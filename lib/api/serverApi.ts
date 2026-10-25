// lib/api/serverApi.ts
import { cookies } from "next/headers";
import { api } from "./api";
import { Note } from "@/types/note";
import { User } from "@/types/user";
import { AxiosResponse } from "axios";

const getCookieHeader = async (): Promise<{ headers: { Cookie: string } }> => {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();
  return { headers: { Cookie: cookieString } };
};

export async function fetchNotes(
  search = "",
  page = 1,
  tag = "",
): Promise<{ notes: Note[]; totalPages: number }> {
  const cookieHeader = await getCookieHeader();
  const params: Record<string, string | number> = { page, perPage: 12 };
  if (search) params.search = search;
  if (tag) params.tag = tag;

  const response = await api.get<{ notes: Note[]; totalPages: number }>(
    "/notes",
    {
      ...cookieHeader,
      params,
    },
  );
  return response.data;
}

export const getNotes = fetchNotes;

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieHeader = await getCookieHeader();
  const response = await api.get<Note>(`/notes/${id}`, cookieHeader);
  return response.data;
}

export async function getMe(): Promise<User> {
  const cookieHeader = await getCookieHeader();
  const response = await api.get<User>("/users/me", cookieHeader);
  return response.data;
}

export async function checkSession(): Promise<AxiosResponse<User>> {
  const cookieHeader = await getCookieHeader();
  return await api.get<User>("/auth/session", cookieHeader);
}
