import type { NextFunction, Request, Response } from 'express'

type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown> | unknown

/** Express 4 no reenvia rechazos de promesas al error handler; este wrapper lo hace. */
export const asyncHandler = (handler: AsyncRouteHandler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(handler(req, res, next)).catch(next)
}
