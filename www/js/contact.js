// Contact form handler with EmailJS integration
class ContactManager {
    setupContactForm() {
        console.log('Setting up contact form...');
        // Initialize EmailJS
        emailjs.init('wPBi4S697eYBS1zNh'); // EmailJS public key
        console.log('EmailJS initialized');

        // Find the contact form
        const contactForm = document.querySelector('.contact-form');
        console.log('Contact form found:', contactForm);
        
        // Create form status element if it doesn't exist
        let formStatus = document.getElementById('form-status');
        if (!formStatus) {
            formStatus = document.createElement('div');
            formStatus.id = 'form-status';
            formStatus.className = 'form-status';
            contactForm.insertBefore(formStatus, contactForm.firstChild);
        }

        // Handle button click directly instead of form submission
        const submitButton = document.getElementById('submit-form');
        if (submitButton) {
            console.log('Submit button found, adding click handler');
            
            submitButton.addEventListener('click', (e) => {
                console.log('Submit button clicked');
                e.preventDefault();
                
                // Basic form validation
                const nameField = contactForm.elements.name;
                const emailField = contactForm.elements.email;
                const subjectField = contactForm.elements.subject;
                const messageField = contactForm.elements.message;
                
                if (!nameField.value || !emailField.value || !subjectField.value || !messageField.value) {
                    console.log('Form validation failed');
                    formStatus.textContent = 'Please fill out all required fields.';
                    formStatus.className = 'form-status error';
                    formStatus.style.display = 'block';
                    return false;
                }
                
                // Show loading state
                const originalButtonText = submitButton.textContent;
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
                console.log('Button disabled, showing sending state');
                
                // Get form data
                const formData = {
                    name: nameField.value,
                    email: emailField.value,
                    subject: subjectField.value,
                    message: messageField.value
                };
                
                console.log('Sending email with data:', formData);
                
                // Send email using EmailJS
                emailjs.send('service_tp5cydz', 'template_btg45ki', formData)
                    .then(() => {
                        console.log('Email sent successfully');
                        // // Success
                        // formStatus.textContent = 'Your message has been sent successfully!';
                        // formStatus.className = 'form-status success';
                        // formStatus.style.display = 'block';
                        // contactForm.reset();
                        
                        // // Reset button
                        // submitButton.textContent = originalButtonText;
                        // submitButton.disabled = false;
                        
                        // Scroll to the form status message
                        formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        
                        // Replace form with thank you message after a short delay
                        setTimeout(() => {
                            const formView = document.getElementById('contact-form-view');
                            const thankYouView = document.getElementById('thank-you-view');
                            
                            if (formView && thankYouView) {
                                // Hide form view and show thank you view with animation
                                formView.style.opacity = '0';
                                setTimeout(() => {
                                    formView.style.display = 'none';
                                    thankYouView.style.display = 'block';
                                    setTimeout(() => {
                                        thankYouView.style.opacity = '1';
                                    }, 10);
                                }, 300);
                            }
                        }, 700);
                    })
                    .catch((error) => {
                        console.error('Error sending email:', error);
                        // Error
                        formStatus.textContent = 'Failed to send message. Please try again later.';
                        formStatus.className = 'form-status error';
                        formStatus.style.display = 'block';
                        
                        // Reset button
                        submitButton.textContent = originalButtonText;
                        submitButton.disabled = false;
                    });
            });
        }
    }

    setupFormAnimations() {
        const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
        
        formInputs.forEach(input => {
            // Focus animation
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
            
            // Check for existing values on page load
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });
        
        // Add subtle animation to FAQ items
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('fade-in');
        });
    }
    
    setupPopupInteractions() {
        // Handle back to home button click
        const backToHomeBtn = document.getElementById('back-to-home');
        
        if (backToHomeBtn) {
            console.log('Setting up back to home button click handler');
            backToHomeBtn.addEventListener('click', () => {
                console.log('Back to home button clicked');
                window.location.href = '../index.html';
            });
        }
    }
}

console.log('Contact JS loaded successfully!');
const contactManager = new ContactManager();
contactManager.setupContactForm();
contactManager.setupFormAnimations();
contactManager.setupPopupInteractions();