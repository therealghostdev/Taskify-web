import { verifyToken } from "@/lib/auth";
import db from "@/lib/db";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  try {
    const userId = params.id;
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      throw new Error("user is not authorized");
    }

    const tokenPayload = verifyToken(token);

    if (!tokenPayload) {
      return Response.json(
        {
          message: "Unauthorized",
          status: "error",
        },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { userId },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        password: true,
        organisations: {
          select: {
            orgId: true,
            users: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return new Response(
        JSON.stringify({
          message: "user does not exist",
          status: "error",
        }),
        { status: 404 }
      );
    }

    const isAuthorized =
      user.userId === userId ||
      user.organisations.some((org) =>
        org.users.some((u) => u.userId === userId)
      );

    return Response.json(
      {
        status: "success",
        message: "User retrieved successfully",
        data: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        status: "error",
        message: "Unauthorized",
        statusCode: 401,
      },
      { status: 401 }
    );
  }
}
