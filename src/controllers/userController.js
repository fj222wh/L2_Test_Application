/**
 * The user controller.
 *
 * @author Filippa Johansson
 * @version 1.0.0
 */

import { SnippetModel } from '../models/SnippetModel.js'
import { UserModel } from '../models/UserModel.js'

/**
 * The user controller.
 */
export class UserController {
  /**
   * A function to authorize a user.
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
   * Renders the snippets index page.
   *
   * @param {object} req The request object.
   * @param {object} res The response object.
   * @param {Function} next The next middleware function.
   */
  async index (req, res, next) {
    try {
      const viewData = {
        data: (await SnippetModel.find({ authorID: req.session.user.id }))
          .map(snippetDoc => ({
            ...snippetDoc.toObject(),
            dateCreatedAt: new Date(snippetDoc.createdAt).toLocaleDateString('sv-SE'),
            dateUpdatedAt: new Date(snippetDoc.updatedAt).toLocaleDateString('sv-SE'),
            timeCreatedAt: new Date(snippetDoc.createdAt).toLocaleTimeString('sv-SE'),
            timeUpdatedAt: new Date(snippetDoc.updatedAt).toLocaleTimeString('sv-SE')
          }))
      }

      res.render('user/index', { viewData })
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
  login (req, res, next) {
    res.render('user/login')
  }

  /**
   * Renders the snippets form to create new snippets.
   *
   * @param {object} req The request object.
   * @param {object} res The response object.
   * @param {Function} next The next middleware function.
   */
  async loginPost (req, res, next) {
    try {
      const { username, password } = req.body
      const user = await UserModel.authenticate(username, password)

      req.session.regenerate((err) => {
        if (err) {
          req.session.flash = { type: 'failed', text: 'Failed to regenerate session.' }
          return res.redirect('/user/login')
        }

        req.session.user = {
          username: user.username,
          fname: user.fname,
          lname: user.lname,
          id: user.id
        }
        req.session.flash = { type: 'success', text: 'Welcome you\'re now logged in!' }
        return res.redirect('/user')
      })
    } catch (error) {
      req.session.flash = { type: 'failed', text: 'Authentication failed.' }
      res.redirect('/user/login')
    }
  }

  /**
   * Destroy the session and log out the user.
   *
   * @param {object} req The request object.
   * @param {object} res The response object.
   * @param {Function} next The next middleware function.
   */
  logout (req, res, next) {
    req.session.destroy()
    res.redirect('../')
  }

  /**
   * Renders the snippets form to create new snippets.
   *
   * @param {object} req The request object.
   * @param {object} res The response object.
   * @param {Function} next The next middleware function.
   */
  register (req, res, next) {
    res.render('user/register')
  }

  /**
   * Register the user.
   *
   * @param {object} req The request object.
   * @param {object} res The response object.
   * @param {Function} next The next middleware function.
   */
  async registerPost (req, res, next) {
    try {
      const { username, password, fname, lname } = req.body
      // We save the users information and send it to the model to encrypt it and save it to the database.
      await UserModel.create({
        username, password, fname, lname
      })

      req.session.flash = { type: 'success', text: 'The user was was created successfully. Login now.' }
      res.redirect('/user/login')
    } catch (error) {
      req.session.flash = { type: 'failed', text: 'Registration failed. ' + error.message }
      res.redirect('/user/register')
    }
  }
}
