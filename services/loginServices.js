const db = require("../connect");
const bcrypt = require('bcrypt');

const loginServices = function (req, res) {

    const {email, password} = req.body;

    if (email && password) {

        const query = "SELECT * FROM railway.users WHERE email = ?";

        db.query(query, email, async (err, result) => {

            if (err) return res.status(500).json(err);

            if (result.length === 0 ) return res.status(401).json({message: "Email or password is not correct"});

            const user = result[0];

            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                return res.status(200).json({
                    success: true, 
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                });

            } else {
                return res.status(401).json({success: false, message: "Email or password is not correct"});
            }
            
        });
        
    } else {

        res.status(401).json({message: `Type your email and password`});
    };

}

module.exports = loginServices;