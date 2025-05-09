async function loadBooks() {
    const response = await fetch('books/example-book.json');
    const book = await response.json();
    
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = `
        <div class="book">
            <h2>${book.title}</h2>
            <p>By ${book.author}</p>
            <img src="${book.cover_image}" width="100">
            <p>${book.description}</p>
        </div>
    `;
}
loadBooks();
async function loadReviews() {
    const response = await fetch('https://api.github.com/repos/[your-username]/book-reviews/contents/reviews');
    const files = await response.json();
    
    files.forEach(async file => {
        const reviewData = await fetch(file.download_url).then(res => res.json());
        console.log(reviewData); // Display this in HTML
    });
}
loadReviews();
