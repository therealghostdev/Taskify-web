import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, password, phone } = body;

    // Throw Error for non null values
    if (!email) {
      return Response.json(
        {
          errors: [
            {
              field: "email",
              message: "user email must be provided",
            },
          ],
        },
        { status: 422 }
      );
    }

    if (typeof email !== "string") {
      return Response.json(
        {
          errors: [
            {
              field: "email",
              message: "user email must be a string",
            },
          ],
        },
        { status: 422 }
      );
    }
    if (!firstName) {
      return Response.json(
        {
          errors: [
            {
              field: "First Name",
              message: "user first name must be provided",
            },
          ],
        },
        { status: 422 }
      );
    }

    if (typeof firstName !== "string") {
      return Response.json(
        {
          errors: [
            {
              field: "First Name",
              message: "user first name must be a string",
            },
          ],
        },
        { status: 422 }
      );
    }

    if (!lastName) {
      return Response.json(
        {
          errors: [
            {
              field: "Last Name",
              message: "user last name must be provided",
            },
          ],
        },
        { status: 422 }
      );
    }

    if (typeof lastName !== "string") {
      return Response.json(
        {
          errors: [
            {
              field: "Last Name",
              message: "user last name must be a string",
            },
          ],
        },
        { status: 422 }
      );
    }
    if (!password) {
      return Response.json(
        {
          errors: [
            {
              field: "password",
              message: "user password must be provided",
            },
          ],
        },
        { status: 422 }
      );
    }

    if (typeof password !== "string") {
      return Response.json(
        {
          errors: [
            {
              field: "password",
              message: "user password must be a string",
            },
          ],
        },
        { status: 422 }
      );
    }

    if (typeof phone !== "string") {
      return Response.json(
        {
          errors: [
            {
              field: "phone",
              message: "user phone must be a string",
            },
          ],
        },
        { status: 422 }
      );
    }

    const userExist = await db.user.findUnique({
      where: { email },
    });

    if (userExist) {
      return Response.json(
        {
          errors: [
            {
              field: "Email",
              message: "User with this email already exist",
            },
          ],
        },
        { status: 422 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        organisations: {
          create: {
            name: `${firstName}'s Organisation`,
            description: `Default Organisation, created on registration`,
          },
        },
      },
      include: {
        organisations: true,
      },
    });

    const accessToken = signToken(newUser);

    return Response.json(
      {
        status: "success",
        message: "Registration successful",
        data: {
          accessToken,
          user: {
            userId: newUser.userId,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            phone: newUser.phone,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      {
        status: "Bad request",
        message: "Registration unsuccessful",
        statusCode: 400,
      },
      { status: 400 }
    );
  }
}
