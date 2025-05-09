document.addEventListener('DOMContentLoaded', async () => {
  const bookId = getBookIdFromURL();
  if (!bookId) return;
  
  await loadAndDisplayReviews(bookId);
  setupSorting();
});

function getBookIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function loadAndDisplayReviews(bookId) {
  try {
    // Show loading state
    document.getElementById('reviews-container').innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading reviews...</p>
      </div>
    `;
    
    // Fetch reviews from GitHub
    const reviews = await fetchReviews(bookId);
    
    // Display reviews or show empty state
    if (reviews.length > 0) {
      displayReviews(reviews);
    } else {
      document.getElementById('reviews-container').classList.add('hidden');
      document.getElementById('no-reviews').classList.remove('hidden');
    }
  } catch (error) {
    console.error('Error loading reviews:', error);
    document.getElementById('reviews-container').innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Failed to load reviews. Please try again later.</p>
        <button onclick="location.reload()">Retry</button>
      </div>
    `;
  }
}

async function fetchReviews(bookId) {
  // In a real implementation, fetch from your GitHub repo
  // For now, using mock data
  return [
    {
      id: 'review1',
      bookId: bookId,
      reviewer: 'booklover42',
      rating: 5,
      review: 'This book completely changed my perspective on magic systems in literature. Rowling\'s world-building is unparalleled!',
      date: '2023-10-15',
      likes: 24
    },
    {
      id: 'review2',
      bookId: bookId,
      reviewer: 'literaryfan',
      rating: 4,
      review: 'A wonderful introduction to the wizarding world. The characters are memorable, though the pacing slows in the middle.',
      date: '2023-09-28',
      likes: 12
    }
  ];
}

function displayReviews(reviews) {
  const container = document.getElementById('reviews-container');
  container.innerHTML = '';
  
  reviews.forEach(review => {
    const reviewElement = document.createElement('div');
    reviewElement.className = 'review-card';
    reviewElement.innerHTML = `
      <div class="review-header">
        <div class="reviewer-info">
          <img src="https://github.com/${review.reviewer}.png?size=40" 
               alt="${review.reviewer}" 
               class="reviewer-avatar">
          <div>
            <div class="reviewer-name">${review.reviewer}</div>
            <div class="review-date">${formatDate(review.date)}</div>
          </div>
        </div>
        <div class="rating">
          ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
        </div>
      </div>
      <div class="review-content">
        ${review.review}
      </div>
      <div class="review-actions">
        <button onclick="likeReview('${review.id}')">
          <i class="far fa-thumbs-up"></i> Helpful (${review.likes || 0})
        </button>
        <button onclick="reportReview('${review.id}')">
          <i class="far fa-flag"></i> Report
        </button>
      </div>
    `;
    container.appendChild(reviewElement);
  });
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function setupSorting() {
  const sortButtons = document.querySelectorAll('.sort-options button');
  
  sortButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      sortButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');
      
      // Get current reviews
      const reviews = Array.from(document.querySelectorAll('.review-card'));
      const sortMethod = button.dataset.sort;
      
      // Sort reviews
      reviews.sort((a, b) => {
        if (sortMethod === 'newest') {
          return new Date(b.dataset.date) - new Date(a.dataset.date);
        } else if (sortMethod === 'highest') {
          return parseInt(b.dataset.rating) - parseInt(a.dataset.rating);
        } else {
          return parseInt(a.dataset.rating) - parseInt(b.dataset.rating);
        }
      });
      
      // Re-append sorted reviews
      const container = document.getElementById('reviews-container');
      container.innerHTML = '';
      reviews.forEach(review => container.appendChild(review));
    });
  });
}

// Placeholder functions for interaction
function likeReview(reviewId) {
  console.log('Liked review:', reviewId);
  // Implement actual like functionality
}

function reportReview(reviewId) {
  console.log('Reported review:', reviewId);
  // Implement reporting functionality
}
