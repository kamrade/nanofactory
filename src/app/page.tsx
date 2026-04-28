import Link from "next/link";

import { pool } from "@/db";

export const dynamic = "force-dynamic";

async function getDatabaseStatus() {
  try {
    await pool.query("select 1");

    return {
      ok: true,
      message: "Database connection established.",
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to connect to the database.";

    return {
      ok: false,
      message,
    };
  }
}

export default async function HomePage() {
  const databaseStatus = await getDatabaseStatus();

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-16 text-zinc-950">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <h1 className="text-4xl font-semibold tracking-tight">Nanofactory</h1>
        <p className="max-w-2xl text-base leading-7 text-zinc-600">
          Create a complete web page in just 20 minutes.
        </p>
        <div
          className={
            databaseStatus.ok
              ? "rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
              : "rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          }
        >
          <p className="font-medium">
            DB status: {databaseStatus.ok ? "Connected" : "Connection error"}
          </p>
          <p className="mt-1 break-words">{databaseStatus.message}</p>
        </div>
        <div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Go to login
          </Link>
        </div>
      </div>
    </main>
  );
}
