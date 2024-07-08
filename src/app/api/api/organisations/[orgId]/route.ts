import { verifyToken } from "@/lib/auth";
import db from "@/lib/db";

export async function GET(
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
    const userId = tokenPayload.userId;

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
      throw new Error("Organisation not found");
    }

    const isAuthorized = organisation.users.some(
      (user) => user.userId === userId
    );

    if (!isAuthorized) {
      return new Response(
        JSON.stringify({
          message: "User dees not belong or create Organisation",
          status: "error",
        }),
        { status: 403 }
      );
    }

    return Response.json(
      {
        status: "success",
        message: "Organisation retrieved successfully",
        data: {
          orgId: organisation.orgId,
          name: organisation.name,
          description: organisation.description,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        message: "Organisation not found",
        status: "error",
      },
      { status: 404 }
    );
  }
}
