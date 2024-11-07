const { Book } = require('../config/dbConn');

//add book
const addBook = async(req, res) => {
    //jwt verification
    const role_jwt = req.role;
    
    console.log("role from jwt: ", role_jwt);
    if(role_jwt != "Admin" && role_jwt != "admin"){
        return res.status(401).send("Unauthorized");
    }

    const { title, author } = req.body;
    if(!title || !author){
        return res.status(400).send("Data missing");
    }

    try{
        const book = await Book.create({
            title,
            author
        });

        res.status(200).send("Book added successfully");
        
    } catch(error){
        res.status(500).send(error);
    }
}

//list of available books
const listOfBooks = async(req, res) => {
    //jwt verification
    const role_jwt = req.role;
    
    console.log("role from jwt: ", role_jwt);
    if(role_jwt != "Admin" && role_jwt != "admin"){
        return res.status(401).send("Unauthorized");
    }

    try{
        const booksList = await Book.findAll({
            where : {dateBorrowed : null},
            attributes : {exclude : ['book_id', 'dateBorrowed', 'returnDate', 'createdAt', 'updatedAt', 'user_id']}
        });

        res.status(200).send(booksList);

    } catch(error){
        res.status(500).send(error);
    }
}

//update book info
const updateBook = async(req, res) => {
    //jwt verification
    const role_jwt = req.role;
    
    console.log("role from jwt: ", role_jwt);
    if(role_jwt != "Admin" && role_jwt != "admin"){
        return res.status(401).send("Unauthorized");
    }

    const { book_id } = req.params;
    const updates = req.body;
    if(!book_id || !updates){
        return res.status(400).send("Data missing!");
    }

    try{
        const [updated] = await Book.update( updates, {
            where : { book_id : book_id }
        });

        if(!updated){
            return res.status(400).send("Book not found!");
        }

        res.status(200).send("Book updated successfully");

    } catch(error){
        res.status(500).send(error);
    }
}

//remove book from db
const removeBook = async(req, res) => {
    //jwt verification
    const role_jwt = req.role;
    
    console.log("role from jwt: ", role_jwt);
    if(role_jwt != "Admin" && role_jwt != "admin"){
        return res.status(401).send("Unauthorized");
    }
    
    const { book_id } = req.params;
    if(!book_id){
        return res.status(400).send("Book ID missing");
    }

    try{
        const removedBook = await Book.findOne({
            where : {book_id : book_id}
        });

        if(!removedBook){
            return res.status(404).send("Book not found!");
        }

        await removedBook.destroy();

        res.status(200).send("Book removed from list successfully!");
        
    } catch(error){
        res.status(500).send(error);
    }
}

module.exports = { addBook, listOfBooks, updateBook, removeBook };