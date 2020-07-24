var user = require("./../model/user_model");
module.exports.getalluser = async function (req , res) {
    var queryobj = {... req.query};
    let excludefromquery = ["fields" , "limit" , "page" , "sort"];
    for (let i=0;i<excludefromquery.length;i++){
        delete queryobj[excludefromquery[i]];
    }
    try{
        let result = await user.find(queryobj);
        res.status(200).json({
            result : result
        })
    }
    catch(err){
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

// module.exports.postuser = async function (req, res) {
//     try {
//         console.log(req.body);
//         await user.create(req.body);
//         res.status(200).send("DONE");
//     }
//     catch (err) {
//         res.status(401).send(err);
//     };
// };

module.exports.patchuser = async function (req, res) {
    try {
        var id = req.user["_id"]||req.params.id;
        // console.log(req.body);
        var result = await user.findByIdAndUpdate(id , req.body , {new:true});
        // console.log(result);
        
        res.status(200).json({
            status :"Update is succesful" , 
            result : result
        });
    }
    catch (err) {
        res.status(401).send(err);
    }
};