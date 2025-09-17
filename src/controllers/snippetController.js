/**
 * The home controller.
 *
 * @author Filippa Johansson
 * @version 1.0.0
 */

import { SnippetModel } from '../models/SnippetModel.js'

/**
 * The home controller.
 */
export class SnippetController {
  /**
   * A function to authorize a user for the delete and update page.
   *
   * @param {object} req The request object.
   * @param {object} res The response object.
   * @param {Function} next The next middleware function.
   */
  authorizeAuthor (req, res, next) {
    if (!req.session.user) {
      const error = new Error('Not Found')
      error.status = 404
      throw error
    } else if (req.session.user.id !== req.doc.authorID) {
      const error = new Error('Not Found')
      error.status = 403
      throw error
    }

    next()
  }

  /**
   * A function to authorize if a user is logged in.
   *
   * @param {object} req The request object.
   * @param {object} res The response object.
   * @param {Function} next The next middleware function.
   */
  authorizeLoggedIn (req, res, next) {
    if (!req.session.user) {
      const error = new Error('Not Found')
      error.status = 404
      throw error
    }

    next()
  }

  /**
   * Load a document from the data based in an id.
   *
   * @param {object} req The request object.
   * @param {object} res The response object.
   * @param {Function} next The next middleware function.
   * @param {string} id The id.
   */
  async loadDoc (req, res, next, id) {
    try {
      const snippetDoc = await SnippetModel.findById(id)

      if (!snippetDoc) {
        const error = new Error('The snippet you requested does not exist.')
        error.status = 404
        throw error
      }

      req.doc = snippetDoc

      // Next middleware.
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Renders the snippets index page.
   *
   * @param {object} req The request object.
   * @param {object} res The response object.
   * @param {Function} next The next middleware function.
   */
  async index (req, res, next) {
    try {
      const viewData = {
        data: (await SnippetModel.find())
          .map(snippetDoc => ({
            ...snippetDoc.toObject(),
            dateCreatedAt: new Date(snippetDoc.createdAt).toLocaleDateString('sv-SE'),
            dateUpdatedAt: new Date(snippetDoc.updatedAt).toLocaleDateString('sv-SE'),
            timeCreatedAt: new Date(snippetDoc.createdAt).toLocaleTimeString('sv-SE'),
            timeUpdatedAt: new Date(snippetDoc.updatedAt).toLocaleTimeString('sv-SE')
          }))

      }

      res.render('snippets/index', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Renders the snippets form to create new snippets.
   *
   * @param {object} req The request object.
   * @param {object} res The response object.
   * @param {Function} next The next middleware function.
   */
  create (req, res, next) {
    res.render('snippets/create')
  }

  /**
   * Creates a snippet and saves it to the data base.
   *
   * @param {object} req The request object.
   * @param {object} res The response object.
   * @param {Function} next The next middleware function.
   * @returns {void} If the user is not logged in we will return without creating a snippet.
   */
  async createPost (req, res, next) {
    try {
      const { snippet } = req.body

      const author = `${req.session.user.fname} ${req.session.user.lname}`
      const authorID = req.session.user.id

      await SnippetModel.create({
        snippet, author, authorID
      })

      req.session.flash = { type: 'success', text: 'The snippet was was created successfully.' }
      res.redirect('/snippet/')
    } catch (error) {
      req.session.flash = { type: 'failed', text: error.message }
      res.status(404)
      res.redirect('/snippet/create')
    }
  }

  /**
   * Renders the view to update the snippet.
   *
   * @param {object} req The request object.
   * @param {object} res The response object.
   * @param {Function} next The next
   */
  update (req, res, next) {
    res.render('snippets/update', { viewData: req.doc })
  }

  /**
   * Updates the post.
   *
   * @param {object} req The request object.
   * @param {object} res The response object.
   * @param {Function} next The next
   * @returns {void} Returns if there is no logged in user.
   */
  async updatePost (req, res, next) {
    try {
      const { updatedSnippet } = req.body

      // Updates the snippet.
      const updatedPost = await SnippetModel.findByIdAndUpdate(req.doc.id, { snippet: updatedSnippet })

      if (!updatedPost) throw new Error('Document not found or update failed')

      req.session.flash = { type: 'success', text: 'The snippet has been updated.' }
      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'failed', text: 'You have to be the owner of the snippet to edit it!' }
      next(error)
    }
  }

  /**
   * Renders the page where we can choose to delete a snippet.
   *
   * @param {object} req The request object.
   * @param {object} res The response object.
   * @param {Function} next The next
   */
  delete (req, res, next) {
    res.render('snippets/delete', { viewData: req.doc })
  }

  /**
   * Deletes a snippet from the database.
   *
   * @param {object} req The request object.
   * @param {object} res The response object.
   * @param {Function} next The next
   */
  async deletePost (req, res, next) {
    try {
      await SnippetModel.findByIdAndDelete(req.doc.id)
      req.session.flash = { type: 'success', text: 'The snippet has been deleted successfully.' }
      res.redirect('/snippet')
    } catch (error) {
      next(error)
    }
  }
}
