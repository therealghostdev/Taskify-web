import { signToken } from "@/lib/auth";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      throw new Error("invalid password or username");
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("user does not exist");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("invalid password or username");
    }

    const accessToken = signToken(user);

    return new Response(
      JSON.stringify({
        status: "success",
        message: "Login successful",
        data: {
          accessToken,
          user: {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
          },
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return Response.json(
      {
        status: "Bad request",
        message: "Authentication failed",
        statusCode: 401,
      },
      { status: 401, statusText: "Bad request" }
    );
  }
}
