var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var crypto = require('crypto');
const mysql = require('../conf');   

module.exports = function (app) {     

    app.use(passport.initialize());
    app.use(passport.session());
       
    passport.serializeUser(function (user, done) {
        var userInfo = user[0];
        delete userInfo.password;
        done(null, userInfo);
    });
    
    passport.deserializeUser(async function (userInfo, done) {  
        done(null, userInfo);
    });

    passport.use(new LocalStrategy(
        {
            usernameField: 'emailaddress',
            passwordField: 'password'
        },
        async function (email, password, done) {
            console.log('LocalStrategy', email, password);
            param = { email : email };
            const user = await mysql.sqlResult('users', 'selectUserList', param);
            
            if (user.length > 0) {
                let hashPassword = crypto.createHash('sha512').update(password).digest('hex');
                if(hashPassword === user[0].password){
                    return done(null, user, {
                        message: 'Welcome.'
                    });
                } else {
                    return done(null, false, {
                        message: 'Password is not correct.'
                    });
                }
            } else {
                return done(null, false, {
                    message: 'There is no email.'
                });
            }
        }
    ));

    return passport;

};