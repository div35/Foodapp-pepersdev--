const mongoose = require("mongoose");// Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
const { db } = require("./../credential")
const validator = require("validator");
const bcrypt = require("bcrypt");

//request
mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(function (db) {
    // console.log(db);
    console.log("UserDb connected");
})
    .catch(function (err) {
        console.log(err);
    });

//database
//error handling
//schema => set of rules
const userschema = new mongoose.Schema({
    //type
    name: { type: String, required: true, validate: validator.isAlpha },
    role: { type: String, enum: ["admin", "user"] },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, validate: validator.isEmail },
    password: { type: String, required: true },
    confirm_pass: {
        type: String, requird: true, validate: function () {
            return this.confirm_pass === this.password;
        }
    },
    prevOrder: [{
        name: { type: String, required: true },
        price: { type: String, required: true },
        items: { type: String, required: true },
        serving: { type: Number, required: true }
    }],
    wish_list: [{
        name: { type: String, required: true },
        price: { type: String, required: true },
        items: { type: String, required: true },
        serving: { type: Number, required: true }
    }],
    reset_token: { type: String }
});

//pre
userschema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 10);
    this.confirm_pass = undefined;
});


//models
//collection
const usermodel = mongoose.model("usermodel", userschema);

module.exports = usermodel;