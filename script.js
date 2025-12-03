// SimpleTracker Plus - Main Application Logic

class SimpleTracker {
    constructor() {
        this.counter = 0;
        this.logs = [];
        this.initializeElements();
        this.loadFromStorage();
        this.attachEventListeners();
        this.updateUI();
    }

    initializeElements() {
        this.counterElement = document.getElementById('counter');
        this.descriptionInput = document.getElementById('description');
        this.addButton = document.getElementById('addBtn');
        this.resetButton = document.getElementById('resetBtn');
        this.logContainer = document.getElementById('logContainer');
        this.emptyLogMessage = document.getElementById('emptyLogMessage');
    }

    attachEventListeners() {
        // Description input validation
        this.descriptionInput.addEventListener('input', () => {
            this.addButton.disabled = this.descriptionInput.value.trim() === '';
        });

        // Add button click
        this.addButton.addEventListener('click', () => {
            this.addEntry();
        });

        // Reset button click
        this.resetButton.addEventListener('click', () => {
            this.resetAll();
        });

        // Enter key support for description
        this.descriptionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.addButton.disabled) {
                this.addEntry();
            }
        });
    }

    addEntry() {
        const description = this.descriptionInput.value.trim();
        if (description === '') return;

        // Increment counter
        this.counter++;
        
        // Create log entry
        const now = new Date();
        const logEntry = {
            timestamp: now.toISOString(),
            description: description,
            displayDate: now.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
        };

        // Add to logs
        this.logs.unshift(logEntry); // Add to beginning for newest first

        // Update UI
        this.updateUI();

        // Save to localStorage
        this.saveToStorage();

        // Clear description input
        this.descriptionInput.value = '';
        this.addButton.disabled = true;

        // Add focus back to description for quick entry
        this.descriptionInput.focus();
    }

    resetAll() {
        if (confirm('Êtes-vous sûr de vouloir tout réinitialiser ? Cette action est irréversible.')) {
            this.counter = 0;
            this.logs = [];
            this.descriptionInput.value = '';
            this.addButton.disabled = true;
            this.updateUI();
            this.saveToStorage();
        }
    }

    updateUI() {
        // Update counter
        this.counterElement.textContent = this.counter;
        this.counterElement.classList.add('animate-pulse');
        setTimeout(() => this.counterElement.classList.remove('animate-pulse'), 300);

        // Update logs
        this.renderLogs();
    }

    renderLogs() {
        if (this.logs.length === 0) {
            this.emptyLogMessage.style.display = 'block';
            this.logContainer.innerHTML = '';
            this.logContainer.appendChild(this.emptyLogMessage);
            return;
        }

        this.emptyLogMessage.style.display = 'none';
        
        const logsHTML = this.logs.map(log => `
            <div class="log-entry bg-white rounded-lg p-4 border-l-4 border-green-500 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div class="flex-1">
                        <p class="text-gray-800 font-medium">${log.description}</p>
                        <p class="text-gray-500 text-sm mt-1">
                            <i data-feather="calendar" class="w-3 h-3 inline mr-1"></i>
                            ${log.displayDate}
                        </p>
                    </div>
                </div>
            </div>
        `).join('');

        this.logContainer.innerHTML = logsHTML;
        
        // Update feather icons in new content
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    saveToStorage() {
        const data = {
            counter: this.counter,
            logs: this.logs
        };
        localStorage.setItem('simpleTrackerData', JSON.stringify(data));
    }

    loadFromStorage() {
        try {
            const savedData = localStorage.getItem('simpleTrackerData');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.counter = data.counter || 0;
                this.logs = data.logs || [];
            }
        } catch (error) {
            console.error('Error loading data from storage:', error);
            this.counter = 0;
            this.logs = [];
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SimpleTracker();
});