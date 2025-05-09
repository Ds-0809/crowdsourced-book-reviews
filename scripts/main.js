async function loadReviews() {
    const response = await fetch('https://api.github.com/repos/[your-username]/book-reviews/contents/reviews');
    const files = await response.json();
    
    files.forEach(async file => {
        const reviewData = await fetch(file.download_url).then(res => res.json());
        console.log(reviewData); // Display this in HTML
    });
}
loadReviews();
