const express = require("express");
const helmet = require("helmet"); // Middelware (Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!)
const ratelimit = require("express-rate-limit"); // Middelware (Basic rate-limiting middleware for Express. Use to limit repeated requests to public APIs and/or endpoints such as password reset.)
const sanitize = require("express-mongo-sanitize"); //Middelware (Object keys starting with a $ or containing a . are reserved for use by MongoDB as operators. Without this sanitization, malicious users could send an object containing a $ operator, or including a ., which could change the context of a database operation. Most notorious is the $where operator, which can execute arbitrary JavaScript on the database.)
const cookieParser = require("cookie-parser"); //Middleware (cookie-parser is a middleware which parses cookies attached to the client request object.)
const userrouter = require("./routers/user_router");
const planrouter = require("./routers/plan_router");
const viewrouter = require("./routers/view_router");
const bookingrouter = require("./routers/booking_router");
const cors = require('cors')

const server = express(); //Server is ready

server.use(express.json()); //method inbuilt in express to recognize the incoming Request Object as a JSON Object.
server.use(express.static("public"));
server.use(cors());
server.use('/success', express.static('public'))
server.use('/editplan', express.static('public'))

const limiter = ratelimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to some requests per windowMs
});

server.use(express.urlencoded({extended : true})); //method inbuilt in express to recognize the incoming Request Object as strings or arrays.

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