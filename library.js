//Book object definition and functions
function Book(title, author, pageCount, isRead){
    this.title = title;
    this.author = author;
    this.pageCount = pageCount;
    this.isRead = isRead;
    //The user's timezone will be stored
    this.date = new Date();
}

Book.prototype.getBookInfo = function(){
    let readString = isRead ? "read":"not read yet";
    let bookInfo = title + " by " + author + ", " + pageCount + " pages, " + readString;
    return bookInfo;
}

Book.prototype.toggleIsRead = function(){
    this.isRead = !(this.isRead);
    saveToLocalStorage();
};

//An edit function would be nice to implement

//Library array and functions to manipulate it
let myLibrary = [];
let currLibrary = myLibrary;

function addBookToLibrary(title, author, pageCount, isRead){
    let newBook = new Book(title, author, pageCount, isRead);
    myLibrary.push(newBook);
    saveToLocalStorage();
    //Display book
    let index = myLibrary.length -1;
    let div = displayBook(index);
}

function deleteBookFromLibrary(index){
    delete myLibrary[index];
    saveToLocalStorage();
}

function sortLibrary(){
    //Returns sorted library
}

function filterLibrary(){
    //Returns filtered library
}

//Functions for manipulating the displayed books
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
    let book = myLibrary[index];
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
    library.forEach(book => {
        let index = library.indexOf(book);
        displayBook(index);
    });
}

function removeBookFromDisplay(index){
    deleteBookFromLibrary(index);
    //Remove from DOM
    let bookshelfDiv = document.querySelector("div#bookshelf");
    let book = document.getElementById(`${index}`);
    bookshelfDiv.removeChild(book);
    //Update stats
}

function displaySortedLibrary(library, sortMethod){
    //Sort by date added or title or author last name(?)
}

function displayFilteredLibrary(){
    //Filter on read or unread
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
        addBookToLibrary(title, author, pages, isRead);
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
        myLibrary[id].toggleIsRead();
        updateBookDisplay(id);
    }
});

//Using localStorage to save the library array
function saveToLocalStorage() {
    //This assuming that local storage is available
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}
  
function loadFromLocalStorage() {
    myLibrary = JSON.parse(localStorage.getItem("myLibrary"));
    if (myLibrary === null) myLibrary = [];
    myLibrary = myLibrary.filter(x => x !== null);
    for (let i=0; i<myLibrary.length; i++){
        let book = myLibrary[i];
        book = new Book(book.title, book.author, book.pageCount, book.isRead);
        myLibrary[i] = book;
    }
    displayLibrary(myLibrary);
}

loadFromLocalStorage();


