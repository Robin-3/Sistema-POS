import jwt from 'jsonwebtoken';
import { defineMiddleware } from 'astro/middleware';

const TOKEN = import.meta.env.TOKEN;
const TOKEN_KEY = import.meta.env.TOKEN_KEY;
const URL_HOST = import.meta.env.URL_HOST;
const PUBLIC_ROUTES = ['/login', '/register'];


const verifyAuth = (token?: string) => {
  if (!token) {
    return {
      status: 'unauthorized',
      message: 'Provides the access token.'
    };
  }
  try {
    const payload = jwt.verify(token, TOKEN_KEY);
    const data = payload! as {id: string, names: string, surnames: string};
    return {
      status: 'authorized',
      message: 'Verified token',
      data
    };
  } catch (error) {
    if(import.meta.env.DEV) console.error(error);

    return {
      status: 'error',
      message: 'could not validate auth token'
    };
  }
}

export const onRequest = defineMiddleware(({ url, cookies, locals }, next) => {
  console.log(url.pathname);
  if (PUBLIC_ROUTES.includes(url.pathname)) return next();

  const token = cookies.get(TOKEN)?.value;
  const validation = verifyAuth(token);

  if (validation.status === 'authorized') {
    locals.user = validation.data!;
    return next();
  } else if(url.pathname === '/') {
    return Response.redirect(new URL('/login', URL_HOST));
  }

  if (validation.status === 'error' || validation.status === 'unauthorized')
    return new Response(
      JSON.stringify({ message: validation.message }),
      { status: 401 }
    );

  return Response.redirect(new URL('/', url));
});
