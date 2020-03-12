const mongoose = require("mongoose");
const db = "mongodb+srv://admin:123abc@cluster0-fm3f2.mongodb.net/test?retryWrites=true&w=majority";
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
//request
mongoose.connect(db, {
    useNewUrlParser: true
})

//database
//error handling
//schema => set of rules
const userschema = new mongoose.Schema({
    //type
    name: { type: String, required: true, validate: validator.isAlpha },
    role: { type: String, enum: ["admin", "owner", "user"] },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, validate: validator.isEmail },
    password: { type: String, required: true },
    confirm_pass: {
        type: String, requird: true, validate: function () {
            return this.confirm_pass === this.password;
        }
    },
    reset_token: { type: String },
    expires_in: { type: Date }

});

//pre
userschema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 10);
    this.confirm_pass = undefined;
});

userschema.methods.create_reset_token = function () {
    //random number generation
    const crypto_token = crypto.randomBytes(32).toString("hex");
    //encrypt
    this.reset_token = crypto.createHash("sha256").update(crypto_token).digest("hex");
    //token expired in
    this.expires_in = Date.now() + 1000*60*60;

    return this.reset_token;
}


//models
//collection
const usermodel = mongoose.model("usermodel", userschema);

module.exports = usermodel;