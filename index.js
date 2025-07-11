const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const registerServices = require("./services/registerServices");
const loginServices = require("./services/loginServices");
const usersControl = require("./services/usersControl");
const statsServices = require("./services/statsServices");
const getStats = require("./services/getStats");
const getStates = require("./services/getStates");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {

    res.send("Login Page");

});

app.post("/api/register", registerServices);
app.post("/api/login", loginServices);
app.get("/api/users", usersControl.getUsers);
app.get("/api/user/:id", usersControl.getUser);
app.get("/api/profile/:id", usersControl.getUser);
app.post("/api/adduser", usersControl.addUser);
app.post("/api/updateuser/:id", usersControl.updateUser);
app.post("/api/deleteUser/:id", usersControl.deleteUser);
app.get("/api/stats", getStats);
app.get("/api/states", getStates);
app.post("/api/states/update", statsServices.updateState);

const port = process.env.SERVER_PORT;

app.listen(port, ()=> {
    console.log(`Server is running in the port ${port}`);
});