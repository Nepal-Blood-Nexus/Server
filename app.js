const express = require("express");
const morgan = require("morgan");
const path = require("path");
const compression = require("compression");
const app = express();
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const AppError = require("./modules/appError");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}else{
  app.use(morgan("combined"));
}

app.use(mongoSanitize());
app.use(helmet());
app.use(xss());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 500,
  message: `Too many requests from this IP , please try again in an hour`,
});

app.use(cors());


const authRouter = require("./routes/authRoute")
const adminRouter = require("./routes/adminRoute")
const bloodRequestRouter = require("./routes/bloodRequestRoute")
const placeRouter = require("./routes/placesRoute")
const chatRouter = require("./routes/chatRoute")
const infoRouter = require('./routes/infoRouter.js')


app.use("/static", express.static(path.join(__dirname, "static")));

app.use("/api/auth",authRouter)
app.use("/api/admin",adminRouter)
app.use("/api/request",bloodRequestRouter)
app.use("/api/places",placeRouter)
app.use("/api/places",placeRouter)
app.use("/api/chat", chatRouter)
app.use("/api/info", infoRouter)





// app.all("*", (req, res, next) => {
//   return next(new AppError(`can't find ${req.originalUrl} on this server`))
// });


module.exports = app;
