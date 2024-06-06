import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import bcrypt from 'bcryptjs';
import { signupInput } from '../../../common-types/index';

const router = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
  Variables: {
    // prisma: object;
  };
}>();

router.get('/', async (c) => {
  return c.text('hello');
});

// create user
router.post('/', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();
    const input = signupInput.safeParse(body);

    if (input.error) {
      return c.json({ message: input.error.errors }, 403);
    }

    const hashedPassword = bcrypt.hashSync(input.data.password);

    const user = await prisma.user.create({
      data: {
        name: input.data.name,
        email: input.data.email,
        password: hashedPassword,
      },
    });

    if (!user) {
      return c.json({ message: 'Error registering user' }, 500);
    }

    return c.json({ message: 'User registered successfully' }, 201);
  } catch (error) {
    return c.json({ message: 'Something went wrong' }, 500);
  }
});

export default router;