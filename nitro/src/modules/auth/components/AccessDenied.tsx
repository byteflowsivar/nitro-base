import Link from 'next/link';

export default function AccessDenied() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl">Acceso Denegado</h1>
        <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
          No tienes permiso para acceder a esta página.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-800 dark:focus-visible:ring-blue-300"
          >
            Ir al Dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
          >
            Ir a Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
