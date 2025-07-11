const db = require("../connect");
const bcrypt = require('bcrypt');
const validator = require("validator");

exports.getUsers = function (req, res) {

    db.query("SELECT * FROM cholera.users", (err, result) => {

        if (err) return res.status(500).json({error: "Something went wrong", detials: err, success: false});

        if (result.length === 0) return res.status(404).json({error: "No user found", success: false});

        return res.status(200).json({
            message: "The users data have been get",
            success: true,
            users: result
        });

    });
    
};

exports.profile = function (req, res) {

    const id = req.params.id;
  
    db.query("SELECT * FROM cholera.users WHERE id = ?", id, (err, result) => {
        if (err) return res.status(500).json({error: "Error: Try again", success: false, detials: err});
        if (result.length === 0) return res.status(404).json({error: "The user is not exist", success: false});
        const user = result[0];
        res.status(201).json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    });
};

exports.getUser = function (req, res) {

    const id = req.params.id;
  
    db.query("SELECT * FROM cholera.users WHERE id = ?", id, (err, result) => {
        if (err) return res.status(500).json({error: "Error: Try again", success: false, detials: err});
        if (result.length === 0) return res.status(404).json({error: "The user is not exist", success: false});
        const user = result[0];
        res.status(201).json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    });
};

exports.addUser = function (req, res) {
    
    const {email, password} = req.body;

    if (!email || !password) return res.status(400).json({error: "The email and passowrd are required"});

    if (!validator.isEmail(email)) return res.status(400).json({error: "The email is not valid"});

    if (password.length < 6) return res.status(400).json({error: "The passowrd must be at least 6 characters"});

    db.query("SELECT * FROM cholera.users WHERE email = ?", email, async (err, result) => {

        if (err) return res.status(500).json({error: "Error: try again", detials: err});

        if (result.length > 0) return res.status(500).json({error: "The user is already exist"});

        const hasedPassowrd = await bcrypt.hash(password, 10);

        db.query("INSERT INTO cholera.users(email, password) VALUES(?, ?)", [email, hasedPassowrd], (err, result) => {

            if (err) return res.status(500).json({error: "Error: try again", detials: err});

            return res.status(201).json({
                message: "The user has been created successfully",
                id: result.insertId
            });

        });

    })

};

exports.updateUser = function (req, res) {

    const id = req.params.id;

    const {username, password} = req.body;

    if (username.length < 3) return res.status(400).json({error: "The username must be at least 3 characters"});

    db.query("SELECT * FROM cholera.users WHERE id = ?", id, async (err, result) => {

        if (err) return res.status(500).json({error: "Something went wrong: ", detials: err});

        if (result.length === 0 ) return res.status(500).json({error: "User is not exist:"});

        const user = result[0];
        const newUsername = username;
        const newPassword = await bcrypt.hash(password, 10);
        
        db.query("UPDATE cholera.users SET username = ?, password = ? WHERE id = ?", [newUsername, newPassword, id], (err, result) => {

            if (err) return res.status(500).json({error: "Error: try again", detials: err});

            return res.status(200).json({message: "The user has been updated", success: true});
            
        });
    });
};

exports.deleteUser = function (req, res) {
    const id = req.params.id;

    db.query("SELECT id FROM cholera.users WHERE id = ?", id, (err, result) => {
        if (err) return res.status(500).json({error: "Something went wrong", detials: err});

        if (result.length > 0) {

            db.query("DELETE FROM cholera.users WHERE id = ?", id, (err, result) => {

                if (err) return res.status(500).json({error: "Something went wrong", detials: err});

                return res.status(200).json({message: "The user has been deleted"});

            });
        } else {

            return res.status(500).json({error: "The user is not exist"});
        }
    });
};