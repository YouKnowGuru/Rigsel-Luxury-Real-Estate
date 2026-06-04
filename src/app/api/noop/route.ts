/** Fast 204 for stale PWA/Vite service-worker requests on localhost */
export function GET() {
  return new Response(null, { status: 204 });
}
