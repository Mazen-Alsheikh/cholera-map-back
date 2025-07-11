const db = require("../connect");
const bcrypt = require('bcrypt');

const registerServices = function (req, res) {
    const {email, password} = req.body;

    if (email && password) {

        const query = "SELECT * FROM cholera.users WHERE email = ?";

        db.query(query, email, async (err, result) => {

            if (err) return res.status(500).json({error: "Database Error", detials: err});

            if (result.length > 0) {

                return res.status(500).json({message: "The user is already exist"});

            } else {

                try {

                    const hashedPassword = await bcrypt.hash(password, 10);

                    const newUser = "INSERT INTO cholera.users(email, password) VALUES(?, ?)";

                    db.query(newUser, [email, hashedPassword], (err, result) => {

                        if (err) return res.status(500).json({error: "Insert Failed", detials: err});

                        return res.status(200).json({message: "Your account has been created successfully"});

                    });

                } catch (error) {

                    return res.status(500).json({error: "Encryption  Failed", detials: error});

                }

            }

        });
        
    } else {
        return res.status(500).json("Email or passowrd is missing");
    }
}

module.exports = registerServices;