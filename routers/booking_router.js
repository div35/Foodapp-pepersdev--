const express = require("express");
var{protectroute} = require("./../controller/auth_controller");
var{getcheckout} = require("./../controller/booking_controller");

let bookingrouter = express.Router();
bookingrouter.route("/checkout-session/:id").get(protectroute , getcheckout);

module.exports = bookingrouter;
