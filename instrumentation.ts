// instrumentation.ts — Next.js Instrumentation Hook
// Dijalankan di sisi server (Node.js runtime) untuk observabilitas error.
// onRequestError dipanggil setiap kali Server Component / Route Handler melempar error.

export async function onRequestError(
  err: { message: string; digest?: string },
  request: { url: string; method: string },
  context: { routerKind: string; routePath: string; routeType: string }
) {
  try {
    const url = new URL(request.url);

    // Log error server-side tanpa data sensitif.
    // Authorization header, cookie, dan body TIDAK disertakan.
    console.error(
      JSON.stringify({
        type: 'SERVER_REQUEST_ERROR',
        path: url.pathname,
        method: request.method,
        routePath: context.routePath,
        routeType: context.routeType,
        message: err.message,
        digest: err.digest,
        timestamp: new Date().toISOString(),
      })
    );
  } catch {
    // Jangan lempar error baru dari dalam error handler
    console.error('[instrumentation] Failed to log error:', err.message);
  }
}

