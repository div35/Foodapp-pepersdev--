const mongoose = require("mongoose");
const { db } = require("./../credential")

//request
mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}).then(function (db) {
  // console.log(db);
  console.log("PlanDb connected");
})
  .catch(function (err) {
    console.log(err);
  });

//database
//error handling
//schema => set of rules
const planschema = new mongoose.Schema({
  //type
  name: { type: String, required: true },
  price: { type: String, required: true },
  items: { type: String, required: true },
  serving: { type: Number, required: true }
});

//models
//collection
const planmodel = mongoose.model("planmodel", planschema);

module.exports = planmodel;