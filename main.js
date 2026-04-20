const booksSection = document.querySelector(".books");
const modal = document.querySelector(".modal");
const backdrop = document.querySelector(".modal-backdrop");


const addBtn = document.querySelector(".btn.primary");
const closeBtn = modal.querySelector(".close-btn");
const cancelBtn = modal.querySelector(".btn.cancel");
const searchInput = document.querySelector('input[type="search"]');

const form = modal.querySelector("form");
const modalTitle = modal.querySelector(".modal-header h2");
const submitBtn = modal.querySelector('button[type="submit"]');

let library = [];
let editingId = null;
let searchQuery = "";

class Book {
    constructor(title, author, pages, read = false) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }
}

function seedLibrary() {
    const samples = [
        ["Clean Code", "Robert C. Martin", 464],
        ["Atomic Habits", "James Clear", 320],
        ["Deep Work", "Cal Newport", 304],
        ["Eloquent JavaScript", "Marijn Haverbeke", 472],
    ];

    samples.forEach(([title, author, pages]) => {
        addBook(title, author, pages, Math.random() > 0.5);
    });
}

function addBook(title, author, pages, read) {
    library.push(new Book(title, author, pages, read));
    render();
}

function updateBook(id, data) {
    const book = library.find(b => b.id === id);
    if (!book) return;

    book.title = data.title;
    book.author = data.author;
    book.pages = data.pages;
    book.read = data.read;

    render();
}

function removeBook(bookId) {
    const index = library.findIndex(book => book.id === bookId);
    if (index !== -1) {
        library.splice(index, 1);
        render();
    }

};

function render() {

    // delete old rows
    booksSection
        .querySelectorAll(".row")
        .forEach(row => row.remove());

    library.filter(book => book.title.toLowerCase().includes(searchQuery) || book.author.toLowerCase().includes(searchQuery))
        .forEach(book => {
            const row = createBookRow(book);
            booksSection.appendChild(row);
        });

}

function createBookRow(book) {

    const row = document.createElement("article");
    row.classList.add("row");
    row.dataset.id = book.id;

    // Title
    const title = document.createElement("span");
    title.className = "title";
    title.textContent = book.title;

    // Author
    const author = document.createElement("span");
    author.className = "author";
    author.textContent = book.author;

    // Pages
    const pages = document.createElement("span");
    pages.className = "pages";
    pages.textContent = book.pages;

    // Status
    const status = document.createElement("span");
    status.className = `status ${book.read ? "read" : "unread"}`;
    status.textContent = book.read ? "Read" : "Unread";

    // Actions
    const actions = document.createElement("div");
    actions.className = "row-actions";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.dataset.action = "edit";

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.dataset.action = "remove";

    actions.append(editBtn, removeBtn);

    row.append(title, author, pages, status, actions);

    return row;
}

function changeBookReadStatus(bookId) {
    const book = library.find(book => book.id === bookId);
    if (book) {
        book.read = !book.read;
        render();
    }
}

function showModal() {
    modal.classList.remove("hidden");
    backdrop.classList.remove("hidden");
    form.elements.title.focus();
}

function closeModal() {
    modal.classList.add("hidden");
    backdrop.classList.add("hidden");
    editingId = null;
}

function openAddModal() {
    editingId = null;

    modalTitle.textContent = "Add Book";
    submitBtn.textContent = "Add";

    form.reset();
    showModal();
}

function openEditModal(bookId) {
    const book = library.find(b => b.id === bookId);
    if (!book) return;

    editingId = bookId;

    modalTitle.textContent = "Edit Book";
    submitBtn.textContent = "Save";

    form.elements.title.value = book.title;
    form.elements.author.value = book.author;
    form.elements.pages.value = book.pages;
    form.elements.read.checked = book.read;

    showModal();
}

// Events

addBtn.addEventListener("click", openAddModal);
closeBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);
backdrop.addEventListener("click", closeModal);

document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
});

form.addEventListener("submit", e => {
    e.preventDefault();

    const fd = new FormData(form);

    const title = fd.get("title").trim();
    const author = fd.get("author").trim();
    const pages = Number(fd.get("pages"));
    const read = fd.get("read") === "on";

    if (!title || !author || !Number.isFinite(pages) || pages <= 0) return;

    if (editingId === null) {
        // ADD
        addBook(title, author, pages, read);
    } else {
        // EDIT
        const book = library.find(b => b.id === editingId);
        if (book) {
            book.title = title;
            book.author = author;
            book.pages = pages;
            book.read = read;
        }
        render();
    }

    closeModal();
});


booksSection.addEventListener("click", e => {
    const button = e.target.closest("button[data-action]");
    if (!button) return;

    const action = button.dataset.action;
    const row = button.closest(".row");
    if (!row) return;

    const id = row.dataset.id;

    if (action === "remove") {
        removeBook(id);
    }

    if (action === "edit") {
        openEditModal(id);
    }
});

searchInput.addEventListener("input", e => {
    searchQuery = e.target.value.toLowerCase();
    render();
});


seedLibrary();