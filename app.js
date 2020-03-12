const express = require("express");
const helmet = require("helmet");
const ratelimit = require("express-rate-limit");
const sanitize = require("express-mongo-sanitize")
const userrouter = require("./routers/user_router");
const planrouter = require("./routers/plan_router");
const viewrouter = require("./routers/view_router");
const bookingrouter = require("./routers/booking_router");
const server = express();
const cookieParser = require("cookie-parser");

server.use(express.json());
server.use(express.static("public"));

const limiter = ratelimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to some requests per windowMs
});

server.use(express.urlencoded({extended : true}));

//  apply to all requests
server.use(limiter);
server.use(helmet());
server.use(sanitize());
server.use(cookieParser(),(req , res , next)=>{
    // console.log(req.cookies.jwt);
    next();
})
//view engine (we are here working with pug files)
server.set("view engine", "pug");
server.set("views", "templates");

//middleware
server.use("/api/plan", planrouter);
server.use("/api/user", userrouter);
server.use("/api/bookings", bookingrouter);
server.use("" , viewrouter);

module.exports = server;