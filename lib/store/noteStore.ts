import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CreateNotePayload } from "@/types/note";

type NoteStore = {
  draft: CreateNotePayload;
  setDraft: (note: Partial<CreateNotePayload>) => void;
  clearDraft: () => void;
};

const initialDraft: CreateNotePayload = {
  title: "",
  content: "",
  tag: "Todo",
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) =>
        set((state) => ({
          draft: { ...state.draft, ...note },
        })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "note-draft-storage",
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
);
