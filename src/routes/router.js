/**
 * The main router.
 *
 * @author Filippa Johansson
 * @version 1.0.0
 */

import express from 'express'
import { router as homeRouter } from './homeRouter.js'
import { router as snippetRouter } from './snippetRouter.js'
import { router as userRouter } from './userRouter.js'

export const router = express.Router()

// The home router controls the routing on the '/' path.
router.use('/', homeRouter)
router.use('/user', userRouter)
router.use('/snippet', snippetRouter)

// General catch all errors.
router.use('*', (req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
