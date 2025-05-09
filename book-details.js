document.addEventListener('DOMContentLoaded', async () => {
    const bookId = new URLSearchParams(window.location.search).get('id');
    
    if (!bookId) {
        window.location.href = '../index.html';
        return;
    }

    await loadBookDetails(bookId);
    await loadBookReviews(bookId);
});

async function loadBookDetails(bookId) {
    try {
        const response = await fetch(`../books/${bookId}.json`);
        const book = await response.json();
        
        document.getElementById('book-details').innerHTML = `
            <div class="col-md-4">
                <img src="${book.cover_image}" class="img-fluid rounded" alt="${book.title}">
            </div>
            <div class="col-md-8">
                <h1>${book.title}</h1>
                <h4 class="text-muted">by ${book.author}</h4>
                <p class="mt-3">${book.description}</p>
                <div class="details">
                    <p><strong>Published:</strong> ${book.published_year}</p>
                    <p><strong>Pages:</strong> ${book.pages}</p>
                    <p><strong>Genre:</strong> ${book.genre.join(', ')}</p>
                </div>
            </div>
        `;
    } catch (error) {
        document.getElementById('book-details').innerHTML = `
            <div class="alert alert-danger">
                Failed to load book details. <a href="../index.html">Return home</a>
            </div>
        `;
    }
}

async function loadBookReviews(bookId) {
    try {
        const response = await fetch('https://api.github.com/repos/ds-0809/crowdsourced-book-reviews/contents/reviews');
        const files = await response.json();
        
        const reviews = [];
        for (const file of files.filter(f => f.name.includes(bookId))) {
            const reviewRes = await fetch(file.download_url);
            reviews.push(await reviewRes.json());
        }
        
        renderReviews(reviews);
    } catch (error) {
        document.getElementById('reviews-container').innerHTML = `
            <div class="alert alert-warning">
                No reviews yet. Be the first to <a href="#" onclick="submitReview()">submit one</a>!
            </div>
        `;
    }
}

function renderReviews(reviews) {
    const container = document.getElementById('reviews-container');
    
    if (reviews.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info">
                No reviews yet. <a href="#" onclick="submitReview()">Be the first!</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = reviews.map(review => `
        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <h5>${review.reviewer}</h5>
                    <div class="text-warning">
                        ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                    </div>
                </div>
                <p class="card-text mt-2">${review.review}</p>
                <small class="text-muted">${review.date}</small>
            </div>
        </div>
    `).join('');
}

function submitReview() {
    window.location.href = `../submit-review.html?book=${new URLSearchParams(window.location.search).get('id')}`;
}
