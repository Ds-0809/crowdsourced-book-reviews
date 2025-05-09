// Sample book data (in real app, fetch from GitHub)
const sampleBooks = [
    {
        id: "harry-potter",
        title: "Harry Potter and the Sorcerer's Stone",
        author: "J.K. Rowling",
        cover: "https://m.media-amazon.com/images/I/81m1s4wIPML._AC_UF1000,1000_QL80_.jpg",
        rating: 4.5,
        reviewCount: 128
    },
    {
        id: "dune",
        title: "Dune",
        author: "Frank Herbert",
        cover: "https://m.media-amazon.com/images/I/81ym3QUd3KL._AC_UF1000,1000_QL80_.jpg",
        rating: 4.8,
        reviewCount: 95
    }
];

// DOM Elements
const booksContainer = document.getElementById('books-container');
const stepsGuide = document.getElementById('steps-guide');
const contributeBtn = document.getElementById('contribute-btn');

// Display books
function renderBooks() {
    booksContainer.innerHTML = sampleBooks.map(book => `
        <div class="book-card" onclick="showBookDetail('${book.id}')">
            <img src="${book.cover}" alt="${book.title}">
            <div class="book-info">
                <h3>${book.title}</h3>
                <p class="author">${book.author}</p>
                <div class="rating">
                    ${renderStars(book.rating)}
                    <span>${book.rating} (${book.reviewCount} reviews)</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Display contribution steps (hidden until button click)
function renderSteps() {
    stepsGuide.innerHTML = `
        <div class="step">
            <span>1</span>
            <p>Fork this repository on GitHub</p>
        </div>
        <div class="step">
            <span>2</span>
            <p>Create a new JSON file in <code>/reviews/</code></p>
        </div>
        <div class="step">
            <span>3</span>
            <p>Submit a Pull Request with your review</p>
        </div>
        <a href="https://github.com/YOUR-USERNAME/book-reviews/fork" target="_blank" class="github-link">
            <i class="fab fa-github"></i> Go to GitHub
        </a>
    `;
    stepsGuide.style.display = 'none';
}

// Star rating helper
function renderStars(rating) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(`<i class="fas fa-star ${i <= Math.floor(rating) ? 'filled' : ''} 
                   ${i > Math.floor(rating) && i-0.5 <= rating ? 'half-filled' : ''}"></i>`);
    }
    return stars.join('');
}

// Event Listeners
contributeBtn.addEventListener('click', () => {
    stepsGuide.style.display = stepsGuide.style.display === 'none' ? 'block' : 'none';
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderBooks();
    renderSteps();
});

// Future feature - book details
function showBookDetail(bookId) {
    alert(`Feature coming soon! Will show details for ${bookId}`);
}
// Example: Fetch and display Harry Potter data
async function loadBook(bookId) {
  const response = await fetch(`books/${bookId}.json`);
  const book = await response.json();
  
  document.getElementById('book-title').textContent = book.title;
  document.getElementById('book-cover').src = book.cover_image;
  document.getElementById('book-description').textContent = book.description;
}
loadBook('harry-potter-1');
// Replace the showBookDetail function with this:
function showBookDetail(bookId) {
    // Redirect to book details page with ID parameter
    window.location.href = `book-details.html?id=${bookId}`;
}
