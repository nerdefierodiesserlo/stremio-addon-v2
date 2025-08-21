import { Request, Response, NextFunction } from 'express';

import 'express-session';

declare module 'express-session' {
  interface SessionData {
    loggedIn?: boolean;
  }
}

export const isAuthenticatedApi = (req: Request, res: Response, next: NextFunction) => {
    if (req.session?.loggedIn) {
        return next();
    }
    res.sendStatus(401);
};

export const isAuthenticatedWeb = (req: Request, res: Response, next: NextFunction) => {
    if (req.session?.loggedIn) {
        return next();
    }
    res.redirect('/login');
};