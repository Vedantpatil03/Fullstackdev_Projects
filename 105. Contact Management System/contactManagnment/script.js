// Contact Management System
class ContactManager {
    constructor() {
        this.contacts = [];
        this.editingId = null;
        this.initializeElements();
        this.loadContacts();
        this.attachEventListeners();
        this.renderContacts();
    }

    initializeElements() {
        this.form = document.getElementById('contactForm');
        this.firstNameInput = document.getElementById('firstName');
        this.lastNameInput = document.getElementById('lastName');
        this.emailInput = document.getElementById('email');
        this.phoneInput = document.getElementById('phone');
        this.addressInput = document.getElementById('address');
        this.companyInput = document.getElementById('company');
        this.submitBtn = document.getElementById('submitBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.contactsList = document.getElementById('contactsList');
        this.searchInput = document.getElementById('searchInput');
        this.contactCount = document.getElementById('contactCount');
    }

    attachEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.cancelBtn.addEventListener('click', () => this.cancelEdit());
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e));
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString();
    }

    // Add or update contact
    handleSubmit(e) {
        e.preventDefault();

        // Validate email format
        if (!this.isValidEmail(this.emailInput.value)) {
            this.showError('Please enter a valid email address');
            return;
        }

        // Validate phone format
        if (!this.isValidPhone(this.phoneInput.value)) {
            this.showError('Please enter a valid phone number');
            return;
        }

        const contactData = {
            firstName: this.firstNameInput.value.trim(),
            lastName: this.lastNameInput.value.trim(),
            email: this.emailInput.value.trim(),
            phone: this.phoneInput.value.trim(),
            address: this.addressInput.value.trim(),
            company: this.companyInput.value.trim()
        };

        if (this.editingId) {
            // Update existing contact
            const index = this.contacts.findIndex(c => c.id === this.editingId);
            if (index !== -1) {
                this.contacts[index] = { ...this.contacts[index], ...contactData };
                this.showSuccess('Contact updated successfully!');
            }
            this.cancelEdit();
        } else {
            // Add new contact
            const newContact = {
                id: this.generateId(),
                ...contactData
            };
            this.contacts.push(newContact);
            this.showSuccess('Contact added successfully!');
        }

        this.form.reset();
        this.saveContacts();
        this.renderContacts();
        this.updateContactCount();
    }

    // Edit contact
    editContact(id) {
        const contact = this.contacts.find(c => c.id === id);
        if (contact) {
            this.firstNameInput.value = contact.firstName;
            this.lastNameInput.value = contact.lastName;
            this.emailInput.value = contact.email;
            this.phoneInput.value = contact.phone;
            this.addressInput.value = contact.address;
            this.companyInput.value = contact.company;
            
            this.editingId = id;
            this.submitBtn.textContent = 'Update Contact';
            this.cancelBtn.style.display = 'inline-block';
            
            // Scroll to form
            document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
            this.firstNameInput.focus();
        }
    }

    // Cancel editing
    cancelEdit() {
        this.form.reset();
        this.editingId = null;
        this.submitBtn.textContent = 'Add Contact';
        this.cancelBtn.style.display = 'none';
    }

    // Delete contact
    deleteContact(id) {
        if (confirm('Are you sure you want to delete this contact?')) {
            this.contacts = this.contacts.filter(c => c.id !== id);
            this.saveContacts();
            this.renderContacts();
            this.updateContactCount();
            this.showSuccess('Contact deleted successfully!');
        }
    }

    // Search contacts
    handleSearch(e) {
        const query = e.target.value.toLowerCase();
        const filtered = this.contacts.filter(contact => {
            const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
            const email = contact.email.toLowerCase();
            return fullName.includes(query) || email.includes(query);
        });

        this.renderContacts(filtered);
        this.updateContactCount(filtered.length);
    }

    // Render contacts
    renderContacts(contactsToRender = this.contacts) {
        this.contactsList.innerHTML = '';

        if (contactsToRender.length === 0) {
            this.contactsList.innerHTML = '<p class="empty-message">No contacts found. Add your first contact above!</p>';
            return;
        }

        contactsToRender.forEach(contact => {
            const card = this.createContactCard(contact);
            this.contactsList.appendChild(card);
        });
    }

    // Create contact card element
    createContactCard(contact) {
        const template = document.getElementById('contactTemplate');
        const clone = template.content.cloneNode(true);

        clone.querySelector('.contact-name').textContent = `${contact.firstName} ${contact.lastName}`;
        clone.querySelector('.contact-email span').textContent = contact.email;
        clone.querySelector('.contact-phone span').textContent = contact.phone;
        
        const addressElement = clone.querySelector('.contact-address');
        const companyElement = clone.querySelector('.contact-company');

        if (contact.address) {
            addressElement.querySelector('span').textContent = contact.address;
            addressElement.style.display = 'block';
        }

        if (contact.company) {
            companyElement.querySelector('span').textContent = contact.company;
            companyElement.style.display = 'block';
        }

        const editBtn = clone.querySelector('.btn-edit');
        const deleteBtn = clone.querySelector('.btn-delete');

        editBtn.addEventListener('click', () => this.editContact(contact.id));
        deleteBtn.addEventListener('click', () => this.deleteContact(contact.id));

        return clone;
    }

    // Update contact count
    updateContactCount(count = this.contacts.length) {
        this.contactCount.textContent = `Total: ${count}`;
    }

    // Validation methods
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        // Simple phone validation - at least 10 digits
        const phoneRegex = /^\d{10,}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    }

    // Show success message
    showSuccess(message) {
        this.showMessage(message, 'success-message');
    }

    // Show error message
    showError(message) {
        this.showMessage(message, 'error-message');
    }

    // Show message utility
    showMessage(message, className) {
        const messageDiv = document.createElement('div');
        messageDiv.className = className;
        messageDiv.textContent = message;
        
        const formSection = document.querySelector('.form-section');
        formSection.insertBefore(messageDiv, formSection.firstChild);

        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // Save contacts to localStorage
    saveContacts() {
        localStorage.setItem('contacts', JSON.stringify(this.contacts));
    }

    // Load contacts from localStorage
    loadContacts() {
        const saved = localStorage.getItem('contacts');
        if (saved) {
            try {
                this.contacts = JSON.parse(saved);
            } catch (error) {
                console.error('Error loading contacts:', error);
                this.contacts = [];
            }
        }
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ContactManager();
});
