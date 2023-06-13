// pages/api/auth/[...auth0].ts
import { handleAuth } from '@auth0/nextjs-auth0'
import { handleLogin } from '@auth0/nextjs-auth0'



export default handleAuth({
  async login(req, res) {
    await handleLogin(req, res, {
      returnTo: process.env.AUTH0_LOGIN_RETURN_TO_PATH,
    });
  },
});
