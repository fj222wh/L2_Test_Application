/**
 * The user router.
 *
 * @author Filippa Johansson
 * @version 1.0.0
 */

import express from 'express'
import { UserController } from '../controllers/userController.js'

export const router = express.Router()
const controller = new UserController()

// The /user-URL
router.get('/', controller.authorizeLoggedIn, controller.index)

// When the user tries to login
router.get('/login', (req, res, next) => controller.login(req, res, next))
router.post('/login', (req, res, next) => controller.loginPost(req, res, next))

// When the user wants to log out
router.get('/logout', controller.authorizeLoggedIn, controller.logout)

// When the user want to register as a new user.
router.get('/register', (req, res, next) => controller.register(req, res, next))
router.post('/register', (req, res, next) => controller.registerPost(req, res, next))
