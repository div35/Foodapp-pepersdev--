var plan = require("./../model/plan_model");

module.exports.queryincluder = (req, res, next) => {
    req.query.sort = "price";
    req.query.filter = "plan%price";
    req.query.limit = 2;
    next();
}

module.exports.getallplan = async function (req, res) {
    try {
        // console.log(req.query);
        var queryobj = { ...req.query };
        let excludefromquery = ["filter", "fields", "limit", "page", "sort"];

        for (let i = 0; i < excludefromquery.length; i++) {
            delete queryobj[excludefromquery[i]];
        }

        var str = JSON.stringify(queryobj);
        str = str.replace(/\b(gt|gte|lt|lte)\b/g, function (match) {
            return "$" + match;
        });

        queryobj = JSON.parse(str);

        var result = plan.find(queryobj);

        //sort
        if (req.query["sort"]) {
            let args = req.query.sort.split("%").join(" ");
            result = result.sort(args);
        }

        //filter
        if (req.query.filter) {
            let args = req.query.filter.split("%").join(" ");
            result = result.select(args);
        }
        else {
            result = result.select("-__v");
        }

        //pagination
        var lim = (+req.query.limit) || 3;
        var page = (+req.query.page) || 1;

        result.skip(lim * page - lim).limit(lim);

        var result = await result;

        res.status(200).json({
            result: result
        })
    }
    catch (err) {
        res.status(400).send(err);
    }
}

module.exports.getplan = async function (req, res) {

    try {
        var id = req.params.id;
        var result = await plan.findById(id);

        res.status(200).json({
            ans: result
        });
    }

    catch (err) {
        res.status(401).send(err);
    }
};

module.exports.postplan = async function (req, res) {
    try {
        await plan.create(req.body);
        res.status(200).send("Plan Added Successfully");
    }
    catch (err) {
        res.status(401).send(err);
    };
};

module.exports.patchplan = async function (req, res) {
    try {
        var id = req.params.id;
        var result = await plan.findById(id);
        var updatep = await plan.updateOne(result, req.body);
        res.status(200).send("Update is successful");
    }
    catch (err) {
        res.status(401).send(err);
    }
};

module.exports.deleteplan = async function (req, res) {
    try {
        var id = req.body.id || req.params.id;
        var result = await plan.findByIdAndDelete(id);

        if (result) {
            res.status(200).send(result.name + " is Deleted From Database");
        }
    }
    catch (err) {
        res.status(401).send(err);
    }
}
