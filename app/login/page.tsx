import Link from "next/link";
import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/auth";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
  const session = await getServerAuthSession();

  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-16 text-zinc-950">
      <div className="mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section className="space-y-5">
          <div>
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
            >
              Back to main
            </Link>
          </div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            Nanofactory
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Sign in to your workspace
          </h1>
          <p className="max-w-xl text-base leading-7 text-zinc-600 sm:text-lg">
            Build and manage complete web pages in minutes. Use your email and
            password to access the private dashboard.
          </p>
        </section>

        <div className="mx-auto w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
