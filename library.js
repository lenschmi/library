//Book object definition and functions
function Book(title, author, pageCount, isRead, bookId){
    this.title = title;
    this.author = author;
    this.pageCount = pageCount;
    this.isRead = isRead;
    this.bookId = bookId;
}

Book.prototype.getBookInfo = function(){
    let readString = isRead ? "read":"not read yet";
    let bookInfo = title + " by " + author + ", " + pageCount + " pages, " + readString;
    return bookInfo;
}

Book.prototype.toggleIsRead = function(){
    this.isRead = !(this.isRead);
};

//Library object and functions to manipulate it
function Library(books){
    //Creates an empty library meant to store Book objects
    this.books = [];
}

Library.prototype.appendBooks = function(newBooks){
    this.books = this.books.concat(newBooks);
}

Library.prototype.addBookToLibrary = function(title, author, pageCount, isRead, bookId){
    let newBook = new Book(title, author, pageCount, isRead, bookId);
    this.books.push(newBook);
}

Library.prototype.deleteBookFromLibrary = function(index){
    delete this.books[index];
}

Library.prototype.filterLibrary = function(filterMethod){
    //Returns filtered library
    let newLib = new Library();
    switch(filterMethod){
        case "unread":
            newLib.appendBooks(this.books.filter(book => !book.isRead));
            return newLib;
        case "read":
            newLib.appendBooks(this.books.filter(book => book.isRead));
            return newLib;
        default:
            return this;
    }   
}

//Functions for manipulating the displayed books
let myLibrary = new Library; //The overall library
let currLibrary = myLibrary; //The currently displayed library
//This could be enumerated
let currFilter = "all";

function displayBook(index){
    let div = document.createElement("div");
    div.setAttribute("class", "book");
    div.setAttribute("id", `${index}`);
    div.innerHTML = `<div class="book-title">
                        <h3 class="title"></h3>
                        <div class="author"></div>
                    </div>
                    <div class="page-count">Page Count:</div>
                    <div class="is-read"></div>
                    <button class="book-button toggle"></button>
                    <button class="book-button delete">Delete</button>`;
    
    let bookshelfDiv = document.querySelector("div#bookshelf");
    if (!bookshelfDiv.querySelector("div.book")){
        //If there are no books added yet add the book at the beginning of the container before the dummy books
        bookshelfDiv.insertAdjacentElement("afterbegin", div);
    } else{
        //Otherwise add the new book before the first dummy book
        let dummyBook = document.querySelector("div.placeholder");
        dummyBook.insertAdjacentElement("beforebegin", div);
    }

    updateBookDisplay(index);
}

function updateBookDisplay(index){
    let bookDiv = document.getElementById(`${index}`);
    let book = currLibrary.books[index];
    let isRead = book.isRead ? "Read":"Unread";
    let notIsRead = book.isRead ? "Unread":"Read";
    bookDiv.querySelector(".title").textContent= `${book.title}`;
    bookDiv.querySelector(".author").textContent = `by ${book.author}`;
    bookDiv.querySelector(".page-count").textContent = `Page Count: ${book.pageCount}`;
    bookDiv.querySelector(".is-read").textContent = `${isRead}`;
    bookDiv.querySelector(".toggle").textContent = `Mark ${notIsRead}`;
    bookDiv.setAttribute("data-bookId", `${book.bookId}`);
}

function displayLibrary(){
    //Function to display every book in the currLibrary

    //Clear bookshelf
    let bookshelfDiv = document.querySelector("div#bookshelf");
    let bookDivs = document.querySelectorAll("div.book");
    bookDivs.forEach(div => bookshelfDiv.removeChild(div));

    //Load library
    currLibrary.books.forEach(book => {
        if (book){
            let index = currLibrary.books.indexOf(book);
            displayBook(index);
        }
    });
}

function removeBookFromDisplay(bookId, index){
    //Delete the book from both the main library and the current library
    if (currLibrary === myLibrary){
        myLibrary.deleteBookFromLibrary(index);
    } else{
        myLibrary.deleteBookFromLibrary(bookId);
        currLibrary.deleteBookFromLibrary(index);
    }
    saveToLocalStorage();
    //Remove from DOM
    let bookshelfDiv = document.querySelector("div#bookshelf");
    let book = document.getElementById(`${index}`);
    bookshelfDiv.removeChild(book);
    //Update stats

}

function displayFilteredLibrary(filterMethod){
    currLibrary = myLibrary.filterLibrary(filterMethod);
    displayLibrary();
}

//Functions to display and update Bookish Stats
function displayStats(){

}

function updateStats(){
    //To be called when any changes are made to the library
}

function addTestBooks(n){
    //Add n test books to the library
    for (let i=0; i< n; i++){
        let bookId = myLibrary.books.length;
        myLibrary.addBookToLibrary(`Test Book ${i}`, "author", 123, "read", bookId);
        if(currLibrary === myLibrary){
            let index = myLibrary.books.length -1;
            displayBook(index);
        } else{
            currLibrary = myLibrary;
            displayLibrary(currLibrary);
            document.querySelector("#filter").selectedIndex = 0;
            currFilter = "all";
        }
    }
    saveToLocalStorage();
}

//Event listeners
//Add button
document.querySelector("button#add-book").addEventListener("click", function(e){
    document.getElementById("fullscreen-container").className = "";
});

//Form submission
document.querySelector("form").addEventListener("submit", function(e){
    e.preventDefault();
    let title = document.getElementById("ip-title").value;
    let author = document.getElementById("ip-author").value;
    let pages = parseInt(document.getElementById("ip-pages").value);
    let isRead = document.getElementById("ip-read").checked;
    if (title && author && pages>=0){
        let bookId = myLibrary.books.length;
        myLibrary.addBookToLibrary(title, author, pages, isRead, bookId);
        if(currLibrary === myLibrary){
            let index = myLibrary.books.length -1;
            displayBook(index);
        } else{
            currLibrary = myLibrary;
            displayLibrary(currLibrary);
            document.querySelector("#filter").selectedIndex = 0;
            currFilter = "all";
        }
        saveToLocalStorage();
    }
    clearForm();
    document.getElementById("fullscreen-container").className = "hide";
});

//Cancel form
document.querySelector("button#cancel").addEventListener("click", function(e){
    clearForm();
    document.getElementById("fullscreen-container").className = "hide";
});

function clearForm(){
    let inputs = document.querySelectorAll("input[type='text'");
    inputs.forEach(ip => {ip.value="";});
    document.querySelector("input#ip-read").checked = false;
    document.querySelector("input#ip-pages").value= "";
}

//Delete book and toggle read/unread buttons
//Event listeners set on entire book flex box to avoid creating an event listener for each button as it's made
document.querySelector("#bookshelf").addEventListener("click", function(e){
    if(e.target.classList.contains("delete")){
        let id = parseInt(e.target.parentNode.id);
        //Get the book based on the id
        let bookDiv = document.getElementById(`${id}`);
        let bookId = bookDiv.getAttribute("data-bookId");
        removeBookFromDisplay(bookId, id);
    } else if (e.target.classList.contains("toggle")){
        let id = parseInt(e.target.parentNode.id);
        //Get the book based on the id
        let bookDiv = document.getElementById(`${id}`);
        let bookId = bookDiv.getAttribute("data-bookId");
        myLibrary.books[bookId].toggleIsRead();
        if (currFilter !== "all"){
            displayFilteredLibrary(currFilter);
        } else{
            updateBookDisplay(id);
        } 
        saveToLocalStorage();
    }
});

//Filter on Read/Unread
document.querySelector("#filter").addEventListener("change", function(e){
    let filterType = e.target.value;
    if (filterType !== currFilter){
        displayFilteredLibrary(filterType);
        currFilter = filterType;
    }
});

//Using localStorage to save the library array
function saveToLocalStorage() {
    //This is assuming that local storage is available
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary.books));
}
  
function loadFromLocalStorage() {
    let storedBooks = JSON.parse(localStorage.getItem("myLibrary"));
    if (storedBooks !== null){
        storedBooks = storedBooks.filter(x => x !== null);
        for (let i=0; i<storedBooks.length; i++){
            let book = storedBooks[i];
            //Set the bookId to match it's index in the main library array
            book = new Book(book.title, book.author, book.pageCount, book.isRead, i);
            storedBooks[i] = book;
        }
        myLibrary.appendBooks(storedBooks);
    }
    displayLibrary();
}

loadFromLocalStorage();


//TODO
/*
- Add Firebase storage option
- Add statistics support
- Include css reset file
- May want to change to a grid (from flexbox)

- Missing features:
    - Editing books
    - Error checking on multiple matching books (you may or may not want this since you might have multiple copies of the same book, multiple translatiosn etc.)
    - More information about the book (genre, edition etc.)
    - Sorting options
*/