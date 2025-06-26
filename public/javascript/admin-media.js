document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const mediaFilter = document.getElementById('media-filter');
    const mediaSearch = document.getElementById('media-search');
    const mediaGrid = document.querySelector('.media-grid');
    const uploadForm = document.getElementById('upload-form');

    // Initialize
    initEventListeners();
    initMediaCards();

    function initEventListeners() {
        // Filter and search
        if (mediaFilter) mediaFilter.addEventListener('change', filterMedia);
        if (mediaSearch) mediaSearch.addEventListener('input', filterMedia);

        // Upload form
        if (uploadForm) {
            uploadForm.addEventListener('submit', handleUploadSubmit);
        }
    }

    function initMediaCards() {
        const mediaCards = document.querySelectorAll('.media-card');
        if (!mediaCards) return;

        mediaCards.forEach(card => {
            const deleteBtn = card.querySelector('.btn-delete');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handleDeleteMedia(card);
                });
            }
        });
    }

    function filterMedia() {
        const filterValue = mediaFilter ? mediaFilter.value.toLowerCase() : 'all';
        const searchValue = mediaSearch ? mediaSearch.value.toLowerCase() : '';
        const mediaCards = document.querySelectorAll('.media-card');

        mediaCards.forEach(card => {
            const type = card.dataset.type; // 'image' or 'video'
            const filename = card.querySelector('h3')?.textContent.toLowerCase() || '';

            const matchesFilter = filterValue === 'all' ||
                (filterValue === 'images' && type === 'image') ||
                (filterValue === 'videos' && type === 'video');

            const matchesSearch = searchValue === '' || filename.includes(searchValue);

            card.style.display = matchesFilter && matchesSearch ? 'block' : 'none';
        });
    }

    function handleUploadSubmit(e) {
        const filesInput = document.getElementById('media-files');
        if (!filesInput || filesInput.files.length === 0) {
            e.preventDefault();
            showAlert('Please select at least one file to upload.', 'error');
        }
    }

    async function handleDeleteMedia(card) {
        if (!card) return;

        const filename = card.dataset.filename;
        const type = card.dataset.type; // 'image' or 'video'

        if (!filename || !type) {
            showAlert('Missing file information', 'error');
            return;
        }

        if (!confirm('Permanently delete this file?')) return;

        try {
            showAlert('Deleting...', 'info');

            // Convert to directory name expected by backend
            const directory = type === 'image' ? 'images' : 'videos';
            const response = await fetch(`/admin/media/delete?filename=${encodeURIComponent(filename)}&type=${encodeURIComponent(directory)}`, {
                method: 'DELETE',
                headers: { 'Accept': 'application/json' }
            });

            const result = await response.json();

            if (!response.ok) {
                // Enhanced error message from server
                throw new Error(result.message || 'Delete failed');
            }

            // Visual removal
            card.style.transition = 'opacity 0.3s';
            card.style.opacity = '0';
            setTimeout(() => {
                card.remove();
                showAlert('Deleted successfully', 'success');
                updateMediaStats();
            }, 300);

        } catch (error) {
            console.error('Delete error:', error);
            // User-friendly error messages
            const errorMsg = error.message.includes('not found')
                ? 'File not found on server'
                : 'Delete failed. Please try again.';
            showAlert(errorMsg, 'error');
        }
    }

    async function sendDeleteRequest(filename, directory) {
        return await fetch(`/admin/media/delete?filename=${encodeURIComponent(filename)}&type=${encodeURIComponent(directory)}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            }
        });
    }

    function animateCardRemoval(card) {
        card.style.transition = 'opacity 0.3s ease';
        card.style.opacity = '0';
        setTimeout(() => card.remove(), 300);
    }

    function isValidFilename(filename) {
        return /^[\w\-\.]+$/.test(filename) &&
            !filename.includes('..') &&
            !filename.includes('/') &&
            !filename.includes('\\');
    }

    function showAlert(message, type = 'info') {
        // Remove existing alerts
        const existingAlert = document.querySelector('.custom-alert');
        if (existingAlert) existingAlert.remove();

        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = `custom-alert alert-${type}`;
        alertDiv.textContent = message;

        // Style the alert
        Object.assign(alertDiv.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 25px',
            borderRadius: '5px',
            color: 'white',
            zIndex: '1000',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            opacity: '0',
            transition: 'opacity 0.3s ease',
            backgroundColor: getAlertColor(type)
        });

        document.body.appendChild(alertDiv);

        // Animate
        setTimeout(() => alertDiv.style.opacity = '1', 10);
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            setTimeout(() => alertDiv.remove(), 300);
        }, 3000);
    }

    function getAlertColor(type) {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8',
            warning: '#ffc107'
        };
        return colors[type] || '#6c757d';
    }

    function updateMediaStats() {
        const statsElement = document.querySelector('.media-stats');
        if (!statsElement) return;

        const remainingItems = document.querySelectorAll('.media-card:not([style*="display: none"])').length;
        const filterValue = mediaFilter ? mediaFilter.value.toLowerCase() : 'all';

        let message = `Showing ${remainingItems} `;
        message += filterValue === 'images' ? 'images' :
            filterValue === 'videos' ? 'videos' :
                'media items';

        statsElement.textContent = message;
    }
});