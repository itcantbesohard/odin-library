const myLibrary = [];

function Book(title = "", author = "", pages = 0, read = false) {
    if (!new.target) {
        throw Error("You must use the 'new' operator to call the constructor");
    }
    this.id = crypto.randomUUID;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;

    this.info = function () {
        console.log(`${this.title} by ${this.author}, ${this.pages} pages, ` +
            (this.read ? "readed" : "not read yet"))
            ;
    };
}

function addBookToLibrary(title, author, pages, read) {
    const book = new Book(title, author, pages, read);
    myLibrary.push(book);
}

function showBooksFromLibrary() {

};

function removeBookFromLibrary() { };

function changeBookReadStatus(book) {

};