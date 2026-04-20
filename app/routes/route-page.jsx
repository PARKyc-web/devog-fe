import { Link } from "react-router";

export function RoutePage({ title, description }) {
  return (
    <main className="min-h-screen bg-[#f6f8f5] text-[#151815]">
      <header className="flex h-20 items-center justify-between px-6 sm:px-10">
        <Link
          className="text-xl font-bold tracking-wide text-[#1f6b49]"
          to="/"
        >
          DEVOG
        </Link>
        <Link
          className="rounded-md border border-[#cbd8c5] bg-white px-4 py-2 text-sm font-semibold text-[#2d332e] transition hover:border-[#2e7353] hover:text-[#1f6b49]"
          to="/"
        >
          처음으로
        </Link>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-4xl flex-col justify-center px-6 py-16 sm:px-10">
        <p className="text-sm font-semibold text-[#2e7353]">DEVOG</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-[#59615a]">
          {description}
        </p>
      </section>
    </main>
  );
}
