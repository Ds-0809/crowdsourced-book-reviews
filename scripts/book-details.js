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
        const response = await fetch(`https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/contents/reviews`);
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
