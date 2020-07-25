var express = require("express");
var { loginuser, logoutuser, signupuser, forgetpassword, resetpassword, protectroute, changepass, authorize } = require("./../controller/auth_controller");
var { getuser, patchuser, getalluser, wishlist , unwishlist  } = require("./../controller/user_controller");
// server.route("/api/user").post(postuser);
// server.route("/api/user/:id").get(getuser).patch(patchuser);
let userrouter = express.Router();
userrouter.route("/getalluser").get(protectroute, authorize("admin"), getalluser);
userrouter.route("/signup").post(signupuser);
userrouter.route("/login").post(loginuser);
userrouter.route("/logout").get(logoutuser);
userrouter.route("/forgetpassword").post(forgetpassword);
userrouter.route("/resetpassword").patch(resetpassword);
userrouter.route("/changepass").patch(protectroute, changepass);
userrouter.route("/updateuser").patch(protectroute, patchuser);
userrouter.route("/wishlist").patch(protectroute, wishlist);
userrouter.route("/unwishlist").patch(protectroute, unwishlist);
userrouter.route("/:id").get(getuser).patch(patchuser);

module.exports = userrouter;
