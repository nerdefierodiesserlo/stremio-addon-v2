import express, { Router, Request, Response } from 'express';

const router = Router();

router.post(
  '/',
  (req, res, next) => {
    express.urlencoded({ extended: true })(req, res, next);
  },
  (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (
      process.env.USE_CREDENTIALS === "true" &&
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      req.session.loggedIn = true;
      res.redirect('/');
    } else {
      res.redirect('/login?error=invalid');
    }
  }
);

export default router;