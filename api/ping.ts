export async function GET() {
  return new Response(JSON.stringify({ message: 'pong' }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
