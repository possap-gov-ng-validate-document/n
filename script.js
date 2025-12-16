// Page Navigation Functions
function showDocumentInfo() {
    // Navigate to the document info page
    window.location.href = 'validate-document/PSS08180000755370';
}

function showValidationForm() {
    // Hide document info page
    const validationPage = document.getElementById('validation-page');
    const documentInfoPage = document.getElementById('document-info-page');
    
    if (validationPage && documentInfoPage) {
        documentInfoPage.classList.remove('active');
        validationPage.classList.add('active');
        
        // Update progress indicator
        updateProgressIndicator('validation');
    }
}

function updateProgressIndicator(currentStep) {
    const steps = document.querySelectorAll('.step');
    
    steps.forEach(step => {
        step.classList.remove('completed', 'current');
    });
    
    if (currentStep === 'validation') {
        steps[0].classList.add('completed');
        steps[1].classList.remove('current');
    } else if (currentStep === 'document-info') {
        steps[0].classList.add('completed');
        steps[1].classList.add('current');
    }
}

// Form Validation
function validateApprovalNumber() {
    const input = document.querySelector('.approval-input');
    const proceedBtn = document.querySelector('.proceed-btn');
    
    if (input && proceedBtn) {
        const value = input.value.trim();
        
        // Basic validation - check if it looks like a POSSAP approval number
        const possapPattern = /^PSS\d{14}$/;
        
        if (value && possapPattern.test(value)) {
            proceedBtn.disabled = false;
            proceedBtn.style.backgroundColor = '#28428C';
        } else {
            proceedBtn.disabled = true;
            proceedBtn.style.backgroundColor = '#999999';
        }
    }
}

// Input formatting for approval number
function formatApprovalNumber(input) {
    let value = input.value.replace(/\D/g, ''); // Remove non-digits
    let formatted = '';
    
    if (value.length > 0) {
        formatted = 'PSS' + value.slice(0, 14);
    }
    
    input.value = formatted;
    validateApprovalNumber();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Check if coming from demo page
    const demoNumber = localStorage.getItem('demoApprovalNumber');
    if (demoNumber) {
        const approvalInput = document.querySelector('.approval-input');
        if (approvalInput) {
            approvalInput.value = demoNumber;
            validateApprovalNumber();
        }
        localStorage.removeItem('demoApprovalNumber');
    }
    // Approval number input formatting
    const approvalInput = document.querySelector('.approval-input');
    if (approvalInput) {
        approvalInput.addEventListener('input', function() {
            formatApprovalNumber(this);
        });
        
        approvalInput.addEventListener('keypress', function(e) {
            // Only allow digits after 'PSS'
            if (this.value.length >= 3 && !/\d/.test(e.key)) {
                e.preventDefault();
            }
        });
    }
    
    // Proceed button click handler
    const proceedBtn = document.querySelector('.proceed-btn');
    if (proceedBtn) {
        proceedBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const approvalNumber = approvalInput.value.trim();
            
            if (approvalNumber && approvalNumber.length === 17) {
                showDocumentInfo();
            } else {
                alert('Please enter a valid approval number (PSS followed by 14 digits)');
            }
        });
    }
    
    // Help links click handlers - only for "what is this" links
    const helpLinks = document.querySelectorAll('.help-link');
    helpLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default for "what is this" links, allow "Click here" to work normally
            if (this.textContent.includes('what is this')) {
                e.preventDefault();
                alert('A POSSAP Approval Number is a unique identifier for approved police services. It starts with "PSS" followed by 14 digits.');
            }
            // For "Click here" links, let them navigate normally (no preventDefault)
        });
    });
    
    // Floating chat click handler
    const floatingChat = document.querySelector('.floating-chat');
    if (floatingChat) {
        floatingChat.addEventListener('click', function() {
            alert('Chat support is currently unavailable. Please contact us through the Contact page for assistance.');
        });
    }
    
    // Login button click handler - removed since login links now work directly
    // The login links are now <a> tags that navigate to https://possap.gov.ng/p/login
    
    // Navigation links click handlers
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only handle local navigation for Validate Document
            if (this.href.includes('index.html') || this.href === '#') {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Handle local navigation
                if (this.textContent.trim() === 'Validate Document') {
                    showValidationForm();
                }
            }
            // External links will open in new tab automatically due to target="_blank"
        });
    });
    
    // Initialize the page
    updateProgressIndicator('validation');
    validateApprovalNumber();
});

// Utility Functions
function generateSampleApprovalNumber() {
    const prefix = 'PSS';
    const digits = '0123456789';
    let number = '';
    
    for (let i = 0; i < 14; i++) {
        number += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    
    return prefix + number;
}

// For demonstration purposes - populate with sample data
function populateSampleData() {
    const approvalInput = document.querySelector('.approval-input');
    if (approvalInput && !approvalInput.value) {
        approvalInput.value = 'PSS08180000755480';
        validateApprovalNumber();
    }
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Enter key on approval input
    if (e.key === 'Enter' && e.target.classList.contains('approval-input')) {
        const proceedBtn = document.querySelector('.proceed-btn');
        if (proceedBtn && !proceedBtn.disabled) {
            proceedBtn.click();
        }
    }
    
    // Escape key to go back to validation form
    if (e.key === 'Escape') {
        const documentInfoPage = document.getElementById('document-info-page');
        if (documentInfoPage && documentInfoPage.classList.contains('active')) {
            showValidationForm();
        }
    }
});

// Smooth scrolling for better UX
function smoothScrollToElement(element) {
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Auto-focus on input when validation page loads
function focusApprovalInput() {
    const approvalInput = document.querySelector('.approval-input');
    if (approvalInput && document.getElementById('validation-page').classList.contains('active')) {
        approvalInput.focus();
    }
}

// Initialize focus when page becomes active
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            if (mutation.target.classList.contains('active')) {
                setTimeout(focusApprovalInput, 100);
            }
        }
    });
});

// Observe the validation page for class changes
const validationPage = document.getElementById('validation-page');
if (validationPage) {
    observer.observe(validationPage, { attributes: true });
}
