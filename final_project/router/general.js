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

public_users.post("/register", (req,res) => {
  //Write your code here
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
    return new Promise((resolve, reject) => {
        resolve(books);
    }).then(books => {
        return res.send(JSON.stringify(books, null, 4));
    }).catch(err => {
        console.error(error);
        return res.status(500).send("Error occurred while retrieving the books in the shop.");
    });
});

// Task 2: Get book details based on ISBN (Task 11:)
public_users.get('/isbn/:isbn',function (req, res) {
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

// Get book details based on author (TASK 12)
public_users.get('/author/:author',function (req, res) {
  //Write your code here
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
    reject(res.send("The mentioned author does not exist "))

    });

    get_books_author.then(function(){
            console.log("Promise is resolved");
   }).catch(function () { 
                console.log('The mentioned author does not exist');
  });
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title (TASK 13)
public_users.get('/title/:title',function (req, res) {
  //Write your code here
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
            console.log("Promise is resolved");
   }).catch(function () { 
                console.log('The mentioned book title doesnt exist');
  });
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
