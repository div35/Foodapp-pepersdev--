const stripe = require("stripe")('sk_test_bO2mQQh94H6LRAb7Ftom1T8q00bPHGR5Jq');

const plan = require("./../model/plan_model");

module.exports.getcheckout = async (req, res) => {
    var id = req.params["id"];

    const curr_plan = await plan.findById(id);
    // console.log(curr_plan);

    // checkout season
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            name: curr_plan.name,
            amount: curr_plan.price,
            currency: 'usd',
            quantity: 1,
        }],
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/failed',
    });

    // response
    res.status(201).json({
        status: "Payment Successful for " + curr_plan.name,
        session
    })
}