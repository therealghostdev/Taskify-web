import { verifyToken } from "@/lib/auth";
import db from "@/lib/db";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: { orgId: string };
  }
) {
  try {
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
    const orgId = params.orgId;
    const requestingUserId = tokenPayload.userId;

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      throw new Error("userId is missing");
    }

    const organisation = await db.organisation.findUnique({
      where: { orgId },
      include: {
        users: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!organisation) {
      return Response.json(
        {
          message: "Organisation not found",
          status: "error",
        },
        { status: 404 }
      );
    }

    const isAuthorized = organisation.users.some(
      (user) => user.userId === requestingUserId
    );

    if (!isAuthorized) {
      return Response.json(
        {
          message: "Unauthorized",
          status: "error",
        },
        { status: 401 }
      );
    }

    // Add the user to the organisation
    await db.organisation.update({
      where: { orgId },
      data: {
        users: {
          connect: { userId },
        },
      },
    });

    return Response.json(
      {
        status: "success",
        message: "User added to organisation successfully",
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
