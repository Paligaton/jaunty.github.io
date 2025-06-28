// Events Calendar Application - Main JavaScript Module

class EventsApp {
    constructor() {
        this.events = [];
        this.filteredEvents = [];
        this.displayedEvents = [];
        this.currentPage = 0;
        this.eventsPerPage = 20;
        this.categories = new Set();
        this.isLoading = true;
        
        this.searchQuery = '';
        this.filters = {
            dateFrom: '',
            dateTo: '',
            categories: new Set(),
            freeOnly: false,
            hasDiscounts: false
        };

        this.init();
    }

    async init() {
        this.showLoadingSpinner();
        this.bindEvents();
        await this.loadData();
        this.setupUI();
        this.applyFilters();
    }

    bindEvents() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', this.toggleTheme.bind(this));
        
        // Filter toggle (mobile)
        document.getElementById('filterToggle').addEventListener('click', this.toggleFilters.bind(this));
        
        // Search
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch(e);
            }
        });

        // Filter controls
        document.getElementById('dateFrom').addEventListener('change', this.handleFilterChange.bind(this));
        document.getElementById('dateTo').addEventListener('change', this.handleFilterChange.bind(this));
        document.getElementById('freeEventsOnly').addEventListener('change', this.handleFilterChange.bind(this));
        document.getElementById('hasDiscounts').addEventListener('change', this.handleFilterChange.bind(this));
        document.getElementById('clearFilters').addEventListener('click', this.clearFilters.bind(this));

        // Load more button
        document.getElementById('loadMoreBtn').addEventListener('click', this.loadMoreEvents.bind(this));

        // Modal controls
        document.getElementById('closeModal').addEventListener('click', this.closeModal.bind(this));
        document.getElementById('closeContactModal').addEventListener('click', this.closeContactModal.bind(this));
        document.getElementById('eventModal').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal__overlay')) {
                this.closeModal();
            }
        });
        document.getElementById('contactModal').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal__overlay')) {
                this.closeContactModal();
            }
        });

        // Floating action button
        document.getElementById('addEventBtn').addEventListener('click', this.showContactModal.bind(this));

        // Keyboard accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeContactModal();
            }
        });

        // Infinite scroll
        window.addEventListener('scroll', this.debounce(this.handleScroll.bind(this), 100));
    }

    showLoadingSpinner() {
        const spinner = document.getElementById('loadingSpinner');
        spinner.style.display = 'flex';
    }

    hideLoadingSpinner() {
        const spinner = document.getElementById('loadingSpinner');
        spinner.style.display = 'none';
    }

    async loadData() {
        this.events = this.getDemoData();
        this.extractCategories();
        this.isLoading = false;
        this.hideLoadingSpinner();
    }

    getDemoData() {
        // Demo data for testing purposes
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        return [
            {
                id: 1,
                title: 'Концерт классической музыки',
                description: 'Вечер классической музыки с произведениями Баха, Моцарта и Бетховена в исполнении Ереванского симфонического оркестра.',
                date: tomorrow,
                time: '19:00',
                place: 'Ереванский оперный театр',
                address: 'пл. Свободы, 1, Ереван',
                category: 'Музыка',
                isFree: false,
                discounts: 'Скидка 20% для студентов',
                link: 'https://t.me/yerevan_events',
                linkToBuy: 'https://example.com/buy',
                linkToRegistration: '',
                image: ''
            },
            {
                id: 2,
                title: 'Выставка современного искусства',
                description: 'Новая выставка работ современных армянских художников. Представлены картины, скульптуры и инсталляции.',
                date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
                time: '10:00',
                place: 'Национальная галерея Армении',
                address: 'ул. Арама, 1, Ереван',
                category: 'Искусство',
                isFree: true,
                discounts: '',
                link: 'https://t.me/yerevan_events',
                linkToBuy: '',
                linkToRegistration: 'https://example.com/register',
                image: ''
            },
            {
                id: 3,
                title: 'Спектакль "Гамлет"',
                description: 'Классическая драма Шекспира в постановке Ереванского театра им. Сундукяна.',
                date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
                time: '20:00',
                place: 'Театр им. Сундукяна',
                address: 'ул. Теряна, 7, Ереван',
                category: 'Театр',
                isFree: false,
                discounts: '',
                link: 'https://t.me/yerevan_events',
                linkToBuy: 'https://example.com/buy',
                linkToRegistration: '',
                image: ''
            },
            {
                id: 4,
                title: 'Джазовый фестиваль',
                description: 'Международный джазовый фестиваль с участием известных музыкантов из разных стран.',
                date: nextWeek,
                time: '18:00',
                place: 'Парк Ахтанак',
                address: 'ул. Маршала Баграмяна, Ереван',
                category: 'Музыка',
                isFree: true,
                discounts: '',
                link: 'https://t.me/yerevan_events',
                linkToBuy: '',
                linkToRegistration: 'https://example.com/register',
                image: ''
            },
            {
                id: 5,
                title: 'Кулинарный мастер-класс',
                description: 'Изучаем традиционную армянскую кухню: долма, хаш, лаваш и другие национальные блюда.',
                date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
                time: '14:00',
                place: 'Кулинарная школа "Арарат"',
                address: 'ул. Абовяна, 10, Ереван',
                category: 'Кулинария',
                isFree: false,
                discounts: 'Скидка 15% при записи за неделю',
                link: 'https://t.me/yerevan_events',
                linkToBuy: 'https://example.com/buy',
                linkToRegistration: '',
                image: ''
            }
        ];
    }

    processEventData(rawData) {
        return rawData
            .map((row, index) => {
                // Skip rows without required fields
                if (!row.Title || !row.DateValue) {
                    return null;
                }

                const event = {
                    id: index,
                    title: row.Title || '',
                    description: row.Description || '',
                    date: this.parseDate(row.DateValue, row.TimeValue),
                    time: row.TimeValue || '00:00',
                    place: row.place || '',
                    address: row.address || '',
                    category: row['Категория'] || 'Другое',
                    isFree: Boolean(row['Бесплатно']),
                    discounts: row['Скидки'] || '',
                    link: row.link || '',
                    linkToBuy: row.linkToBuy || '',
                    linkToRegistration: row.linkToRegistarion || '',
                    image: this.processImageUrl(row.image || '')
                };

                return event;
            })
            .filter(event => event !== null)
            .filter(event => event.date >= new Date()) // Only future events
            .sort((a, b) => a.date - b.date); // Sort by date ascending
    }

    parseDate(dateValue, timeValue = '00:00') {
        try {
            let dateStr = dateValue;
            
            // Handle different date formats
            if (typeof dateValue === 'number') {
                // Excel date serial number
                const excelEpoch = new Date(1900, 0, 1);
                const date = new Date(excelEpoch.getTime() + (dateValue - 2) * 24 * 60 * 60 * 1000);
                dateStr = date.toISOString().split('T')[0];
            }

            const [hours = '00', minutes = '00'] = timeValue.split(':');
            const combinedDateTime = `${dateStr}T${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
            
            return new Date(combinedDateTime);
        } catch (error) {
            console.error('Ошибка парсинга даты:', error);
            return new Date();
        }
    }

    processImageUrl(imageUrl) {
        if (!imageUrl) return '';
        
        // Convert Google Drive links to direct image URLs
        const driveMatch = imageUrl.match(/file\/d\/([a-zA-Z0-9_-]+)/);
        if (driveMatch) {
            return `https://drive.google.com/uc?id=${driveMatch[1]}`;
        }
        
        return imageUrl;
    }

    extractCategories() {
        this.categories.clear();
        this.events.forEach(event => {
            if (event.category) {
                this.categories.add(event.category);
            }
        });
    }

    setupUI() {
        this.renderCategoryFilters();
        this.applyFilters();
    }

    renderCategoryFilters() {
        const container = document.getElementById('categoryFilters');
        container.innerHTML = '';

        Array.from(this.categories).sort().forEach(category => {
            const label = document.createElement('label');
            label.className = 'checkbox-label';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = category;
            checkbox.addEventListener('change', () => this.handleCategoryFilter(checkbox));
            
            const checkmark = document.createElement('span');
            checkmark.className = 'checkmark';
            
            label.appendChild(checkbox);
            label.appendChild(checkmark);
            label.appendChild(document.createTextNode(category));
            
            container.appendChild(label);
        });
    }

    handleCategoryFilter(checkbox) {
        if (checkbox.checked) {
            this.filters.categories.add(checkbox.value);
        } else {
            this.filters.categories.delete(checkbox.value);
        }
        this.applyFilters();
    }

    handleSearch(e) {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.applyFilters();
    }

    handleFilterChange() {
        this.filters.dateFrom = document.getElementById('dateFrom').value;
        this.filters.dateTo = document.getElementById('dateTo').value;
        this.filters.freeOnly = document.getElementById('freeEventsOnly').checked;
        this.filters.hasDiscounts = document.getElementById('hasDiscounts').checked;
        this.applyFilters();
    }

    applyFilters() {
        this.filteredEvents = this.events.filter(event => {
            // Search filter
            if (this.searchQuery) {
                const searchText = `${event.title} ${event.description} ${event.place}`.toLowerCase();
                if (!searchText.includes(this.searchQuery)) {
                    return false;
                }
            }

            // Date range filter
            if (this.filters.dateFrom) {
                const fromDate = new Date(this.filters.dateFrom);
                if (event.date < fromDate) {
                    return false;
                }
            }

            if (this.filters.dateTo) {
                const toDate = new Date(this.filters.dateTo);
                toDate.setHours(23, 59, 59, 999); // End of day
                if (event.date > toDate) {
                    return false;
                }
            }

            // Category filter
            if (this.filters.categories.size > 0) {
                if (!this.filters.categories.has(event.category)) {
                    return false;
                }
            }

            // Free events filter
            if (this.filters.freeOnly && !event.isFree) {
                return false;
            }

            // Has discounts filter
            if (this.filters.hasDiscounts && !event.discounts) {
                return false;
            }

            return true;
        });

        this.currentPage = 0;
        this.displayedEvents = [];
        this.loadMoreEvents();
    }

    loadMoreEvents() {
        const startIndex = this.currentPage * this.eventsPerPage;
        const endIndex = startIndex + this.eventsPerPage;
        const newEvents = this.filteredEvents.slice(startIndex, endIndex);

        this.displayedEvents.push(...newEvents);
        this.currentPage++;

        this.renderEvents();
        this.updateLoadMoreButton();
    }

    renderEvents() {
        const container = document.getElementById('eventsGrid');
        const emptyState = document.getElementById('emptyState');

        if (this.displayedEvents.length === 0) {
            container.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');

        if (this.currentPage === 1) {
            container.innerHTML = '';
        }

        this.displayedEvents.slice((this.currentPage - 1) * this.eventsPerPage).forEach(event => {
            const eventCard = this.createEventCard(event);
            container.appendChild(eventCard);
        });
    }

    createEventCard(event) {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.addEventListener('click', () => this.showEventDetail(event));

        const formattedDate = this.formatDate(event.date);
        const badges = this.createEventBadges(event);

        card.innerHTML = `
            <div class="event-card__image">
                ${event.image ? 
                    `<img src="${event.image}" alt="${event.title}" onerror="this.parentElement.innerHTML='<div class=\\"event-card__placeholder\\">📅</div>'">` :
                    '<div class="event-card__placeholder">📅</div>'
                }
            </div>
            <div class="event-card__content">
                <div class="event-card__header">
                    <h3 class="event-card__title">${event.title}</h3>
                    <div class="event-card__datetime">${formattedDate}</div>
                    <div class="event-card__place">${event.place}</div>
                </div>
                <div class="event-card__badges">
                    ${badges}
                </div>
            </div>
        `;

        return card;
    }

    createEventBadges(event) {
        let badges = '';

        if (event.category) {
            badges += `<span class="event-badge event-badge--category">${event.category}</span>`;
        }

        if (event.isFree) {
            badges += `<span class="event-badge event-badge--free">Бесплатно</span>`;
        }

        if (event.discounts) {
            badges += `<span class="event-badge event-badge--discount">Скидки</span>`;
        }

        return badges;
    }

    showEventDetail(event) {
        const modal = document.getElementById('eventModal');
        const detailContainer = document.getElementById('eventDetail');

        const formattedDate = this.formatDate(event.date);
        const mapUrl = this.generateMapUrl(event.address);

        detailContainer.innerHTML = `
            <div class="event-detail__image">
                ${event.image ? 
                    `<img src="${event.image}" alt="${event.title}" onerror="this.style.display='none'">` :
                    ''
                }
            </div>
            <div class="event-detail__header">
                <h2 class="event-detail__title">${event.title}</h2>
                <div class="event-detail__meta">
                    <div class="event-detail__meta-item">
                        <span class="event-detail__meta-label">Дата и время</span>
                        <span class="event-detail__meta-value">${formattedDate}</span>
                    </div>
                    <div class="event-detail__meta-item">
                        <span class="event-detail__meta-label">Место</span>
                        <span class="event-detail__meta-value">${event.place}</span>
                    </div>
                    <div class="event-detail__meta-item">
                        <span class="event-detail__meta-label">Адрес</span>
                        <span class="event-detail__meta-value">${event.address}</span>
                    </div>
                    <div class="event-detail__meta-item">
                        <span class="event-detail__meta-label">Категория</span>
                        <span class="event-detail__meta-value">${event.category}</span>
                    </div>
                    ${event.isFree ? `
                    <div class="event-detail__meta-item">
                        <span class="event-detail__meta-label">Стоимость</span>
                        <span class="event-detail__meta-value">Бесплатно</span>
                    </div>
                    ` : ''}
                    ${event.discounts ? `
                    <div class="event-detail__meta-item">
                        <span class="event-detail__meta-label">Скидки</span>
                        <span class="event-detail__meta-value">${event.discounts}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
            ${event.description ? `
            <div class="event-detail__description">
                <p>${event.description}</p>
            </div>
            ` : ''}
            ${event.address ? `
            <div class="event-detail__map">
                <iframe src="${mapUrl}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
            ` : ''}
            <div class="event-detail__actions">
                ${event.link ? `<a href="${event.link}" target="_blank" class="btn btn--primary">Открыть в Telegram</a>` : ''}
                ${event.linkToBuy ? `<a href="${event.linkToBuy}" target="_blank" class="btn btn--secondary">Купить билет</a>` : ''}
                ${event.linkToRegistration ? `<a href="${event.linkToRegistration}" target="_blank" class="btn btn--secondary">Регистрация</a>` : ''}
                <button onclick="app.addToCalendar(${event.id})" class="btn btn--outline">Добавить в календарь</button>
            </div>
        `;

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('eventModal');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    showContactModal() {
        const modal = document.getElementById('contactModal');
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeContactModal() {
        const modal = document.getElementById('contactModal');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    addToCalendar(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        const startDate = new Date(event.date);
        const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours duration

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Yerevan Afisha//Event//RU',
            'BEGIN:VEVENT',
            `UID:${event.id}@afisha.am`,
            `DTSTART:${this.formatDateForICS(startDate)}`,
            `DTEND:${this.formatDateForICS(endDate)}`,
            `SUMMARY:${event.title}`,
            `DESCRIPTION:${event.description}`,
            `LOCATION:${event.place}, ${event.address}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    formatDateForICS(date) {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    }

    generateMapUrl(address) {
        if (!address) return '';
        const encodedAddress = encodeURIComponent(`${address}, Yerevan, Armenia`);
        return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dO0G1lOm9g-y5E&q=${encodedAddress}`;
    }

    formatDate(date) {
        const options = {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('ru-RU', options);
    }

    updateLoadMoreButton() {
        const button = document.getElementById('loadMoreBtn');
        const container = document.getElementById('loadMoreContainer');
        
        if (this.displayedEvents.length >= this.filteredEvents.length) {
            container.style.display = 'none';
        } else {
            container.style.display = 'flex';
        }
    }

    clearFilters() {
        // Reset form controls
        document.getElementById('dateFrom').value = '';
        document.getElementById('dateTo').value = '';
        document.getElementById('freeEventsOnly').checked = false;
        document.getElementById('hasDiscounts').checked = false;
        document.getElementById('searchInput').value = '';

        // Reset category checkboxes
        document.querySelectorAll('#categoryFilters input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });

        // Reset internal state
        this.searchQuery = '';
        this.filters = {
            dateFrom: '',
            dateTo: '',
            categories: new Set(),
            freeOnly: false,
            hasDiscounts: false
        };

        this.applyFilters();
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        
        const themeIcon = document.querySelector('.theme-icon');
        themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }

    toggleFilters() {
        const filterPanel = document.getElementById('filterPanel');
        filterPanel.classList.toggle('mobile-hidden');
    }

    handleScroll() {
        const scrollPosition = window.innerHeight + window.scrollY;
        const documentHeight = document.documentElement.offsetHeight;
        
        if (scrollPosition >= documentHeight - 1000) {
            if (this.displayedEvents.length < this.filteredEvents.length) {
                this.loadMoreEvents();
            }
        }
    }

    showError(message) {
        this.hideLoadingSpinner();
        const container = document.getElementById('eventsGrid');
        container.innerHTML = `
            <div class="empty-state">
                <h3>Ошибка</h3>
                <p>${message}</p>
            </div>
        `;
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the application
const app = new EventsApp();