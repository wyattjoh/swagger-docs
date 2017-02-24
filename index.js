const express = require('express');
const passport = require('passport');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);
const GitHubStrategy = require('passport-github').Strategy;
const github = require('octonode');
const morgan = require('morgan');
const querystring = require('querystring');

const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(morgan('tiny'));
app.use(express.static('public'));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.ROOT_URL}/auth/github/callback`,
    scope: ['repo']
  }, (accessToken, refreshToken, profile, done) => {
    done(null, {accessToken, profile});
  }
));

passport.serializeUser((user, done) => { done(null, user); });

passport.deserializeUser((user, done) => { done(null, user); });

let sess = {
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  store: new RedisStore({client}),
  cookie: {}
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }

    res.redirect('/');
  });
});
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', {
  failureRedirect: '/login'
}), (req, res) => {
  res.redirect('/');
});

app.use((req, res, next) => {
  if (req.session && req.session.redirect) {
    let redirect = req.session.redirect;
    delete req.session.redirect;
    res.redirect(redirect);
    return;
  }

  if (req.user) {
    req.client = github.client(req.user.accessToken);
  }

  next();
});

app.get('/', (req, res) => {
  let ctx = {user: req.user};

  if (req.session.repos) {
    ctx.repos = req.session.repos;

    res.render('pages/index', ctx);
  } else if (ctx.user) {
    req.client.me().repos({
      per_page: 100
    }, (err, data) => {
      if (err) {
        return next(err);
      }

      ctx.repos = data;
      req.session.repos = data;

      res.render('pages/index', ctx);
    });
  } else {
    res.render('pages/index', ctx);
  }
});

app.get('/reload', (req, res) => {
  delete req.session.repos;
  res.redirect('/');
});

app.use((req, res, next) => {
  if (!req.user) {
    req.session.redirect = req.originalUrl;
    res.redirect('/auth/github');
    return;
  }

  next();
});

app.get('/swagger', (req, res, next) => {
  req.client
    .repo(req.query.repo)
    .contents(req.query.filename, (err, data) => {
      if (err) {
        return next(err);
      }

      res.redirect(302, data.download_url);
    });
});

app.get('/docs', (req, res) => {
  res.render('pages/docs', {
    doc: '/swagger?' + querystring.stringify({
      repo: req.query.repo,
      filename: req.query.filename
    }),
    host: req.query.host ? (req.query.host.length > 0 ? req.query.host : null) : null
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
