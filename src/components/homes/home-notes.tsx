"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { HomeNote } from "@/generated/prisma/client";
import {
  addHomeNote,
  deleteHomeNote,
  updateHomeNote,
} from "@/lib/actions/homes";
import { Button } from "@/components/ui/button";

export function HomeNotes({
  notes,
  homeId,
  clientId,
  currentUserId,
}: {
  notes: HomeNote[];
  homeId: string;
  clientId: string;
  currentUserId: string;
}) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  async function handleAdd() {
    if (!content.trim()) return;
    await addHomeNote(homeId, clientId, content.trim());
    setContent("");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a shared note…"
          rows={2}
          className="flex w-full rounded-lg border border-input bg-background px-2.5 py-2 text-sm"
        />
        <Button size="sm" onClick={handleAdd}>
          Add note
        </Button>
      </div>
      <ul className="space-y-3">
        {notes.map((note) => {
          const isAuthor = note.authorId === currentUserId;
          const isEditing = editingId === note.id;
          return (
            <li
              key={note.id}
              className="rounded-lg border border-border/60 bg-card p-3 text-sm"
            >
              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={2}
                    className="flex w-full rounded-lg border border-input px-2 py-1.5 text-sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={async () => {
                        await updateHomeNote(
                          note.id,
                          homeId,
                          clientId,
                          editContent
                        );
                        setEditingId(null);
                        router.refresh();
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="whitespace-pre-wrap">{note.content}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {note.authorName} · {note.authorRole.toLowerCase()} ·{" "}
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                  {isAuthor && (
                    <div className="mt-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingId(note.id);
                          setEditContent(note.content);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={async () => {
                          await deleteHomeNote(note.id, homeId, clientId);
                          router.refresh();
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
