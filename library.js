//Book object definition and functions
function Book(title, author, pageCount, isRead){
    this.title = title;
    this.author = author;
    this.pageCount = pageCount;
    this.isRead = isRead;
}

Book.prototype.getBookInfo = function(){
    let readString = isRead ? "read":"not read yet";
    let bookInfo = title + " by " + author + ", " + pageCount + " pages, " + readString;
    return bookInfo;
}

Book.prototype.toggleIsRead = function(){
    this.isRead = !(this.isRead);
};

//An edit function would be nice to implement

//Library object and functions to manipulate it
function Library(books){
    //Creates an empty library meant to store Book objects
    this.books = [];
}

Library.prototype.appendBooks = function(newBooks){
    this.books = this.books.concat(newBooks);
}

Library.prototype.addBookToLibrary = function(title, author, pageCount, isRead){
    let newBook = new Book(title, author, pageCount, isRead);
    this.books.push(newBook);
}

Library.prototype.deleteBookFromLibrary = function(index){
    delete this.books[index];
}

Library.prototype.sortLibraryByTitle = function(){
    //Returns library sorted by title
    let newLib = new Library();
    const sortedBooks = this.books.sort(function(book1, book2){
        if (book1.title < book2.title) return -1;
        else if (book1.title > book2.title) return 1;
        return 0;
    });
    newLib.appendBooks(sortedBooks);
    return newLib;
}

Library.prototype.filterLibrary = function(filterMethod){
    //Returns filtered library
    let newLib = new Library();
    switch(filterMethod){
        case "Unread":
            newLib.appendBooks(this.books.filter(book => !book.isRead));
            return newLib;
        case "Read":
            newLib.appendBooks(this.books.filter(book => book.isRead));
            return newLib;
        default:
            return;
    }   
}

//Functions for manipulating the displayed books
let myLibrary = new Library; //The overall library
//let currLibrary = myLibrary; //The currently displayed library
//These could be enumerated
let currFilter = "all";
let currSort = "none";

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
    let book = myLibrary.books[index];
    let isRead = book.isRead ? "Read":"Unread";
    let notIsRead = book.isRead ? "Unread":"Read";
    bookDiv.querySelector(".title").textContent= `${book.title}`;
    bookDiv.querySelector(".author").textContent = `by ${book.author}`;
    bookDiv.querySelector(".page-count").textContent = `Page Count: ${book.pageCount}`;
    bookDiv.querySelector(".is-read").textContent = `${isRead}`;
    bookDiv.querySelector(".toggle").textContent = `Mark ${notIsRead}`;
}

function displayLibrary(library){
    //Function to display every book in a library array
    //Possibly want to delete all books from HTML first (so that this can be used to reload a sorted library)
    library.books.forEach(book => {
        let index = library.books.indexOf(book);
        displayBook(index);
    });
}

function removeBookFromDisplay(index){
    myLibrary.deleteBookFromLibrary(index);
    saveToLocalStorage();
    //Remove from DOM
    let bookshelfDiv = document.querySelector("div#bookshelf");
    let book = document.getElementById(`${index}`);
    bookshelfDiv.removeChild(book);
    //Update stats

}

function displaySortedLibrary(sortMethod){
    switch(sortMethod){
        case "title":
            currLibrary = sortLibraryByTitle();
        case "author":
            currLibrary = myLibrary;
        default: 
            currLibrary = myLibrary;
    }
    displayLibrary(currLibrary);
}

function displayFilteredLibrary(filterMethod){
    currLibrary = filterLibrary(filterMethod);
    displayLibrary(currLibrary);
}

//Functions to display and update Bookish Stats
function displayStats(){

}

function updateStats(){
    //To be called when any changes are made to the library
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
        myLibrary.addBookToLibrary(title, author, pages, isRead);
        let index = myLibrary.books.length -1;
        displayBook(index);
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
        removeBookFromDisplay(id);
    } else if (e.target.classList.contains("toggle")){
        let id = parseInt(e.target.parentNode.id);
        myLibrary.books[id].toggleIsRead();
        updateBookDisplay(id);
        saveToLocalStorage();
    }
});

//Filter event listener


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
            book = new Book(book.title, book.author, book.pageCount, book.isRead);
            storedBooks[i] = book;
        }
        myLibrary.appendBooks(storedBooks);
    }
    displayLibrary(myLibrary);
}

loadFromLocalStorage();


//TODO
/*
- Add Firebase storage option
- Adding filtering and sorting options
- Add statistics support
- Add support for editing a book
- Include css reset file
- Move buttons on book cards to bottom of card
- May want to change to a grid (from flexbox)
*/