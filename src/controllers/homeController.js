/**
 * The home controller.
 *
 * @author Filippa Johansson
 * @version 1.0.0
 */

/**
 * The home controller.
 */
export class HomeController {
  /**
   * Redirects to the home page.
   *
   * @param {object} req The request object.
   * @param {object} res The response object.
   * @param {Function} next The next middleware function.
   */
  index (req, res, next) {
    res.render('home/index')
  }
}
