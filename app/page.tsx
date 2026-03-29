import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-16 text-zinc-950">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <h1 className="text-4xl font-semibold tracking-tight">Nanofactory</h1>
        <p className="max-w-2xl text-base leading-7 text-zinc-600">
          Create a complete web page in just 15 minutes.
        </p>
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
