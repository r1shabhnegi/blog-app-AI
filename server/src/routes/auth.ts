import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import bcrypt from "bcryptjs";
import { signinInput } from "../../../common-types/index";
import { sign, verify } from "hono/jwt";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { jwtVerify } from "../middlewares/jwtVerify";

const router = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_ACCESS_TOKEN_SECRET: string;
    JWT_REFRESH_TOKEN_SECRET: string;
  };
  Variables: {
    // prisma: object;
    userId: string;
  };
}>();

router.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();

    const input = signinInput.safeParse(body);

    if (input.error) {
      return c.json({ message: input.error.errors }, 403);
    }

    const foundUser = await prisma.user.findUnique({
      where: {
        email: input.data.email,
      },
    });

    if (!foundUser) {
      return c.json({ message: "User does not exist" }, 403);
    }
    const isPwMatch = await bcrypt.compare(
      input.data.password,
      foundUser.password
    );

    if (!isPwMatch) {
      return c.json({ message: "Password does not match" }, 401);
    }

    const jwtPayload = (expIn: number) => {
      return {
        userId: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        exp: expIn,
      };
    };

    const expireIn3h = Math.floor(Date.now() / 1000) + 60 * 180;
    const expireIn1d = Math.floor(Date.now() / 1000) + 60 * 1440;

    const accessToken = await sign(
      jwtPayload(expireIn3h),
      c.env.JWT_ACCESS_TOKEN_SECRET
    );

    const refreshToken = await sign(
      jwtPayload(expireIn1d),
      c.env.JWT_REFRESH_TOKEN_SECRET
    );

    const cookieToken = getCookie(c, "jwt");

    let prevTokens = cookieToken
      ? foundUser.refreshToken.filter((token) => token !== cookieToken)
      : foundUser.refreshToken;

    if (cookieToken) {
      const foundUser = await prisma.user.findFirst({
        where: {
          refreshToken: {
            has: cookieToken,
          },
        },
      });

      if (foundUser) {
        prevTokens = [];
      }

      deleteCookie(c, "jwt", { secure: true, httpOnly: true });
    }

    const newRefreshTokenArray = [...prevTokens, refreshToken];

    const updatedRefreshToken = await prisma.user.update({
      where: {
        email: foundUser.email,
      },
      data: {
        refreshToken: newRefreshTokenArray,
      },
    });

    if (!updatedRefreshToken) {
      return c.json({ message: "Error updating refresh token" }, 403);
    }

    setCookie(c, "jwt", refreshToken, {
      secure: true,
      httpOnly: true,
      maxAge: 86400,
    });

    return c.json(accessToken, 201);
  } catch (error) {
    return c.json({ message: "something went wrong" }, 500);
  }
});

// refresh token

router.get("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const cookieToken = getCookie(c, "jwt");
    if (!cookieToken) {
      return c.json({ message: "Token required" }, 401);
    }

    const verifiedToken = await verify(
      cookieToken,
      c.env.JWT_REFRESH_TOKEN_SECRET
    );

    const foundUser = await prisma.user.findFirst({
      where: {
        refreshToken: {
          has: cookieToken,
        },
      },
    });

    if (!foundUser) {
      if (!verifiedToken) {
        return c.json({ message: "Token expired" }, 403);
      }
      const jwtPayload = (expIn: number) => {
        return {
          userId: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          exp: expIn,
        };
      };

      const expireIn3h = Math.floor(Date.now() / 1000) + 60 * 180;
      const expireIn1d = Math.floor(Date.now() / 1000) + 60 * 1440;

      const accessToken = await sign(
        jwtPayload(expireIn3h),
        c.env.JWT_ACCESS_TOKEN_SECRET
      );

      const refreshToken = await sign(
        jwtPayload(expireIn1d),
        c.env.JWT_REFRESH_TOKEN_SECRET
      );

      const prevTokens = foundUser.refreshToken.filter(
        (token) => token !== cookieToken
      );

      const newRefreshTokenArray = [...prevTokens, refreshToken];

      const updatedRefreshToken = await prisma.user.update({
        where: {
          email: foundUser.email,
        },
        data: {
          refreshToken: newRefreshTokenArray,
        },
      });

      if (!updatedRefreshToken) {
        return c.json({ message: "Error updating refresh token" }, 403);
      }

      setCookie(c, "jwt", refreshToken, { secure: true, httpOnly: true });
      return c.json(
        {
          userId: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          token: accessToken,
        },
        201
      );
    } else {
      deleteCookie(c, "jwt", { httpOnly: true, secure: true });
      return c.json({ message: "Can't able to validate user" }, 403);
    }
  } catch (error) {
    return c.json({ message: error }, 500);
  }
});

//logout

router.post("/logout", jwtVerify, async (c) => {
  console.log(c.get("userId"));
  return c.json("called");
});
export default router;