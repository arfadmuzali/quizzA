// import { supabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await registerSchema.safeParseAsync(body);

    if (!response.success) {
      const { errors } = response.error;

      return NextResponse.json(
        { error: { message: "Bad Request" }, errors },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email: response.data.email,
      password: response.data.password,
    });

    if (error) {
      return NextResponse.json(
        { error: { message: error.message } },
        { status: 401 }
      );
    }

    return NextResponse.json(data.user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: { message: "Internal Server Error" } },
      { status: 500 }
    );
  }
}
