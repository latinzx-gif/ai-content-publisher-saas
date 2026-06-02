export async function GET() {
  return new Response(JSON.stringify({
    error: 'Not found',
    message: 'Auth bypass is disabled in production.',
  }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
}
