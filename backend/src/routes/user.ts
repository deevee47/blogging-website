import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'
import { signinInput, signupInput } from '@deevee/medium-clone-common'

export const userRouter =  new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }
}>();



userRouter.post('/signup', async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const { email, name, password } = await c.req.json();
    const { success,error } = signupInput.safeParse({ email, name, password })
    if (!success) {
      c.status(401)
      return c.text(error.issues[0].message)
    }
    const response = await prisma.user.create({
      data: {
        email,
        name,
        password,
      }
    })

    const secret = c.env.JWT_SECRET;
    const token = await sign({id:response.id},secret as string)
    return c.text(token)
  }
  catch (err) {
          c.status(401)
    return c.json({ "ERRORRRR":err })
  }
  
}) 

userRouter.post('/signin', async (c) => {
  const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
  const { email, password }: { email: string, password: string } = await c.req.json();
  
    const { success } = signinInput.safeParse({ email, password })
  if (!success) {
      c.status(401)
      return c.text("Invalid Inputs")
    }

  const response = await prisma.user.findUnique({
  where: {
      email,password
  },
  
  })
  if (!response) {
          c.status(404)
      return c.text("User not found!")
  }
  
  const token = await sign({id:response.id}, c.env.JWT_SECRET)
  return c.text(token)
})
