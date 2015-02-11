var express = require('express');
var session = require('express-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var port = 9999;

var app = express();

app.use(session({secret: 'iLOVEash'}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
	clientID: '619586804842026',
	clientSecret: '1bf3cb44dbe6d43714981d63049e2572',
	callbackURL: 'http://localhost:9999/auth/facebook/callback'
}, function(token, refreshToken, profile, done) {
	return done(null, profile);
}));

var isAuthed = function(req, res, next) {
	if(!req.isAuthenticated()) {
		return res.redirect('/login.html');
	}
	next();
};

// GETs - Auth Endpoints
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/me',
	failureRedirect: '/login.html'
}));

// SERIALIZEations
passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(object, done) {
	done(null, object);
});

// GETs - Viewer Endpoint
app.get('/me', isAuthed, function(req, res) {
	return res.json(req.user);
});



app.listen(port, function() {
	console.log("You're on port " + port);
});