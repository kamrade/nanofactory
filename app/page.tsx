import { desc } from 'drizzle-orm';
import { db } from '@/db';
import { notes } from '@/db/schema';
import { revalidatePath } from 'next/cache';

async function createNote(formData: FormData) {
  'use server';

  const title = String(formData.get('title') ?? '').trim();
  const content = String(formData.get('content') ?? '').trim();

  if (!title || !content) {
    throw new Error('Title and content are required');
  }

  await db.insert(notes).values({
    title,
    content,
  });

  revalidatePath('/');
}

export default async function HomePage() {
  const allNotes = await db
    .select()
    .from(notes)
    .orderBy(desc(notes.id));

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10 text-zinc-950">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <section className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            Nanofactory
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Drizzle test
          </h1>
          <p className="max-w-2xl text-sm text-zinc-600 sm:text-base">
            Простая страница для создания и просмотра заметок.
          </p>
        </section>

        <form
          action={createNote}
          className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
        >
          <input
            name="title"
            placeholder="Title"
            className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
          />
          <textarea
            name="content"
            placeholder="Content"
            rows={5}
            className="min-h-32 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
          />
          <div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Create note
            </button>
          </div>
        </form>

        <div className="grid gap-4">
          {allNotes.map((note) => (
            <article
              key={note.id}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-zinc-950">{note.title}</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-700">
                {note.content}
              </p>
              <small className="mt-4 block text-xs text-zinc-500">
                {note.createdAt.toISOString()}
              </small>
            </article>
          ))}

          {allNotes.length === 0 && (
            <p className="rounded-2xl border border-dashed border-zinc-300 bg-white px-5 py-10 text-center text-sm text-zinc-500">
              No notes yet.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
