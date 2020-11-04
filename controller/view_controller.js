const planmodel = require("./../model/plan_model");
module.exports.viewhomepage = async (req, res) => {
    //list all plans from db
    let allplan = await planmodel.find();
    allplan = allplan.slice(0, 3);
    // console.log(allplan);
    res.status(201).render("home.pug", {
        plans: allplan,
        x: 3
    });
}

module.exports.viewbasepage = (req, res) => {
    res.status(201).render("base.pug", {
        title: "base page"
    })
}

module.exports.viewloginpage = (req, res) => {
    res.status(201).render("login.pug", {
        title: "login page"
    })
}

module.exports.viewplanpage = async (req, res) => {
    //list all plans from db
    let allplan = await planmodel.find();
    res.status(201).render("plans_page.pug", {
        plans: allplan,
        x: 4
    })
}

module.exports.view_edit_plan_page = async (req, res) => {
    let plan = await planmodel.findById(req.params.id);
    res.status(201).render("edit_plan.pug", {
        plan: plan,
        title: "Edit Plan Page"
    })
}

module.exports.viewaddPlan = async (req, res) => {
    res.status(201).render("add_plan.pug",{
    })
}

module.exports.viewsignuppage = async (req, res) => {
    res.status(201).render("signup.pug", {
    })
}

module.exports.viewforgetpage = async (req, res) => {
    res.status(201).render("forget.pug", {
    })
}

module.exports.viewresetpage = async (req, res) => {
    res.status(201).render("reset.pug", {
    })
}

module.exports.viewmepage = async (req, res) => {
    res.status(201).render("account.pug", {
    });
}

module.exports.viewcitiespage = async (req, res) => {
    res.status(201).render("cities.pug");
}

module.exports.viewreviewpage = async (req, res) => {
    res.status(201).render("review.pug");
}

module.exports.viewchangepasspage = async (req, res) => {
    res.status(201).render("change_pass.pug");
}

module.exports.payment_successfulpage = (req, res) => {
    res.status(201).render("payment_successful.pug", {
        title: "Payment Successful"
    })
}

module.exports.payment_unsuccessfulpage = (req, res) => {
    res.status(201).render("payment_failed.pug", {
        title: "Payment Unsuccessful"
    })
}

module.exports.vieworderspage = (req, res) => {
    res.status(201).render("prev_order_page.pug", {
        title: "Orders Page"
    })
}

module.exports.viewwishlistpage = (req, res) => {
    res.status(201).render("wishlist_page.pug", {
        title: "Wishlist Page"
    })
}

