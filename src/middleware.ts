import { defineMiddleware } from 'astro:middleware';
import { getSession } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname;

  // Only protect /admin/* routes
  if (!pathname.startsWith('/admin')) {
    return next();
  }

  const token = getSession(context.cookies);
  if (!token) {
    return context.redirect('/api/auth/login');
  }

  return next();
});
