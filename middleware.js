// redirect to login page if user is not logged in
const redirectToLogin = (req, res, next) => {
    if (!req.session.userId) {
      res.clearCookie('connect.sid')
      res.redirect('/login')
    } else {
      next()
    }
  }
  
  
// redirect to home page if user is logged in
const redirectToHome = (req, res, next) => {
    if(req.session.userId) {
        res.redirect('/')
    } else {
        next()
    }
}

  
module.exports = { redirectToLogin, redirectToHome }