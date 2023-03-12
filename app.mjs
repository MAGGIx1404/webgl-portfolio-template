import express from "express";
import path from "path";
import compression from "compression";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import UAParser from "ua-parser-js";
// --------------------------------------------------------------------------------------------

// ===============================
dotenv.config();

// ===============================
const port = process.env.PORT || 3001;
const __dirname = path.resolve();
const app = express();

// ===============================
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// ===============================
// Middlewares
const mode = process.env.NODE_ENV === "development" ? "dev" : "tiny";
app.use(morgan(mode));
app.use(helmet());
app.use(
  compression({
    level: 9
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// Global locals
app.use((req, res, next) => {
  const ua = UAParser(req.headers["user-agent"]);
  res.locals.isDesktop = ua.device.type === undefined;
  res.locals.isPhone = ua.device.type === "mobile";
  res.locals.isTablet = ua.device.type === "tablet";
  next();
});

// ===============================
app.get("/", (req, res) => {
  res.render("pages/home", {
    title: "Home"
  });
});

app.get("/about", (req, res) => {
  res.render("pages/about", {
    title: "About"
  });
});

// ===============================
app.get("/works/:name", (req, res) => {
  const name = req.params.name;
  res.render(`pages/works/${name}`, {
    title: `${name}`
  });
});

// ------------------------------------------
app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
