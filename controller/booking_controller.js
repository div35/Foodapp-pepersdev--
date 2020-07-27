const stripe = require("stripe")('sk_test_bO2mQQh94H6LRAb7Ftom1T8q00bPHGR5Jq');

const plan = require("./../model/plan_model");

module.exports.getcheckout = async (req, res) => {
    try {
        var id = req.params["id"];

        const curr_plan = await plan.findById(id);
        // console.log(curr_plan);
        let price = Math.trunc(curr_plan.price / 70);
        // checkout season
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                name: curr_plan.name,
                amount: price * 100,
                currency: 'usd',
                quantity: 1,
            }],
            success_url: 'http://localhost:3000/success/' + id,
            cancel_url: 'http://localhost:3000/failed',
        });

        // response
        res.status(201).json({
            status: "Payment Successful for " + curr_plan.name,
            session
        })
    }
    catch (err) {
        res.status(401).send(err);
    }
}