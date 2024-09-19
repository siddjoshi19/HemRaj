// Smooth scrolling for navigation
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Handling form submission
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const confirmationMessage = document.getElementById('confirmationMessage');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from refreshing the page

        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        fetch('/submit-contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.text())
        .then(text => {
            confirmationMessage.style.display = 'block'; // Show confirmation message
            form.reset(); // Clear the form
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an issue submitting your form. Please try again.');
        });
    });
});
