// Main script file for the Resizer-img application

document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation highlighting
    highlightCurrentPage();
    
    // Handle form submissions if on contact page
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! This is a static form for demonstration purposes.');
            this.reset();
        });
    }
    
    // Handle mobile navigation
    setupMobileNavigation();
});

/**
 * Highlights the current page in the navigation
 */
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
    
    // If we're on the home page or the root
    if (currentPage === '' || currentPage === '/' || currentPage === 'index.html') {
        navLinks.forEach(link => {
            if (link.getAttribute('href') === 'index.html') {
                link.classList.add('active');
            }
        });
    }
}

/**
 * Sets up mobile navigation functionality
 * (This is a placeholder for future implementation of a mobile menu toggle)
 */
function setupMobileNavigation() {
    // This would be implemented if we had a hamburger menu
    // For now, our navigation is simple enough to work on mobile
}

/**
 * Displays a notification message to the user
 * @param {string} message - The message to display
 * @param {string} type - The type of message (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set the message and type
    notification.textContent = message;
    notification.className = `notification ${type}`;
    
    // Show the notification
    notification.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

/**
 * Utility function to format file size in a human-readable format
 * @param {number} bytes - The file size in bytes
 * @returns {string} - The formatted file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
