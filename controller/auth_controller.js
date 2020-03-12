var user = require("./../model/user_model");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
var { send_email } = require("./../utility/email");

module.exports.loginuser = async (req, res) => {
    try {
        // console.log(req.body);
        if (req.body.email == undefined || req.body.password == undefined) {
            res.status(401).send("ENTER PROPERLY !!!");
        }
        else {
            let result = await user.findOne({ email: req.body.email });
            if (!result) {
                res.status(401).send("Please enter a valid email id");
                return;
            }

            let pass = result.password;

            var proof = await bcrypt.compare(req.body.password, pass);
            if (!proof) {
                res.status(201).send("Password is wrong");
                return;
            }

            var token = jwt.sign({ "id": result._id }, "div123", { expiresIn: "10d" });
            res.cookie("jwt", token, { httpOnly: true });
            res.status(200).send({
                "status": "User Logged In",
                "token": token
            });
        }

    }
    catch (err) {
        res.send(err);
    }
}

module.exports.logoutuser = async (req, res) => {
    res.cookie("jwt", "logged out", {
        expires: new Date(Date.now() + 1000),
        httpOnly: true
    })
    res.status(201).json({
        status: "User Logged Out"
    })
}

module.exports.signupuser = async (req, res) => {
    //   1. check whether emailid and password is entered
    //   2. create user
    //   3. create token using jsonwebtoken
    //   4. response to user

    if (req.body.email == undefined || req.body.password == undefined) {
        res.status(401).send("ENTER PROPERLY !!!");
    }

    try {
        // console.log(req.body);
        var newobj = await user.create(req.body);

        var token = jwt.sign({ "id": newobj._id }, "div123", { expiresIn: "10d" });
        res.cookie("jwt", token, { httpOnly: true });
        res.status(200).send("You Signedup Successfully");
    }
    catch (err) {
        res.status(401).send(err);
    };

}

module.exports.protectroute = async (req, res, next) => {
    try {
        // 1. chk whether the token is valid
        // console.log(req.headers.authorization);
        var token
        // if (req.headers.authorization) {
        //      token = req.headers.authorization.split(" ")[1];
        //     // console.log(token);
        //}
        if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }
        else {
            return res.end("User is not logged in");
        }
        // 2. decode the token using secret code
        let decode = jwt.verify(token, "div123");
        if (!decode) {
            return res.end("Pls enter valid details");
        }
        // console.log(decode);

        // 3. verifying the user
        var temp_user = await user.findById(decode.id);
        // console.log(temp_user);
        if (!temp_user) {
            return res.send("User is not signed up");
        }
        res.locals.user = temp_user;
        req.user = temp_user;
        req.headers.role = temp_user.role;
        next();
    }
    catch (err) {
        res.status(401).send(err);
    }
};

module.exports.isloggedin = async (req, res, next) => {
    try {
        var token;
        // 1. chk whether the token is valid
        // console.log(req.headers.authorization);
        if (req.cookies.jwt) {
            token = req.cookies.jwt;
            // console.log(token);

            // 2. decode the token using secret code
            let decode = jwt.verify(token, "div123");
            if (!decode) {
                // res.end("Pls enter valid details");
                return next();
            }
            // console.log(decode);

            // 3. verifying the user
            var temp_user = await user.findById(decode.id);
            // console.log(temp_user);
            if (!temp_user) {
                // res.send("User is not signed up");
                return next();
            }

            req.headers.role = temp_user.role;
            res.locals.temp_user = temp_user;
            return next();
        }
        else {
            next();
        }

    }
    catch (err) {
        res.status(401).send(err);
    }
};

//hardcore authorize function 
// module.exports.authorize = (req, res, next) => {

//     if (req.headers.role ==="owner" || req.headers.role === "admin") {
//         next();
//     }
//     else {
//         res.send("You dont have access for this");
//     }
// }

//dynamic authorize function
module.exports.authorize = function (...args) {
    let roles = args;
    return function (req, res, next) {
        if (roles.includes(req.headers.role)) {
            next();
        }
        else {
            res.end("You dont have access for this");
        }
    }
}

module.exports.forgetpassword = async (req, res) => {
    // 1. get email id from req.body
    var email = req.body.email;
    if (!email) {
        res.end("Please enter the email id");
    }
    // console.log(email);

    // 2. chk emailid existance using findone
    var chk = await user.findOne({ email: email });
    if (!chk) {
        res.end("You are not signed up yet");
    }

    // 3. generate a random token using crypto
    let token = chk.create_reset_token();
    await chk.save({ validatebeforesave: false });
    // console.log(token);

    // 4. send email to the user having the random token using mailtrap
    try {
        send_email({
            to: chk.email,
            subject: "token to reset password",
            text: "Go to http://localhost:3000/resetpassword and enter the token \n Token is : " + token 
        });
        res.send("Token was sent successfully to you email address");
    } catch (err) {
        res.status(401).send(err);
    }

}

module.exports.resetpassword = async (req, res) => {
    // 1. get token from user
    // console.log(req.body.token);
    // console.log(req.body.password);
    var person = await user.findOne({ reset_token: req.body.token });
    if (!person) {
        res.end("Token is invalid");
    }
    // console.log(req.headers);
    // console.log(req.body);
    // 2. update password
    var pass = req.body.password;
    // console.log(pass);
    person.password = pass;
    person.reset_token = undefined;
    await person.save({ validatebeforesave: false });
    res.status(201).send("Password changes succesfully");

}

module.exports.changepass = async (req, res) => {
    try {
        // console.log(req.body);
        var token;
        if (req.cookies.jwt) {
            token = req.cookies.jwt;
            // console.log(token);
            let decode = jwt.verify(token, "div123");
            if (!decode) {
                return res.end("Pls enter valid details");
            }
            let result = await user.findById(decode.id);
            // console.log(result);

            let pass = result.password;
            var proof = await bcrypt.compare(req.body.oldpass, pass);

            if (!proof) {
                res.status(201).send("Password is wrong");
                return;
            }
            
            result.password = req.body.newpass;
            result.confirm_pass = req.body.confirm_pass;
            var temp = await result.save();
            res.status(201).send("Password changes succesfully");

        }
        else {
            return res.status(201).send("You are not logged in");
        }
    } catch (err) {
        res.status(401).send(err);
    }
}
