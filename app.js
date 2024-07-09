require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const router = require("./routers");

const app = express();

app.engine("ejs", require("express-ejs-extend"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("trust proxy", 1);
app.use(
  session({
    // cookie: { secure: true },
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: 0 }));
app.use(methodOverride("_method"));
app.use(flash());
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.message = req.flash("message");
  res.locals.status = req.flash("status");

  next();
});

// Routes
app.use(router);

// Handle Route Not Found
app.use(function (req, res, next) {
  next(new Error("Page Not Found"));
});

// Handle Error
app.use(function (error, req, res, next) {
  if (!error) {
    next();

    return;
  }

  res.render("error", { error: error.message });
});

// Start server
app.listen(5000, "127.0.0.1", function () {
  console.info("Server started on http://127.0.0.1:5000");
});
