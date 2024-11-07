const { User } = require('../config/dbConn');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async(req, res) => {
    // //jwt verification
    // const role_jwt = req.role;
    
    // console.log("role from jwt: ", role_jwt);
    // if(role_jwt != "Admin" && role_jwt != "admin"){
    //     return res.status(401).send("Unauthorized");
    // }

    const name = req.body.name;
    const email = req.body.email;
    let password = req.body.password;
    const role = req.body.role;

    if(!name || !email || !password || !role){
        return res.status(400).send("Data missing!");
    }

    const duplicateUser = await User.findOne({
        where : {email : email}
    });
    if(duplicateUser){
        return res.status(409).send("User already exists with this email address");
    }

    try{
        const hashedPwd = await bcrypt.hash(password, 10);
        password = hashedPwd;

        const newUser = await User.create({
            name,
            email,
            password,
            role
        });

        res.status(200).send("User registered successfully!");

    } catch(error){
        res.status(500).send(error);
    }
}

const usersList = async(req, res) => {
    //jwt verification
    const role_jwt = req.role;
    
    console.log("role from jwt: ", role_jwt);
    if(role_jwt != "Admin" && role_jwt != "admin"){
        return res.status(401).send("Unauthorized");
    }

    try{
        const usersList = await User.findAll({
            attributes : {exclude : ['user_id', 'createdAt', 'updatedAt', 'password']}
        });

        res.status(200).send(usersList);

    } catch(error){
        res.status(500).send(error);
    }
}

const updateUserInfo = async(req, res) => {
    //jwt verification
    const role_jwt = req.role;
    
    console.log("role from jwt: ", role_jwt);
    if(role_jwt != "Admin" && role_jwt != "admin"){
        return res.status(401).send("Unauthorized");
    }

    const { user_id } = req.params;
    const updates = req.body;

    if(!user_id || !updates){
        return res.status(400).send("Data missing!");
    }

    try{
        const [updated] = await User.update( updates, {
            where : {user_id : user_id}
        });

        if(!updated){
            return res.status(404).send("User not found!");
        }

        res.status(200).send("User updated successfully!");

    } catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

const removeUser = async(req, res) => {
    //jwt verification
    const role_jwt = req.role;
    
    console.log("role from jwt: ", role_jwt);
    if(role_jwt != "Admin" && role_jwt != "admin"){
        return res.status(401).send("Unauthorized");
    }
    
    const { user_id } = req.params;
    if(!user_id){
        return res.status(400).send("Data missing!");
    }

    try{
        const removedUser = await User.findOne({
            where : {user_id : user_id}
        });

        if(!removedUser){
            return res.status(404).send("User not found");
        }

        await removedUser.destroy();

        res.status(200).send("User deleted successfully");

    } catch(error){
        res.status(500).send(error);
    }
}

const userLogin = async(req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).send("Credentials missing!");
    }

    const foundUser = await User.findOne({
        where : {email : email}
    });

    if(!foundUser){
        return res.status(404).send("No such user registered!");
    }

    const pwd_matchResult = await bcrypt.compare(password, foundUser.password);
    console.log(pwd_matchResult);

    if(pwd_matchResult){
        const accessToken = jwt.sign(
            {
                "UserInfo" : {
                    "email" : foundUser.email,
                    "role" : foundUser.role
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn : '10m'}
        );

        const refreshToken = jwt.sign(
            {
                "email" : foundUser.email
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn : '25m'}
        );

        foundUser.refresh_token = refreshToken;
        await foundUser.save();

        res.cookie('jwt', refreshToken, { httpOnly : true, sameSite : 'None', maxAge : 24*60*60*1000});
        res.status(200).json(accessToken);
    } else {
        res.status(401).send("Unable to Sign In. Wrong password");
    }
}

const userLogout = async(req, res) => {
    const cookies = req.cookies;

    if(!cookies?.jwt){
        return res.status(401).send("Unauthorized");
    }

    const refreshToken = cookies.jwt;
    
    const foundUser = await User.findOne({
        where : { refresh_token : refreshToken}
    });
    if(!foundUser){
        res.clearCookie('jwt', { httpOnly : true, sameSite : 'None', secure : true});
        return res.status(204);
    }
    
    foundUser.refresh_token = null;
    await foundUser.save();

    res.clearCookie('jwt', { httpOnly : true, sameSite : 'None', secure : true});
    return res.status(204).send("User logged out");
}

const refreshJWT = async(req, res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt){
        return res.st(401);
    }

    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({
        where : { refresh_token : refreshToken}
    });
    if(!foundUser){
        return res.status(403).send("Forbidden");
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || foundUser.email !== decoded.email){
                return res.status(403).send("Forbidden");
            }

            console.log(decoded);

            const accessToken = jwt.sign(
                {
                    "UserInfo" : {
                        "email" : decoded.email,
                        "role" : foundUser.role
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn : '3m'}
            );

            res.json(accessToken);
        }
    )
}

module.exports = { registerUser, usersList, updateUserInfo, removeUser, userLogin, userLogout, refreshJWT };
