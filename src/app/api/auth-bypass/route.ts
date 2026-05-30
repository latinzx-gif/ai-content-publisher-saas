import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const email = 'latinzx@gmail.com';
    const password = 'password123';

    // Sign in using the standard server client to establish a valid cookie-based session
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return new Response(JSON.stringify({ 
        error: "Sign in failed", 
        message: error.message 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Redirect to root dashboard
    return NextResponse.redirect(new URL('/', request.url));
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ 
      error: "Unexpected server error during auth bypass", 
      message: errorMsg,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
