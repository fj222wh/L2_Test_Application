/**
 * The start of the Express Application.
 *
 * @author Mats Loock
 * @author Filippa Johansson
 * @version 1.0.0
 */

import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import logger from 'morgan'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { router } from './routes/router.js'
import session from 'express-session'
import { sessionOptions } from './config/sessionOptions.js'
import helmet from 'helmet'

try {
  // Create the express application.
  const app = express()

  // The name of the directory of this module's path.
  const directoryFullName = dirname(fileURLToPath(import.meta.url))

  // Sets the base URL, all links are relative to this URL.
  const baseURL = process.env.BASE_URL || '/'

  // We want to use morgan for loggin the HTTP traffic.
  app.use(logger('dev'))

  // Secure app by setting HTTP response headers.
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'script-src': [
          "'self'",
          'https://cdnjs.cloudflare.com',
          "'sha256-oJSaoxKfTeYSoP/+lK/lTiApgbBssRiPrm18nPdL5QA='"
        ],
        'style-src': [
          "'self'",
          'https://cdnjs.cloudflare.com',
          'https://fonts.googleapis.com'
        ],
        'font-src': [
          "'self'",
          'https://fonts.gstatic.com'
        ],
        'connect-src': [
          "'self'",
          'https://fonts.googleapis.com',
          'https://fonts.gstatic.com'
        ]
      }
    })
  )

  // Configuration of view engine.
  app.set('view engine', 'ejs')
  app.set('views', join(directoryFullName, 'views'))
  app.use(expressLayouts)
  app.set('layout', join(directoryFullName, 'views', 'layouts', 'default'))

  app.use(express.urlencoded({ extended: false }))

  // Serve the static files
  app.use(express.static(join(directoryFullName, '..', 'public')))

  // Setup and use session middleware (https://github.com/expressjs/session)
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1) // trust first proxy
  }

  app.use(session(sessionOptions))

  app.use((req, res, next) => {
    // Flash messages - survives only a round trip.
    if (req.session.flash) {
      res.locals.flash = req.session.flash
      delete req.session.flash
    }

    // Pass the base URL to the views.
    res.locals.baseURL = baseURL

    console.log(res.locals)

    next()
  })

  // Middleware to be executed before the routes. Sets the baseURL in the locals object on the response object. Then sends us to the next middleware using next()
  app.use((req, res, next) => {
    res.locals.baseURL = baseURL
    res.locals.user = req.session.user || null

    next()
  })

  // The registered routes
  app.use('/', router)

  // Error handler
  app.use(function (err, req, res, next) {
    // If something goes wrong and the statuscode is 404, the 404.html page will be rendered on the client.
    if (err.status === 404) {
      res
        .status(404)
        // .sendFile(join(directoryFullName, 'views', 'errors', '404.html'))
        .render('errors/404')

      return
    }

    if (err.status === 403) {
      res
        .status(403)
        // .sendFile(join(directoryFullName, 'views', 'errors', '403.html'))
        .render('errors/403')

      return
    }

    // If we are in production enviroment and something goes wrong, we don't want to show all the information about the error. Instead we want to show the 500 error page.
    if (process.env.NODE_ENV === 'production') {
      res
        .status(500)
        .render('errors/500')
        // .sendFile(join(directoryFullName, 'views', 'errors', '500.html'))
      return
    }

    // If we are in development we want to show the error.
    res
      .status(err.status || 500)
      .render('errors/error', { error: err })
  })

  // Start the HTTP listening for connections.
  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
    console.log('Press Ctrl-C to terminate...')
  })
} catch (error) {
  console.error(error)
  process.exitCode = 1
}
