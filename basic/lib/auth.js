module.exports = {
    loggedIn : function(req, res, next) {
        if(req.user) {
            next();
        } else {
            res.redirect('/sign_in');
        }
    }
};