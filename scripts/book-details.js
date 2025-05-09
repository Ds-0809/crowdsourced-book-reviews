document.addEventListener('DOMContentLoaded', async () => {
    const bookId = getBookId();
    if (!bookId) {
        window.location.href = '../index.html';
        return;
    }

    await loadBookDetails(bookId);
    await loadReviews(bookId);
});

async function loadReviews(bookId) {
    const container = document.getElementById('reviews-container');
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
        const response = await fetch(`https://api.github.com/repos/Ds-0809/crowdsourced-book-reviews/contents/reviews`);
        const files = await response.json();

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

