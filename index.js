const server = require("./app");
const port = process.env.PORT || 3000;

server.listen(port, function () {
    console.log("Server is started");
})