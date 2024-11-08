const { User, Book, Request } = require('../config/dbConn');

const unavailableBookRequest = async(req, res) => {
    const role_jwt = req.role;
    if(role_jwt != "User" && role_jwt != "user"){
        return res.status(401).send("Unauthorized");
    }

    //get user record
    const userEmail_jwt = req.email;
    
    const foundUser = await User.findOne({
        where : { email : userEmail_jwt }
    });
    if(!foundUser){
        return res.status(404).send("User not found");
    }

    //request body
    const { book_title, book_author } = req.body;
    if(!book_title || !book_author){
        return res.status(400).send("Book title missing");
    }

    const status = "Pending";
    const admin_response = null;
    const user_id = foundUser.user_id;

    try{
        const newRequest = await Request.create({
            book_title,
            book_author,
            status,
            admin_response,
            user_id
        });

        res.status(200).send("Request filed successfully");

    } catch(error){
        res.status(500).send(error);
    }
}

//get list of requests
const getRequestList = async(req, res) => {
    const role_jwt = req.role;

    try{
        if(role_jwt === "Admin" || role_jwt === "admin"){
            //admin gets list of all pending requests
            const pendingRequests = await Request.findAll({
                where : { status : "Pending"},
                attributes : { exclude : [ 'createdAt', 'updatedAt' ]} 
            });

            if(pendingRequests.length === 0){
                return res.status(404).send("No requests pending")
            }

            res.status(200).send(pendingRequests);

        } else if(role_jwt === "User" || role_jwt === "user"){
            //user gets list of their requests
            const userEmail_jwt = req.email;

            const foundUser = await User.findOne({
                where : { email : userEmail_jwt }
            });
            if(!foundUser){
                return res.status(404).send("User not found");
            }

            const userRequests = await Request.findAll({
                where : { user_id : foundUser.user_id },
                attributes : { exclude : [ 'createdAt', 'updatedAt', 'user_id' ]}
            });

            if(userRequests.length === 0){
                return res.status(404).send("No requests found");
            }

            res.status(200).send(userRequests);

        } else {
            return res.status(401).send("Unauthorized")
        }

    } catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

//respond to request
const respondAdmin = async(req, res) => {
    const role_jwt = req.role;
    if(role_jwt != "Admin" && role_jwt != "admin"){
        return res.status(401).send("Unauthorized");
    }

    const { request_id } = req.params;
    const { status, admin_response } = req.body;
    if(!request_id || !status || !admin_response){
        return res.status(400).send("Data missing!");
    }

    try{
        const foundRequest = await Request.findOne({
            where : { request_id : request_id }
        });
    
        if(!foundRequest){
            return res.status(404).send("No request found");
        }

        const title = foundRequest.book_title;
        const author = foundRequest.book_author;

        if(status === "Accepted" || status === "accepted"){
            //add book to books table
            const bookAdded = await Book.create({
                title,
                author
            });

            console.log(`${title} by ${author} added successfully`);
        }

        foundRequest.status = status;
        foundRequest.admin_response = admin_response;

        await foundRequest.save();

        res.status(200).send("Response updated!");

    } catch(error){
        console.log(error);
    }
}

module.exports = { unavailableBookRequest, getRequestList, respondAdmin }