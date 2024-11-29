const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if(!authHeader?.startsWith('Bearer ')){
       return res.status(401); 
    }

    const token = authHeader.split(' ')[1];
    console.log("Token: ", token);

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err){
                return res.status(403).send("Invalid token");
            }

            console.log("inside jwt");

            req.email = decoded.UserInfo.email;
            req.role = decoded.UserInfo.role;

            next();
        }
    )
}

module.exports = { verifyJWT };