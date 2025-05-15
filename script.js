// Main Script for Sakura Tours Website
document.addEventListener('DOMContentLoaded', function() {
    // Navigation menu toggle for mobile
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');

    burger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    // Scroll animations for elements
    window.addEventListener('scroll', function() {
        animateOnScroll();
    });

    // Initialize animations on page load
    animateOnScroll();
    createCherryBlossomEffect();
    
    // Set up theme switcher
    setupThemeSwitcher();
    
    // Form validation and localStorage
    setupFormValidation();
    
    // Load saved form data if exists
    loadSavedFormData();
});

// Animate elements when they come into view
function animateOnScroll() {
    // Animate itinerary items
    const itineraryItems = document.querySelectorAll('.itinerary li');
    itineraryItems.forEach((item, index) => {
        const itemPosition = item.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (itemPosition < screenPosition) {
            // Add delay based on index for cascading effect
            setTimeout(() => {
                item.classList.add('animate');
            }, index * 100);
        }
    });
    
    // Animate table container
    const tableContainer = document.querySelector('.table-container');
    if (tableContainer) {
        const tablePosition = tableContainer.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (tablePosition < screenPosition) {
            tableContainer.classList.add('animate');
        }
    }
}

// Create falling cherry blossom petals effect
function createCherryBlossomEffect() {
    const hero = document.querySelector('.hero');
    const numberOfPetals = 30;
    
    for (let i = 0; i < numberOfPetals; i++) {
        createPetal(hero);
    }
}

function createPetal(parent) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    
    // Random size between 5px and 15px
    const size = Math.random() * 10 + 5;
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    
    // Random starting position
    const startPositionX = Math.random() * 100;
    petal.style.left = `${startPositionX}%`;
    petal.style.top = '-20px';
    
    // Add to the DOM
    parent.appendChild(petal);
    
    // Animate the petal falling
    animatePetal(petal);
}

function animatePetal(petal) {
    // Duration between 7 and 15 seconds
    const duration = Math.random() * 8000 + 7000;
    // Random horizontal movement
    const endPositionX = parseInt(petal.style.left) + (Math.random() * 40 - 20);
    
    // Create animation
    const animation = petal.animate([
        { 
            top: '-20px',
            left: petal.style.left,
            opacity: Math.random() * 0.5 + 0.3,
            transform: `rotate(${Math.random() * 360}deg)`
        },
        { 
            top: '100%',
            left: `${endPositionX}%`,
            opacity: 0,
            transform: `rotate(${Math.random() * 360 + 360}deg)`
        }
    ], {
        duration: duration,
        easing: 'linear',
        iterations: 1
    });
    
    // When animation completes, remove petal and create a new one
    animation.onfinish = () => {
        petal.remove();
        createPetal(document.querySelector('.hero'));
    };
}

// Form validation and localStorage functionality
function setupFormValidation() {
    const tourForm = document.getElementById('tourForm');
    
    if (tourForm) {
        // Save form data on input change
        const formInputs = tourForm.querySelectorAll('input, select');
        formInputs.forEach(input => {
            input.addEventListener('change', saveFormData);
        });
        
        // Password confirmation validation
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', checkPasswordMatch);
        }
        
        // Form submission
        tourForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                showSuccessMessage();
                clearFormData();
                tourForm.reset();
            }
        });
    }
}

// Check if passwords match
function checkPasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorMessage = document.getElementById('passwordError');
    
    if (errorMessage) {
        if (password !== confirmPassword) {
            errorMessage.style.display = 'block';
            return false;
        } else {
            errorMessage.style.display = 'none';
            return true;
        }
    }
    return true;
}

// Validate the entire form
function validateForm() {
    // Basic validation - can be expanded based on requirements
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value) {
            isValid = false;
            highlightField(field);
        } else {
            resetField(field);
        }
    });
    
    // Check password match
    if (!checkPasswordMatch()) {
        isValid = false;
    }
    
    return isValid;
}

// Highlight invalid field
function highlightField(field) {
    field.style.borderColor = '#ff3860';
    field.style.boxShadow = '0 0 5px rgba(255, 56, 96, 0.3)';
}

// Reset field styling
function resetField(field) {
    field.style.borderColor = '#ddd';
    field.style.boxShadow = 'none';
}

// Show success message
function showSuccessMessage() {
    // Check if success message already exists
    let successMessage = document.querySelector('.form-success');
    
    if (!successMessage) {
        // Create success message
        successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Your booking has been confirmed! You will receive an email confirmation shortly.';
        
        // Insert before the form
        const form = document.getElementById('tourForm');
        form.parentNode.insertBefore(successMessage, form);
    }
    
    // Display the message
    successMessage.style.display = 'block';
    
    // Show notification
    showNotification('Booking confirmed! Thank you for choosing Sakura Tours.');
    
    // Hide after 5 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}

// Show floating notification
function showNotification(message) {
    // Create notification if it doesn't exist
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.classList.add('show');
    
    // Hide after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// Save form data to localStorage
function saveFormData() {
    const formData = {};
    const formInputs = document.getElementById('tourForm').querySelectorAll('input:not([type="password"]), select');
    
    formInputs.forEach(input => {
        if (input.type === 'radio' || input.type === 'checkbox') {
            if (input.checked) {
                if (!formData[input.name]) {
                    formData[input.name] = [];
                }
                formData[input.name].push(input.value);
            }
        } else {
            formData[input.name] = input.value;
        }
    });
    
    localStorage.setItem('sakuraTourFormData', JSON.stringify(formData));
}

// Load saved form data from localStorage
function loadSavedFormData() {
    const savedData = localStorage.getItem('sakuraTourFormData');
    
    if (savedData) {
        const formData = JSON.parse(savedData);
        const form = document.getElementById('tourForm');
        
        if (form) {
            // Fill text inputs and selects
            Object.keys(formData).forEach(key => {
                const input = form.querySelector(`[name="${key}"]:not([type="radio"]):not([type="checkbox"])`);
                if (input) {
                    input.value = formData[key];
                }
                
                // Handle radio buttons and checkboxes
                const radioCheckboxes = form.querySelectorAll(`[name="${key}"][type="radio"], [name="${key}"][type="checkbox"]`);
                radioCheckboxes.forEach(element => {
                    if (Array.isArray(formData[key])) {
                        if (formData[key].includes(element.value)) {
                            element.checked = true;
                        }
                    } else if (element.value === formData[key]) {
                        element.checked = true;
                    }
                });
            });
            
            // Show reminder notification
            showNotification('Your form data has been restored from your previous session.');
        }
    }
}

// Clear saved form data
function clearFormData() {
    localStorage.removeItem('sakuraTourFormData');
}
