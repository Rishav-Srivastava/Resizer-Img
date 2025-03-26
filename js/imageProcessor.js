// Image processing functionality for the Resizer-img application

// Global variables to store image data
let originalImage = null;
let originalWidth = 0;
let originalHeight = 0;
let originalImageSize = 0;

// Initialize the image processor when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const fileInput = document.getElementById('fileInput');
    const dropArea = document.getElementById('drop-area');
    const previewContainer = document.getElementById('preview-container');
    const previewImage = document.getElementById('preview-image');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const maintainRatioCheckbox = document.getElementById('maintain-ratio');
    const resizeBtn = document.getElementById('resize-btn');
    const downloadBtn = document.getElementById('download-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultContainer = document.getElementById('result-container');
    const resultImage = document.getElementById('result-image');
    const originalSizeEl = document.getElementById('original-size');
    const newSizeEl = document.getElementById('new-size');
    const newDimensionsEl = document.getElementById('new-dimensions');
    const presetSizeButtons = document.querySelectorAll('.preset-size-btn');
    
    // Only initialize if we're on a page with the image processor
    if (!fileInput) return;
    
    // Set up event listeners for the file input
    fileInput.addEventListener('change', handleFileSelect);
    
    // Set up drag and drop event listeners
    dropArea.addEventListener('dragover', handleDragOver);
    dropArea.addEventListener('dragleave', handleDragLeave);
    dropArea.addEventListener('drop', handleDrop);
    dropArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    // Set up event listeners for the dimension inputs
    widthInput.addEventListener('input', function() {
        if (maintainRatioCheckbox.checked && originalImage) {
            const aspectRatio = originalWidth / originalHeight;
            heightInput.value = Math.round(widthInput.value / aspectRatio);
        }
    });
    
    heightInput.addEventListener('input', function() {
        if (maintainRatioCheckbox.checked && originalImage) {
            const aspectRatio = originalWidth / originalHeight;
            widthInput.value = Math.round(heightInput.value * aspectRatio);
        }
    });
    
    // Set up event listeners for preset size buttons
    presetSizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!originalImage) {
                showNotification('Please upload an image first.', 'error');
                return;
            }
            
            const width = parseInt(this.dataset.width);
            const height = parseInt(this.dataset.height);
            
            // Update the width and height inputs
            widthInput.value = width;
            
            if (maintainRatioCheckbox.checked) {
                // Calculate height based on aspect ratio
                const aspectRatio = originalWidth / originalHeight;
                heightInput.value = Math.round(width / aspectRatio);
            } else {
                heightInput.value = height;
            }
            
            // Apply a subtle highlight effect to show which preset was selected
            presetSizeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Set up event listeners for the resize button
    resizeBtn.addEventListener('click', resizeImage);
    
    // Set up event listeners for the download button
    downloadBtn.addEventListener('click', downloadImage);
    
    // Set up event listeners for the reset button
    resetBtn.addEventListener('click', resetProcessor);
});

/**
 * Handles file selection from the file input
 * @param {Event} e - The change event
 */
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
}

/**
 * Handles dragging over the drop area
 * @param {Event} e - The dragover event
 */
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.add('highlight');
}

/**
 * Handles dragging leaving the drop area
 * @param {Event} e - The dragleave event
 */
function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.remove('highlight');
}

/**
 * Handles dropping a file on the drop area
 * @param {Event} e - The drop event
 */
function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.remove('highlight');
    
    const dt = e.dataTransfer;
    const file = dt.files[0];
    
    if (file) {
        processFile(file);
    }
}

/**
 * Processes the selected or dropped file
 * @param {File} file - The file to process
 */
function processFile(file) {
    // Check if the file is an image
    if (!file.type.match('image.*')) {
        showNotification('Please select an image file.', 'error');
        return;
    }
    
    // Store the original file size
    originalImageSize = file.size;
    
    // Create a file reader to read the image
    const reader = new FileReader();
    
    reader.onload = function(e) {
        // Create a new image object to get the dimensions
        const img = new Image();
        img.onload = function() {
            // Store the original image and dimensions
            originalImage = img;
            originalWidth = img.width;
            originalHeight = img.height;
            
            // Update the preview image
            document.getElementById('preview-image').src = e.target.result;
            document.getElementById('preview-container').style.display = 'block';
            
            // Set the width and height inputs
            document.getElementById('width').value = img.width;
            document.getElementById('height').value = img.height;
            
            // Update the original size display
            document.getElementById('original-size').textContent = formatFileSize(originalImageSize);
            
            // Hide the result container if it's visible
            document.getElementById('result-container').style.display = 'none';
        };
        
        img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
}

/**
 * Resizes the image based on the user's input
 */
function resizeImage() {
    if (!originalImage) {
        showNotification('Please upload an image first.', 'error');
        return;
    }
    
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    
    const newWidth = parseInt(widthInput.value);
    const newHeight = parseInt(heightInput.value);
    
    // Validate the input
    if (isNaN(newWidth) || isNaN(newHeight) || newWidth <= 0 || newHeight <= 0) {
        showNotification('Please enter valid dimensions.', 'error');
        return;
    }
    
    // Create a canvas element to resize the image
    const canvas = document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;
    
    // Draw the image on the canvas
    const ctx = canvas.getContext('2d');
    ctx.drawImage(originalImage, 0, 0, newWidth, newHeight);
    
    // Get the new image as a data URL
    const resizedImageDataUrl = canvas.toDataURL('image/png');
    
    // Update the result image
    const resultImage = document.getElementById('result-image');
    resultImage.src = resizedImageDataUrl;
    
    // Update the result info
    document.getElementById('new-dimensions').textContent = `${newWidth} x ${newHeight}`;
    
    // Estimate the new file size (this is an approximation since we can't know the exact size without saving the file)
    const newSize = estimateFileSize(resizedImageDataUrl);
    document.getElementById('new-size').textContent = formatFileSize(newSize);
    
    // Show the result container
    document.getElementById('result-container').style.display = 'block';
}

/**
 * Downloads the resized image
 */
function downloadImage() {
    const resultImage = document.getElementById('result-image');
    
    if (!resultImage.src || resultImage.src === '') {
        showNotification('Please resize an image first.', 'error');
        return;
    }
    
    // Create a link element and trigger a download
    const link = document.createElement('a');
    link.href = resultImage.src;
    link.download = 'resizer-img (Rishav).png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Resets the image processor
 */
function resetProcessor() {
    // Reset the global variables
    originalImage = null;
    originalWidth = 0;
    originalHeight = 0;
    originalImageSize = 0;
    
    // Reset the input elements
    document.getElementById('fileInput').value = '';
    document.getElementById('width').value = '';
    document.getElementById('height').value = '';
    document.getElementById('maintain-ratio').checked = true;
    
    // Reset preset size buttons
    const presetSizeButtons = document.querySelectorAll('.preset-size-btn');
    presetSizeButtons.forEach(btn => btn.classList.remove('active'));
    
    // Reset the preview and result containers
    document.getElementById('preview-image').src = '';
    document.getElementById('preview-container').style.display = 'none';
    document.getElementById('result-image').src = '';
    document.getElementById('result-container').style.display = 'none';
    
    // Reset the info elements
    document.getElementById('original-size').textContent = '0 KB';
    document.getElementById('new-size').textContent = '0 KB';
    document.getElementById('new-dimensions').textContent = '0 x 0';
}

/**
 * Estimates the file size of a data URL
 * @param {string} dataUrl - The data URL to estimate
 * @returns {number} - The estimated file size in bytes
 */
function estimateFileSize(dataUrl) {
    // Remove the data URL prefix
    const base64 = dataUrl.split(',')[1];
    
    // Calculate the size in bytes
    const sizeInBytes = Math.ceil((base64.length * 3) / 4);
    
    return sizeInBytes;
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
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '1000';
        notification.style.maxWidth = '300px';
        notification.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
    }
    
    // Set the message and type
    notification.textContent = message;
    
    // Set the background color based on the type
    if (type === 'success') {
        notification.style.backgroundColor = '#28a745';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#dc3545';
        notification.style.color = 'white';
    } else {
        notification.style.backgroundColor = '#007bff';
        notification.style.color = 'white';
    }
    
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
