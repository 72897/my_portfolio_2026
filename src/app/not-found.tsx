import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="mt-2 text-3xl font-bold font-[family-name:var(--font-heading)] md:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          This page does not exist or has moved.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/" className="anime-btn">
            Home
          </Link>
          <Link href="/projects" className="anime-btn-outline">
            Projects
          </Link>
        </div>
      </div>
    </section>
  );
}
