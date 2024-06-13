import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'
import { createPostInput, updatePostInput } from '@deevee/medium-clone-common';

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: any
    }
}>();

blogRouter.use("/*", async (c, next) => {
  //Middleware logic
  try {
    const authHeader = c.req.header("Authorization");
    const token = authHeader?.split(" ")[1];
      const verificationResponse = await verify(token as string, c.env.JWT_SECRET)
      console.log(verificationResponse);
      
    c.set("userId",verificationResponse.id)
    await next()
  }
  catch (err) {
    return c.text("Error Authenticating You!")
  }
})



blogRouter.post('/', async (c) => {
	const userId = c.get('userId');
	const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL,
	}).$extends(withAccelerate());

    const body = await c.req.json();
    const { success, error } = createPostInput.safeParse(body)
    if (!success) {
      return c.text(error.issues[0].message)
    }
	const post = await prisma.post.create({
		data: {
			title: body.title,
			content: body.content,
			authorId: userId
		}
	});
	return c.json({
		id: post.id
	});
})

blogRouter.put('/update', async (c) => {
    try { 
    const userId = c.get('userId');
	const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL,
	}).$extends(withAccelerate());

        const body = await c.req.json();
        const { success, error } = updatePostInput.safeParse(body)
        if (!success) {
        return c.text("Error faced:"+ error.issues[0].message)
        }
        const res = await prisma.post.update({
            where: {
                id: body.id,
                authorId: userId
            },
            data: {
                title: body.title,
                content: body.content
            }
        });

        return c.json({message:res})
    }
    catch (err) {
        return c.json({error:err})
    }
});

blogRouter.get('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());
	
        const post = await prisma.post.findUnique({
            where: {
                id
            }
        });

        return c.json(post);
    }
    catch (err) {
        return c.json({"error faced:": err})
    }
})