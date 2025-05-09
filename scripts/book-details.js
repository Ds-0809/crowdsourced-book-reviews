async function loadReviews(bookId) {
    const container = document.getElementById('reviews-container');
    
    // Show loading spinner
    container.innerHTML = `
        <div class="loading-state">
            <div class="spinner">
                <div class="dot1"></div>
                <div class="dot2"></div>
                <div class="dot3"></div>
            </div>
            <p>Loading reader reviews...</p>
        </div>
    `;

    try {
        const response = await fetch(`https://api.github.com/repos/Ds-0809/crowdsourced-book-reviews/tree/main/reviews);
        const files = await response.json();
        
        const reviews = [];
        for (const file of files.filter(f => f.name.includes(bookId))) {
            const reviewRes = await fetch(file.download_url);
            reviews.push(await reviewRes.json());
        }

        if (reviews.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="far fa-comment-dots"></i>
                    <p>No reviews yet. Be the first!</p>
                    <a href="submit-review.html?book=${bookId}" class="btn">
                        Submit Review
                    </a>
                </div>
            `;
        } else {
            renderReviews(reviews);
        }
    } catch (error) {
        container.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load reviews</p>
                <button onclick="loadReviews('${bookId}')">Retry</button>
            </div>
        `;
    }
}
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
document.addEventListener('DOMContentLoaded', async () => {
    const bookId = new URLSearchParams(window.location.search).get('id');
    if (!bookId) return;
    
    await loadReviews(bookId);
});

async function loadReviews(bookId) {
    try {
        const response = await fetch(`https://api.github.com/repos/Ds-0809/crowdsourced-book-reviews/tree/main/reviews`);
        const files = await response.json();
        
        // Filter and process reviews
        const reviews = await Promise.all(
            files.filter(file => 
                file.name.includes(bookId) && 
                file.name.endsWith('.json')
            ).map(async file => {
                const reviewRes = await fetch(file.download_url);
                return await reviewRes.json();
            })
        );
        
        displayReviews(reviews.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
        console.error("Error loading reviews:", error);
        displayError();
    }
}

function displayReviews(reviews) {
    const container = document.getElementById('reviews-container');
    
    if (reviews.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">
                    No reviews yet. Be the first to <a href="submit-review.html?book=${getBookId()}" class="alert-link">share your thoughts</a>!
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = reviews.map(review => `
        <div class="col-md-6">
            <div class="card review-card h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between mb-3">
                        <div>
                            <img src="https://github.com/${review.reviewer}.png?size=40" 
                                 alt="${review.reviewer}" 
                                 class="rounded-circle me-2">
                            <strong>${review.reviewer}</strong>
                        </div>
                        <div class="text-warning">
                            ${generateStarIcons(review.rating)}
                            <span class="text-muted ms-2">${review.rating}/5</span>
                        </div>
                    </div>
                    <p class="card-text">${review.review}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">
                            <i class="far fa-calendar-alt"></i> ${review.date}
                        </small>
                        <a href="https://github.com/${review.reviewer}" 
                           target="_blank" 
                           class="btn btn-sm btn-outline-secondary">
                            <i class="fab fa-github"></i> Profile
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function generateStarIcons(rating) {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
}

function displayError() {
    document.getElementById('reviews-container').innerHTML = `
        <div class="col-12">
            <div class="alert alert-danger">
                Failed to load reviews. Please try again later.
                <button onclick="location.reload()" class="btn btn-sm btn-outline-danger ms-2">
                    <i class="fas fa-sync-alt"></i> Retry
                </button>
            </div>
        </div>
    `;
}

function getBookId() {
    return new URLSearchParams(window.location.search).get('id');
}
