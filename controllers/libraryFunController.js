const { User } = require('../config/dbConn');
const { Book } = require('../config/dbConn');

//borrow book
const borrowBook = async(req, res) => {
    //jwt verification
    const role_jwt = req.role;

    console.log("role from jwt: ", role_jwt);
    if(role_jwt != "User" && role_jwt != "user"){
        return res.status(401).send("Unauthorized");
    }

    //add user id functionality
    const userEmail_jwt = req.email;

    const foundUser = await User.findOne({
        where : { email : userEmail_jwt }
    });

    if(!foundUser){
        return res.status(401).send("Invalid user");
    }

    const { book_id } = req.params;
    const { numDays } = req.body;
    if(!book_id || !numDays){
        return res.status(400).send("Data missing");
    }

    //find book in db
    const foundBook = await Book.findOne({
        where : { book_id : book_id }
    });

    //book not found in case of deletion
    if(!foundBook){
        return res.status(404).send("Book not found");
    }

    try{
        if(foundBook.dateBorrowed){
            const dateAns = (foundBook.returnDate).toDateString();
    
            return res.status(202).send(`Book has already been borrowed. You can borrow it on ${dateAns}`);
        } else {
            let bDate = new Date();
            let rDate = new Date(bDate);
            (rDate.setDate(rDate.getDate() + numDays));
            
            foundBook.dateBorrowed = bDate;
            foundBook.returnDate = rDate;
            foundBook.user_id = foundUser.user_id;
    
            await foundBook.save();
    
            res.status(200).send(`${foundBook.title} issued. Return Date: ${rDate.toDateString()}. Late returns will be subject to a fine of PKR 50 per day`);
        }
    } catch(error){
        res.status(500).send(error);
    }
}

//return borrowed book + calculate fine
const returnBook = async(req, res) => {
    //jwt verification
    const role_jwt = req.role;

    console.log("role from jwt: ", role_jwt);
    if(role_jwt != "User" && role_jwt != "user"){
        return res.status(401).send("Unauthorized");
    }

    //add user id functionality
    const userEmail_jwt = req.email;

    const foundUser = await User.findOne({
        where : { email : userEmail_jwt }
    });

    if(!foundUser){
        return res.status(401).send("Invalid user");
    }

    const { book_id } = req.params;
    if(!book_id){
        return res.status(400).send("Book ID missing");
    }

    const foundBook = await Book.findOne({
        where : { 
            user_id : foundUser.user_id,
            book_id : book_id 
        }
    });
    if(!foundBook){
        return res.status(404).send("You have not borrowed/already returned this book");
    }

    try{
        const return_today = new Date();

        //test
        //return_today.setDate(return_today.getDate() + 10);
        
        const daysElapsed = Math.round((return_today - foundBook.returnDate) / (1000 * 60 * 60 * 24));
        const return_fine = daysElapsed * 10;

        foundBook.dateBorrowed = null;
        foundBook.returnDate = null;
        foundBook.user_id = null;

        await foundBook.save();

        if(return_fine > 0){
            res.status(200).send(`Thank you for your return. You are ${daysElapsed} days late, for which your fine is PKR ${return_fine}`);
        } else {
            res.status(200).send('Thank you for your return!');
        }

    } catch(error){
        res.status(500).send(error);
    }
}

//book return reminder
const returnReminder = async(req, res) => {
    //jwt verification
    const role_jwt = req.role;
    if(role_jwt != "User" && role_jwt != "user"){
        return res.status(401).send("Unauthorized");
    }

    const userEmail_jwt = req.email;
    
    const foundUser = await User.findOne({
        where : { email : userEmail_jwt }
    });
    if(!foundUser){
        return res.status(404).send("User not found");
    }

    try {
        const borrowedBooks = await Book.findAll({
            where : { user_id : foundUser.user_id},
            attributes : { exclude : ['book_id', 'author', 'dateBorrowed', 'createdAt', 'updatedAt', 'user_id']}
        });

        const today_date = new Date();

        //test
        // let today_date = new Date();
        // today_date.setDate(today_date.getDate() + 1);
        
        const reminders = borrowedBooks.filter((book) => {
            return (Math.floor((book.returnDate - today_date) / (1000 * 60 * 60 * 24))) === 1;
        });

        if(reminders.length === 0){
            return res.status(404).send("No books to return within 1 day");
        }

        res.status(200).send(reminders);
        
    }catch (error){
        res.status(500).send(error);
    }
}

module.exports = { borrowBook, returnBook, returnReminder };