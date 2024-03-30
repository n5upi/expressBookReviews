const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

// Task 6: Complete the code for registering a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Task 1: Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (req.params.isbn <= 10) {
        return res.send(JSON.stringify(books[isbn]));
    }else{
        return res.send('ISBN not found');
    }
});

// Task 3: Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let bookDetails = Object.values(books)
    console.log(bookDetails);
    let filteredBooks = bookDetails.filter(book => book.author === author);
    return res.status(300).json(filteredBooks);
  });

// Task 4: Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let bookDetails = Object.values(books)
    console.log(bookDetails);
    let filteredBooks = bookDetails.filter(book => book.title === title);
    return res.status(300).json(filteredBooks);
});

// Task 10: Get the book list available in the shop
public_users.get('/task10',async function (req, res) {
    return new Promise((resolve, reject) => {
        resolve(books);
    }).then(books => {
        console.log("Promise for Task 10 is resolved");
        return res.send(JSON.stringify({books}, null, 4));
    }).catch(err => {
        console.error(err);
        return res.status(500).send("Error occurred while retrieving the books in the shop.");
    });
});

// Task 11: Get book details based on ISBN
public_users.get('/task11/isbn/:isbn',async function (req, res) {
    const get_books_isbn = new Promise((resolve, reject) => {
      const isbn = req.params.isbn;
      // console.log(isbn);
          if (req.params.isbn <= 10) {
          resolve(res.send(books[isbn]));
      }
          else {
              reject(res.send('ISBN not found'));
          }
      });
      get_books_isbn.
          then(function(){
              console.log("Promise for Task 11 is resolved");
     }).
          catch(function () { 
              console.log('ISBN not found');
    });
    
   });

// Task 12: Get book details based on author
public_users.get('/task12/author/:author',async function (req, res) {
  const get_books_author = new Promise((resolve, reject) => {

    let booksbyauthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["author"] === req.params.author) {
        booksbyauthor.push({"isbn":isbn,
                            "title":books[isbn]["title"],
                            "reviews":books[isbn]["reviews"]});
      resolve(res.send(JSON.stringify({booksbyauthor}, null, 4)));
      }


    });
    reject(res.send("The mentioned author does not exist"))

    });

    get_books_author.then(function(){
            console.log("Promise for task 12 is resolved");
   }).catch(function () { 
            console.log('The mentioned author does not exist');
  });

});

// Task 13: Get all books based on title
public_users.get('task13/title/:title',function (req, res) {
    const get_books_title = new Promise((resolve, reject) => {
  
      let booksbytitle = [];
      let isbns = Object.keys(books);
      isbns.forEach((isbn) => {
        if(books[isbn]["title"] === req.params.title) {
          booksbytitle.push({"isbn":isbn,
                              "author":books[isbn]["author"],
                              "reviews":books[isbn]["reviews"]});
      resolve(res.send(JSON.stringify({booksbytitle}, null, 4)));
        }
      });
  
      reject(res.send("The mentioned title does not exist "))
  
         });
  
      get_books_title.then(function(){
              console.log("Promise for task 13 is resolved");
     }).catch(function () { 
              console.log('The mentioned book title doesnt exist');
    });
  
  });



//  Task 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn
    let booksArray = Object.values(books);
    console.log(booksArray[isbn]);

    if (req.params.isbn <= 9) {
        return res.json(booksArray[isbn]);
    }
    else {
        return res.status(404).json({message: "ISBN not found"});
    }

});

module.exports.general = public_users;
