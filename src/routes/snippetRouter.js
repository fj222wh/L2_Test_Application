/**
 * The snippet router.
 *
 * @author Filippa Johansson
 * @version 1.0.0
 */

import express from 'express'
import { SnippetController } from '../controllers/snippetController.js'

export const router = express.Router()
const controller = new SnippetController()

// Provide the router with the req.doc if its available
router.param('id', (req, res, next, id) => controller.loadDoc(req, res, next, id))

router.get('/', (req, res, next) => controller.index(req, res, next))

// Create
router.get('/create', controller.authorizeLoggedIn, controller.create)
router.post('/create', controller.authorizeLoggedIn, controller.createPost)

// Update
router.get('/:id/update', controller.authorizeAuthor, controller.update)
router.post('/:id/update', controller.authorizeAuthor, controller.updatePost)

// Delete
router.get('/:id/delete', controller.authorizeAuthor, controller.delete)
router.post('/:id/delete', controller.authorizeAuthor, controller.deletePost)
