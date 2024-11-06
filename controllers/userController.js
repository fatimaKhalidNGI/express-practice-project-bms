const { User } = require('../config/dbConn');
const bcrypt = require('bcrypt');

const registerUser = async(req, res) => {
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
        console.log(error);
        res.status(500).send(error);
    }
}

const usersList = async(req, res) => {
    try{
        const usersList = await User.findAll({
            attributes : {exclude : ['user_id', 'createdAt', 'updatedAt', 'password']}
        });

        res.status(200).send(usersList);

    } catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

const removeUser = async(req, res) => {
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
        console.log(error);
        res.status(500).send(error);
    }
}

module.exports = { registerUser, usersList, removeUser };