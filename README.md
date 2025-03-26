# Resizer-img

A responsive static website for resizing images, built with HTML, CSS, and JavaScript.

## Overview

Resizer-img is a client-side image resizing tool that allows users to upload, resize, and download images without sending any data to a server. All processing happens directly in the browser, ensuring privacy and security.

## Features

- Drag-and-drop or file selection for image uploading
- Custom width and height inputs with aspect ratio maintenance option
- Preset size options for common dimensions (Small, Medium, Large, Square, Instagram, Facebook)
- Image preview before and after resizing
- File size and dimension information display
- Secure client-side processing (no server uploads)
- Responsive design that works on all devices

## Project Structure

```
├── index.html              # Homepage with image processor
├── about.html              # About page describing the service
├── contact.html            # Contact page with form and info
├── css/
│   └── style.css           # Main stylesheet for all pages
├── js/
│   ├── imageProcessor.js   # Core image processing functionality
│   └── script.js           # General website functionality
└── README.md               # This file
```

## Technical Implementation

### HTML Structure

The project uses semantic HTML5 elements and is structured with:
- Header with navigation
- Main content sections
- Footer with copyright information

### CSS Features

- CSS Variables for consistent styling
- Flexbox and Grid layouts
- Responsive design with media queries
- Modern transitions and effects

### JavaScript Functionality

The JavaScript code is split into two main files:

1. **script.js**:
   - Page navigation highlighting
   - Mobile navigation setup
   - Notification system 
   - Utility functions

2. **imageProcessor.js**:
   - File handling (drag-and-drop, file selection)
   - Image resizing using HTML5 Canvas
   - Dimension control with aspect ratio maintenance
   - Preset size selection
   - File download functionality
   - Size estimation and formatting

## Browser Compatibility

Resizer-img works on all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## License

© 2025 Rishav Srivastava - All Rights Reserved

This project and its content are the exclusive property of Rishav Srivastava and are protected by copyright laws. Unauthorized copying, redistribution, or use of any part of this project without express written permission from Rishav Srivastava is strictly prohibited.

For permissions or inquiries, please contact Rishav Srivastava.