const mongoose = require("mongoose");
const db = "mongodb+srv://admin:123abc@cluster0-fm3f2.mongodb.net/test?retryWrites=true&w=majority";
//request
mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

//database
//error handling
//schema => set of rules
const planschema = new mongoose.Schema({
    //type
    name: { type: String, required: true },
    price: { type: String, required: true },
    avgprice: { type: String, required: true }
});

//models
//collection
const planmodel = mongoose.model("planmodel", planschema);

module.exports = planmodel;