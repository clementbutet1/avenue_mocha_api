require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const path = require("path");
const favicon = require("serve-favicon");
const session = require("express-session");
const secureCookieMiddleware = require('secure-cookie').middleware;

const bodyParser = require("body-parser");

// Routes
const userRoute = require("./routes/users");
const coffeesRoute = require("./routes/coffees");

// Rate Limiting
const limit = rateLimit({
  max: 250, // max requests
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: "Too many requests", // message to send
});

app.disable("x-powered-by");
// Data Sanitization against XSS attacks
app.use(xss());
// Helmet
app.use(helmet());

// Data Sanitization against NoSQL Injection Attacks
app.use(mongoSanitize());
// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Body limit is 10 kilobytes & Middle-ware JSON parse
let depth_limit = 10;
app.use(express.json({ limit: "100kb" }));

let limit_depth = (obj, current_depth, limit) => {
  for (const key in obj) {
    if (obj[key] instanceof Object) {
      if (current_depth + 1 === limit) {
        obj[key] = "[object Object]";
      } else {
        limit_depth(obj[key], current_depth + 1, limit);
      }
    }
  }
};

// MIDDLEWARE
app.use(bodyParser.json({ limit: "100mb" }));
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    limit: "100mb",
    extended: true,
  })
);
// Cookie Parser
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.URL_FRONT,
    credentials: true,
  })
);

app.use(secureCookieMiddleware({
  sameSite: 'none', // Utiliser 'none' pour les cookies cross-domain
  secure: true // Utiliser HTTPS pour les cookies sécurisés
}));

app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV,
    },
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(__dirname + "/public/favicon.ico"));
app.get("/", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.status(200).sendFile(path.join(__dirname + "/views/start.html"));
});

// Essential routes for apis
app.use("/api/user", userRoute, limit);
app.use("/api/coffees", coffeesRoute, limit);

app.use(function (err, req, res, next) {
  console.log(err);
  next(err);
});

app.use(function (req, res) {
  res.status(404).sendFile(path.join(__dirname + "/views/404.html"));
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is live"))
  .catch((err) => console.log(err));

// Start server
app.listen(process.env.PORT);
console.log(`Server running on https://localhost:${process.env.PORT}`);
