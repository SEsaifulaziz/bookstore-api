// Bookstore Admin API Frontend Client

const API_BASE = '/api/v1';

// Global state variables
let currentBookPage = 0;
let currentBookSize = 6;
let currentBookSort = 'title';
let currentBookSearch = '';

let currentUserPage = 0;
let currentUserSize = 6;

// Debouncing for search
let searchDebounceTimeout = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initModals();
    initForms();
    initSearch();
    loadDashboardData();
});

// Toast System
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} glass-panel`;
    
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    
    container.appendChild(toast);
    
    // Auto-remove toast
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);
}

// Tab Swapping Logic
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const targetEl = document.getElementById(targetTab);
            if (targetEl) targetEl.classList.add('active');
            
            // Reload specific tab data on active
            if (targetTab === 'tab-books') {
                loadBooks();
            } else if (targetTab === 'tab-users') {
                loadUsers();
            } else if (targetTab === 'tab-relations') {
                loadRelationsDropdowns();
            }
        });
    });
}

// Modal Toggle Logic
function initModals() {
    // Book Modal Elements
    const modalBook = document.getElementById('modal-book');
    const btnAddBook = document.getElementById('btn-add-book');
    const btnBookClose = document.getElementById('modal-book-close');
    const btnBookCancel = document.getElementById('btn-book-cancel');
    
    // User Modal Elements
    const modalUser = document.getElementById('modal-user');
    const btnAddUser = document.getElementById('btn-add-user');
    const btnUserClose = document.getElementById('modal-user-close');
    const btnUserCancel = document.getElementById('btn-user-cancel');

    // Open/Close Book Modal
    btnAddBook.addEventListener('click', () => {
        document.getElementById('modal-book-title').innerText = 'Add New Book';
        document.getElementById('form-book').reset();
        document.getElementById('book-id').value = '';
        clearValidationState(document.getElementById('form-book'));
        
        // Set default published date to today
        document.getElementById('book-published').value = new Date().toISOString().split('T')[0];
        
        modalBook.classList.add('active');
    });

    [btnBookClose, btnBookCancel].forEach(btn => {
        btn.addEventListener('click', () => modalBook.classList.remove('active'));
    });

    // Open/Close User Modal
    btnAddUser.addEventListener('click', () => {
        document.getElementById('form-user').reset();
        clearValidationState(document.getElementById('form-user'));
        modalUser.classList.add('active');
    });

    [btnUserClose, btnUserCancel].forEach(btn => {
        btn.addEventListener('click', () => modalUser.classList.remove('active'));
    });

    // Close on overlay click
    window.addEventListener('click', (e) => {
        if (e.target === modalBook) modalBook.classList.remove('active');
        if (e.target === modalUser) modalUser.classList.remove('active');
    });
}

// Clear HTML5 validation CSS classes
function clearValidationState(form) {
    const controls = form.querySelectorAll('.form-control');
    controls.forEach(ctrl => {
        ctrl.classList.remove('is-invalid');
    });
}

// Search and Sorting Event Listeners
function initSearch() {
    const searchInput = document.getElementById('search-book-title');
    const sortSelect = document.getElementById('sort-books');

    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchDebounceTimeout);
        searchDebounceTimeout = setTimeout(() => {
            currentBookSearch = e.target.value.trim();
            currentBookPage = 0;
            loadBooks();
        }, 400); // 400ms debounce
    });

    sortSelect.addEventListener('change', (e) => {
        currentBookSort = e.target.value;
        currentBookPage = 0;
        loadBooks();
    });
}

// Global Form Submissions
function initForms() {
    const formBook = document.getElementById('form-book');
    const formUser = document.getElementById('form-user');
    const formAssociation = document.getElementById('form-association');

    // Submit Book (Create or Edit)
    formBook.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm(formBook)) return;

        const bookId = document.getElementById('book-id').value;
        const bookData = {
            title: document.getElementById('book-title').value.trim(),
            author: document.getElementById('book-author').value.trim(),
            price: parseFloat(document.getElementById('book-price').value),
            isbn: document.getElementById('book-isbn').value.trim(),
            publishedDate: document.getElementById('book-published').value
        };

        const isEdit = !!bookId;
        const url = isEdit ? `${API_BASE}/books/${bookId}` : `${API_BASE}/books`;
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookData)
            });

            if (response.ok) {
                showToast(`Book successfully ${isEdit ? 'updated' : 'created'}!`, 'success');
                document.getElementById('modal-book').classList.remove('active');
                loadBooks();
                loadDashboardData();
            } else {
                const errData = await response.json();
                handleFormErrors(formBook, errData);
            }
        } catch (err) {
            console.error(err);
            showToast('Network error: Failed to connect to server.', 'error');
        }
    });

    // Submit User (Register)
    formUser.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm(formUser)) return;

        const userData = {
            name: document.getElementById('user-name').value.trim(),
            email: document.getElementById('user-email').value.trim()
        };

        try {
            const response = await fetch(`${API_BASE}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                showToast('User profile registered successfully!', 'success');
                document.getElementById('modal-user').classList.remove('active');
                loadUsers();
                loadDashboardData();
            } else {
                const errData = await response.json();
                handleFormErrors(formUser, errData);
            }
        } catch (err) {
            console.error(err);
            showToast('Network error: Failed to connect to server.', 'error');
        }
    });

    // Submit Book/User association
    formAssociation.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userId = document.getElementById('assoc-user-select').value;
        const bookId = document.getElementById('assoc-book-select').value;

        if (!userId || !bookId) {
            showToast('Please select both a user and a book.', 'error');
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/users/${userId}/books/${bookId}`, {
                method: 'PUT'
            });

            if (response.ok) {
                showToast('Book successfully assigned to user!', 'success');
                formAssociation.reset();
                loadDashboardData();
            } else {
                const errData = await response.json();
                showToast(errData.message || 'Failed to establish book association.', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Network error: Failed to establish association.', 'error');
        }
    });
}

// Client-Side validation check
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('[required], [minlength], [maxlength], [min], [max]');

    inputs.forEach(input => {
        input.classList.remove('is-invalid');
        
        // Basic HTML5 Validity Checks
        if (!input.checkValidity()) {
            input.classList.add('is-invalid');
            isValid = false;
        }
        
        // Custom check for Positive Price
        if (input.id === 'book-price' && parseFloat(input.value) <= 0) {
            input.classList.add('is-invalid');
            isValid = false;
        }

        // Custom ISBN check (must be length 10 or 13)
        if (input.id === 'book-isbn') {
            const isbnVal = input.value.trim();
            if (isbnVal.length !== 10 && isbnVal.length !== 13) {
                input.classList.add('is-invalid');
                isValid = false;
            }
        }
    });

    return isValid;
}

// Handle errors returned by GlobalExceptionHandler
function handleFormErrors(form, errorResponse) {
    if (errorResponse.message) {
        showToast(errorResponse.message, 'error');
    }
    
    // Spring Boot Validation Field Errors
    if (errorResponse.errors && Array.isArray(errorResponse.errors)) {
        errorResponse.errors.forEach(err => {
            // Match backend field names to HTML form fields
            const inputField = form.querySelector(`[id$="${err.field}"]`) || form.querySelector(`[id*="${err.field}"]`);
            if (inputField) {
                inputField.classList.add('is-invalid');
                const feedback = inputField.nextElementSibling;
                if (feedback && feedback.classList.contains('invalid-feedback')) {
                    feedback.innerText = err.defaultMessage;
                }
            }
        });
        showToast('Validation errors occurred. Please correct the fields.', 'error');
    }
}

// Load Top Stats row
async function loadDashboardData() {
    try {
        // Fetch raw pages with minimal size to get total elements in pagination metadata
        const [booksRes, usersRes] = await Promise.all([
            fetch(`${API_BASE}/books?size=1`),
            fetch(`${API_BASE}/users?size=1`)
        ]);

        if (booksRes.ok && usersRes.ok) {
            const booksData = await booksRes.json();
            const usersData = await usersRes.json();

            const totalBooks = booksData.totalElements || 0;
            const totalUsers = usersData.totalElements || 0;

            document.getElementById('stats-books').innerText = totalBooks;
            document.getElementById('stats-users').innerText = totalUsers;

            // Compute associations (sum up ownedBookIds sizes across users)
            // Fetch users (up to a larger size to compute loan stats)
            const allUsersRes = await fetch(`${API_BASE}/users?size=500`);
            if (allUsersRes.ok) {
                const allUsersData = await allUsersRes.json();
                let loansCount = 0;
                if (allUsersData.content) {
                    allUsersData.content.forEach(u => {
                        if (u.ownedBookIds) {
                            loansCount += u.ownedBookIds.length;
                        }
                    });
                }
                document.getElementById('stats-loans').innerText = loansCount;
            }
        }
    } catch (err) {
        console.error('Error fetching dashboard stats:', err);
    }
}

// Load Paginated Books list
async function loadBooks() {
    const grid = document.getElementById('books-grid-container');
    const pagination = document.getElementById('books-pagination-container');
    
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem;"><i class="fa-solid fa-spinner fa-spin fa-2x" style="color: var(--accent-indigo);"></i><p style="margin-top: 1rem; color: var(--text-secondary);">Loading books catalog...</p></div>';

    let url = `${API_BASE}/books?page=${currentBookPage}&size=${currentBookSize}&sortBy=${currentBookSort}`;
    if (currentBookSearch) {
        url += `&title=${encodeURIComponent(currentBookSearch)}`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('API return error');
        
        const data = await response.json();
        
        if (!data.content || data.content.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <i class="fa-solid fa-book-open"></i>
                    <h3>No Books Found</h3>
                    <p>${currentBookSearch ? 'Try adjusting your search criteria.' : 'Create your first book using the Add Book button.'}</p>
                </div>
            `;
            pagination.innerHTML = '';
            return;
        }

        grid.innerHTML = '';
        data.content.forEach(book => {
            const card = document.createElement('div');
            card.className = 'glass-panel book-card';
            
            // Format price
            const price = typeof book.price === 'number' ? `$${book.price.toFixed(2)}` : `$${book.price}`;
            
            card.innerHTML = `
                <div class="book-card-header">
                    <h3 class="book-title" title="${escapeHtml(book.title)}">${escapeHtml(book.title)}</h3>
                    <span class="book-price">${price}</span>
                </div>
                <div class="book-author">
                    <i class="fa-solid fa-pen-nib"></i> ${escapeHtml(book.author)}
                </div>
                <div class="book-details">
                    <div>
                        <span>ISBN:</span>
                        <span>${escapeHtml(book.isbn)}</span>
                    </div>
                    <div>
                        <span>Published:</span>
                        <span>${book.publishedDate}</span>
                    </div>
                </div>
                <div class="book-actions">
                    <button class="btn btn-secondary btn-icon btn-edit" data-id="${book.id}" title="Edit details">
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button class="btn btn-danger btn-icon btn-delete" data-id="${book.id}" title="Remove Book">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });

        // Add Edit & Delete event listeners
        grid.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => openEditBookModal(btn.getAttribute('data-id')));
        });

        grid.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => deleteBook(btn.getAttribute('data-id')));
        });

        // Render Pagination buttons
        renderPagination(data, 'books', (pageIndex) => {
            currentBookPage = pageIndex;
            loadBooks();
        });

    } catch (err) {
        console.error(err);
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem;"><i class="fa-solid fa-triangle-exclamation fa-2x" style="color: var(--accent-rose);"></i><p style="margin-top: 1rem; color: var(--accent-rose);">Failed to load books. Please check server connection.</p></div>';
    }
}

// Edit Book Action (Prepopulate modal)
async function openEditBookModal(bookId) {
    try {
        const response = await fetch(`${API_BASE}/books/${bookId}`);
        if (!response.ok) throw new Error('Could not retrieve book details');
        
        const book = await response.json();
        
        // Fill form fields
        document.getElementById('modal-book-title').innerText = 'Edit Book Details';
        document.getElementById('book-id').value = book.id;
        document.getElementById('book-title').value = book.title;
        document.getElementById('book-author').value = book.author;
        document.getElementById('book-price').value = book.price;
        document.getElementById('book-isbn').value = book.isbn;
        document.getElementById('book-published').value = book.publishedDate;
        
        clearValidationState(document.getElementById('form-book'));
        document.getElementById('modal-book').classList.add('active');
    } catch (err) {
        console.error(err);
        showToast('Error loading book details.', 'error');
    }
}

// Delete Book Action
async function deleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/books/${bookId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showToast('Book deleted successfully.', 'success');
            loadBooks();
            loadDashboardData();
        } else {
            const errData = await response.json();
            showToast(errData.message || 'Failed to delete book.', 'error');
        }
    } catch (err) {
        console.error(err);
        showToast('Network error: Failed to delete book.', 'error');
    }
}

// Load Paginated Users list
async function loadUsers() {
    const grid = document.getElementById('users-grid-container');
    const pagination = document.getElementById('users-pagination-container');
    
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem;"><i class="fa-solid fa-spinner fa-spin fa-2x" style="color: var(--accent-indigo);"></i><p style="margin-top: 1rem; color: var(--text-secondary);">Loading users directory...</p></div>';

    try {
        const response = await fetch(`${API_BASE}/users?page=${currentUserPage}&size=${currentUserSize}`);
        if (!response.ok) throw new Error('API return error');
        
        const data = await response.json();
        
        if (!data.content || data.content.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <i class="fa-solid fa-user-xmark"></i>
                    <h3>No Users Found</h3>
                    <p>Register your first user profile using the Register User button.</p>
                </div>
            `;
            pagination.innerHTML = '';
            return;
        }

        grid.innerHTML = '';
        data.content.forEach(user => {
            const card = document.createElement('div');
            card.className = 'glass-panel user-card';
            
            const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
            const booksCount = user.ownedBookIds ? user.ownedBookIds.length : 0;
            
            card.innerHTML = `
                <div class="user-profile">
                    <div class="user-avatar">${initials}</div>
                    <div class="user-meta">
                        <h3>${escapeHtml(user.name)}</h3>
                        <p>${escapeHtml(user.email)}</p>
                    </div>
                </div>
                <div class="user-books-count">
                    Owned Books: <strong>${booksCount}</strong>
                </div>
            `;
            grid.appendChild(card);
        });

        // Render Pagination buttons
        renderPagination(data, 'users', (pageIndex) => {
            currentUserPage = pageIndex;
            loadUsers();
        });

    } catch (err) {
        console.error(err);
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem;"><i class="fa-solid fa-triangle-exclamation fa-2x" style="color: var(--accent-rose);"></i><p style="margin-top: 1rem; color: var(--accent-rose);">Failed to load users directory. Please check server connection.</p></div>';
    }
}

// Populate Dropdown Menus in relations tab
async function loadRelationsDropdowns() {
    const userSelect = document.getElementById('assoc-user-select');
    const bookSelect = document.getElementById('assoc-book-select');

    userSelect.innerHTML = '<option value="" disabled selected>Loading users...</option>';
    bookSelect.innerHTML = '<option value="" disabled selected>Loading books...</option>';

    try {
        // Fetch up to 500 records to populate association selection dropdowns
        const [usersRes, booksRes] = await Promise.all([
            fetch(`${API_BASE}/users?size=500`),
            fetch(`${API_BASE}/books?size=500&sortBy=title`)
        ]);

        if (usersRes.ok && booksRes.ok) {
            const usersData = await usersRes.json();
            const booksData = await booksRes.json();

            // Populate Users
            userSelect.innerHTML = '<option value="" disabled selected>Choose a user...</option>';
            if (usersData.content && usersData.content.length > 0) {
                usersData.content.forEach(u => {
                    const count = u.ownedBookIds ? u.ownedBookIds.length : 0;
                    userSelect.innerHTML += `<option value="${u.id}">${escapeHtml(u.name)} (${escapeHtml(u.email)}) [${count} books]</option>`;
                });
            } else {
                userSelect.innerHTML = '<option value="" disabled>No registered users found</option>';
            }

            // Populate Books
            bookSelect.innerHTML = '<option value="" disabled selected>Choose a book...</option>';
            if (booksData.content && booksData.content.length > 0) {
                booksData.content.forEach(b => {
                    bookSelect.innerHTML += `<option value="${b.id}">${escapeHtml(b.title)} by ${escapeHtml(b.author)} ($${b.price})</option>`;
                });
            } else {
                bookSelect.innerHTML = '<option value="" disabled>No books available in catalog</option>';
            }
        }
    } catch (err) {
        console.error(err);
        showToast('Error populating dropdown options.', 'error');
    }
}

// Shared Pagination Builder Helper
function renderPagination(pageData, prefix, onPageClick) {
    const container = document.getElementById(`${prefix}-pagination-container`);
    if (!container) return;

    if (pageData.totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    const current = pageData.number;
    const total = pageData.totalPages;
    
    let html = '';
    
    // Prev Button
    html += `<button class="btn btn-secondary btn-icon" ${current === 0 ? 'disabled' : ''} onclick="window._handlePageEvent('${prefix}', ${current - 1})">
        <i class="fa-solid fa-angle-left"></i>
    </button>`;
    
    // Page Info
    html += `<span class="page-info">Page <strong>${current + 1}</strong> of ${total}</span>`;
    
    // Next Button
    html += `<button class="btn btn-secondary btn-icon" ${current === total - 1 ? 'disabled' : ''} onclick="window._handlePageEvent('${prefix}', ${current + 1})">
        <i class="fa-solid fa-angle-right"></i>
    </button>`;
    
    container.innerHTML = html;
    
    // Attach event callback globally for onclick access
    if (!window._pageCallbacks) window._pageCallbacks = {};
    window._pageCallbacks[prefix] = onPageClick;
}

// Global page change dispatcher
window._handlePageEvent = function(prefix, targetPage) {
    if (window._pageCallbacks && window._pageCallbacks[prefix]) {
        window._pageCallbacks[prefix](targetPage);
    }
};

// Basic HTML Sanitizer to prevent XSS injection
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
