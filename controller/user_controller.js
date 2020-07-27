var user = require("./../model/user_model");
var plan = require("./../model/plan_model")
module.exports.getalluser = async function (req, res) {
    var queryobj = { ...req.query };
    let excludefromquery = ["fields", "limit", "page", "sort"];
    for (let i = 0; i < excludefromquery.length; i++) {
        delete queryobj[excludefromquery[i]];
    }
    try {
        let result = await user.find(queryobj);
        res.status(200).json({
            result: result
        })
    }
    catch (err) {
        res.status(401).send(err);
    }
}
module.exports.getuser = async function (req, res) {

    try {
        var id = req.params.id;
        var result = await user.findById(id);

        res.status(200).json({
            ans: result
        });
    }
    catch (err) {
        res.status(401).send(err);
    }
};

module.exports.patchuser = async function (req, res) {
    try {
        var id = req.user["_id"] || req.params.id;
        // console.log(req.body);
        var result = await user.findByIdAndUpdate(id, req.body, { new: true });
        // console.log(result);

        res.status(200).json({
            status: "Update is succesful",
            result: result
        });
    }
    catch (err) {
        res.status(401).send(err);
    }
};

module.exports.addToOrder = async function (req, res) {
    try {
        var plan_id = req.body.planId;
        var temp_plan = await plan.findById(plan_id)
        var user_detail = req.user;
        var o_list = user_detail.wish_list;
        
        o_list.push(temp_plan)
        var result = await user.findByIdAndUpdate(user_detail._id, { "prevOrder": o_list }, { new: true });
        res.status(200).send("This Product is Successfully added to your OrdersList")
    }
    catch (err) {
        res.status(401).send(err);
    }
}


module.exports.wishlist = async function (req, res) {
    try {
        // console.log(req);
        var plan_id = req.body.planId;
        var temp_plan = await plan.findById(plan_id)
        var user_detail = req.user;
        // console.log(temp_plan)
        var w_list = user_detail.wish_list;
        // console.log(w_list)
        for (i = 0; i < w_list.length; i++) {
            if (w_list[i].name === temp_plan.name) {
                res.status(200).send("This Product is Already added in your Wishlist")
                return;
            }
        }
        w_list.push(temp_plan)
        // console.log(w_list)
        var result = await user.findByIdAndUpdate(user_detail._id, { "wish_list": w_list }, { new: true });
        res.status(200).send("This Product is Successfully added to your Wishlist")
    }
    catch (err) {
        res.status(401).send(err);
    }
}

module.exports.unwishlist = async function (req, res) {
    try {
        // console.log(req);
        var plan_id = req.body.planId;
        var temp_plan = await plan.findById(plan_id)
        var user_detail = req.user;
        // console.log(temp_plan)
        var w_list = user_detail.wish_list;
        // console.log(w_list)
        w_list = w_list.filter(elem => {
            return elem.name != temp_plan.name
        })
        // console.log(w_list)
        var result = await user.findByIdAndUpdate(user_detail._id, { "wish_list": w_list }, { new: true });
        res.status(200).send("This Product is Successfully delete from your Wishlist")
    }
    catch (err) {
        res.status(401).send(err);
    }
}
