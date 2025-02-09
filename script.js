// Search books using Google Books API
function searchBooks() {
    const query = document.getElementById('bookSearch').value;
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`)
        .then(response => response.json())
        .then(data => displaySearchResults(data.items));
    }

function displaySearchResults(books) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';
    books.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');
        bookItem.innerHTML = `
            <img src="${book.volumeInfo.imageLinks?.thumbnail || 'default-cover.jpg'}" alt="${book.volumeInfo.title} Cover" onclick="showModal('${book.volumeInfo.imageLinks?.thumbnail || 'default-cover.jpg'}')">
            <h3>${book.volumeInfo.title}</h3>
            <p>by ${book.volumeInfo.authors.join(', ')}</p>
            <p>${book.volumeInfo.pageCount} pages</p>
            <button onclick="addToLibrary('${book.id}')">Add to Library</button>
        `;
        searchResults.appendChild(bookItem);
    });
}

// Add book to personal library using LocalStorage
function addToLibrary(bookId) {
    let library = JSON.parse(localStorage.getItem('library')) || [];
    fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`)
        .then(response => response.json())
        .then(book => {
        book.readPages = 0; // Initialize read pages to 0
        library.push(book);
        localStorage.setItem('library', JSON.stringify(library));
        displayLibrary();
        });
}

function displayLibrary() {
    const libraryList = document.getElementById('libraryList');
    libraryList.innerHTML = '';
    const library = JSON.parse(localStorage.getItem('library')) || [];
    library.forEach(book => {
        const listItem = document.createElement('div');
        listItem.classList.add('library-item');
        listItem.innerHTML = `
            <img src="${book.volumeInfo.imageLinks?.thumbnail || 'default-cover.jpg'}" alt="${book.volumeInfo.title} Cover" onclick="showModal('${book.volumeInfo.imageLinks?.thumbnail || 'default-cover.jpg'}')">
            <h3>${book.volumeInfo.title}</h3>
            <p>by ${book.volumeInfo.authors.join(', ')}</p>
            <p>${book.volumeInfo.pageCount} pages</p>
            <button onclick="updateProgress('${book.id}')">Update Progress</button>
            <button onclick="removeFromLibrary('${book.id}')">Remove</button>
        `;
        libraryList.appendChild(listItem);
    });
}

// Remove book from library
function removeFromLibrary(bookId) {
    let library = JSON.parse(localStorage.getItem('library')) || [];
    library = library.filter(book => book.id !== bookId);
    localStorage.setItem('library', JSON.stringify(library));
    displayLibrary();
}

// Update reading progress
function updateProgress(bookId) {
    let library = JSON.parse(localStorage.getItem('library')) || [];
    let progress = JSON.parse(localStorage.getItem('progress')) || [];
    const book = library.find(b => b.id === bookId);
    const readPages = prompt(`Enter the number of pages you have read out of ${book.volumeInfo.pageCount}`);
    
    const progressItem = {
        id: bookId,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors,
        readPages: readPages,
        totalPages: book.volumeInfo.pageCount,
        thumbnail: book.volumeInfo.imageLinks?.thumbnail || 'default-cover.jpg'
    };
    
    const existingProgressIndex = progress.findIndex(item => item.id === bookId);
    if (existingProgressIndex > -1) {
        progress[existingProgressIndex] = progressItem;
    } else {
        progress.push(progressItem);
    }
    
    localStorage.setItem('progress', JSON.stringify(progress));
    displayProgress();
}

function displayProgress() {
    const progressList = document.getElementById('progressList');
    progressList.innerHTML = '';
    const progress = JSON.parse(localStorage.getItem('progress')) || [];
    progress.forEach(item => {
        const listItem = document.createElement('div');
        listItem.classList.add('progress-item');
        listItem.innerHTML = `
            <img src="${item.thumbnail}" alt="${item.title} Cover" onclick="showModal('${item.thumbnail}')">
            <h3>${item.title}</h3>
            <p>by ${item.authors.join(', ')}</p>
            <p>Pages read: ${item.readPages} / ${item.totalPages}</p>
            <button onclick="removeFromProgress('${item.id}')">Remove</button>
        `;
        progressList.appendChild(listItem);
    });
}

// Remove book from progress list
function removeFromProgress(bookId) {
    let progress = JSON.parse(localStorage.getItem('progress')) || [];
    progress = progress.filter(item => item.id !== bookId);
    localStorage.setItem('progress', JSON.stringify(progress));
    displayProgress();
}

// Recommend books based on genre
function recommendBooks() {
    const genre = document.getElementById('genreInput').value;
    fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${genre}`)
        .then(response => response.json())
        .then(data => displayRecommendations(data.items));
}

function displayRecommendations(books) {
    const recommendationList = document.getElementById('recommendationList');
    recommendationList.innerHTML = '';
    books.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.classList.add('recommendation-item');
        bookItem.innerHTML = `
            <img src="${book.volumeInfo.imageLinks?.thumbnail || 'default-cover.jpg'}" alt="${book.volumeInfo.title} Cover" onclick="showModal('${book.volumeInfo.imageLinks?.thumbnail || 'default-cover.jpg'}')">
            <h3>${book.volumeInfo.title}</h3>
            <p>by ${book.volumeInfo.authors.join(', ')}</p>
            <p>${book.volumeInfo.pageCount} pages</p>
        `;
        recommendationList.appendChild(bookItem);
    });
}

// Show modal with larger image
function showModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    modal.style.display = "block";
    modalImage.src = imageSrc;
}

// Close modal
function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = "none";
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Display library and progress on page load
document.addEventListener('DOMContentLoaded', () => {
    displayLibrary();
    displayProgress();
});
