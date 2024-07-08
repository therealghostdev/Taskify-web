import { verifyToken } from "@/lib/auth";
import db from "@/lib/db";

export async function GET(request: Request) {
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

    const userId = tokenPayload.userId;

    const organisations = await db.organisation.findMany({
      where: {
        users: {
          some: {
            userId,
          },
        },
      },
      select: {
        orgId: true,
        name: true,
        description: true,
      },
    });

    if (!organisations) {
      return new Response(
        JSON.stringify({
          message: "user does not belong to any organisations. Agba loner",
          status: "error",
        }),
        { status: 404 }
      );
    }

    return Response.json(
      {
        status: "success",
        message: "Organisations retrieved successfully",
        data: {
          organisations,
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

export async function POST(request: Request) {
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

    const body = await request.json();
    const { name, description = "" } = body;

    if (!name) {
      throw new Error("Name cannot be Empty");
    }

    const newOrganisation = await db.organisation.create({
      data: {
        name,
        description,
        users: {
          connect: {
            userId: tokenPayload.userId,
          },
        },
      },
    });

    return Response.json(
      {
        status: "success",
        message: "Organisation created successfully",
        data: {
          orgId: newOrganisation.orgId,
          name: newOrganisation.name,
          description: newOrganisation.description,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      {
        status: "Bad Request",
        message: "Client error",
        statusCode: 400,
      },
      { status: 400 }
    );
  }
}
