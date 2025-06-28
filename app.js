// Беспечный Ереван - Main Application JavaScript

class JauntyYerevanApp {
    constructor() {
        this.events = [];
        this.venues = [];
        this.currentTab = 'events';
        this.currentFilter = 'all';
        this.currentVenueFilter = 'all';
        this.selectedDate = null;
        
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.generateVenues();
        this.renderCurrentTab();
    }

    async loadData() {
        // Use the provided JSON data
        this.events = [
            {
                "title": "Первый шахматный турнир",
                "description": "Увлекательный шахматный турнир для всех уровней подготовки. Приходите показать свое мастерство!",
                "date": "2025-06-28",
                "time": "15:00:00",
                "place": "The Shelter",
                "address": "ул. Туманяна, 31/3",
                "category": "Развлечения",
                "free": 1,
                "link": "https://t.me/easygoing_yerevan",
                "image": "",
                "ticket_link": "",
                "registration_link": ""
            },
            {
                "title": "Реактивный \"Обовсёмквиз\"",
                "description": "Командная интеллектуальная игра с веселыми вопросами и отличными призами.",
                "date": "2025-06-29",
                "time": "19:00:00",
                "place": "Letters and Numbers",
                "address": "ул. Абовяна, 12",
                "category": "Развлечения",
                "free": "",
                "link": "https://t.me/easygoing_yerevan",
                "image": "",
                "ticket_link": "",
                "registration_link": ""
            },
            {
                "title": "Арт-вечеринка!",
                "description": "Творческая вечеринка для всех любителей искусства. Рисование, музыка и отличная компания.",
                "date": "2025-06-29",
                "time": "18:00:00",
                "place": "Мастерская АртЛав",
                "address": "ул. Сарьяна, 10",
                "category": "Искусство",
                "free": "",
                "link": "https://t.me/easygoing_yerevan",
                "image": "",
                "ticket_link": "",
                "registration_link": ""
            },
            {
                "title": "Сольный стендап: Наташа Будняк",
                "description": "Яркий стендап-концерт от талантливой комедиантки Наташи Будняк.",
                "date": "2025-06-29",
                "time": "20:00:00",
                "place": "Green room",
                "address": "ул. Туманяна, 31/3",
                "category": "Комедия",
                "free": "",
                "link": "https://t.me/easygoing_yerevan",
                "image": "",
                "ticket_link": "https://ticket-am.com",
                "registration_link": ""
            },
            {
                "title": "Azat Lake: САП прогулка и купание в лагунах",
                "description": "Активный отдых на природе с прогулкой на САП-борде и купанием в живописных лагунах.",
                "date": "2025-06-29",
                "time": "10:00:00",
                "place": "Azat Lake",
                "address": "Озеро Азат",
                "category": "Здоровье",
                "free": "",
                "link": "https://t.me/easygoing_yerevan",
                "image": "",
                "ticket_link": "",
                "registration_link": "https://forms.gle/register"
            },
            {
                "title": "MEETUP сообщества Unicorn Embassy",
                "description": "Встреча предпринимателей и стартаперов для обмена опытом и нетворкинга.",
                "date": "2025-06-30",
                "time": "19:00:00",
                "place": "Letters and Numbers",
                "address": "ул. Абовяна, 12",
                "category": "Бизнес",
                "free": 1,
                "link": "https://t.me/easygoing_yerevan",
                "image": "",
                "ticket_link": "",
                "registration_link": "https://forms.gle/unicorn"
            },
            {
                "title": "Витражи",
                "description": "Мастер-класс по изготовлению витражей. Научитесь создавать красивые произведения искусства своими руками.",
                "date": "2025-07-01",
                "time": "16:00:00",
                "place": "Мастерская АртЛав",
                "address": "ул. Сарьяна, 10",
                "category": "Мастер-класс",
                "free": "",
                "link": "https://t.me/easygoing_yerevan",
                "image": "",
                "ticket_link": "",
                "registration_link": "https://forms.gle/art"
            },
            {
                "title": "Концерт Земфиры в Ереване",
                "description": "Долгожданный концерт легендарной российской певицы Земфиры в Ереване.",
                "date": "2025-07-04",
                "time": "19:00:00",
                "place": "Стадион Раздан",
                "address": "ул. Царав Ахпюр, 1",
                "category": "Концерт",
                "free": "",
                "link": "https://t.me/easygoing_yerevan",
                "image": "",
                "ticket_link": "https://ticket-am.com/zemfira",
                "registration_link": ""
            },
            {
                "title": "LUYS Festival",
                "description": "Многодневный музыкальный фестиваль с участием местных и международных артистов.",
                "date": "2025-07-05",
                "time": "15:00:00",
                "place": "Парк Ахтанак",
                "address": "ул. Маршала Баграмяна",
                "category": "Фестиваль",
                "free": "",
                "link": "https://t.me/easygoing_yerevan",
                "image": "",
                "ticket_link": "https://luys-festival.com",
                "registration_link": ""
            },
            {
                "title": "Siren Jam",
                "description": "Джем-сейшн для музыкантов всех уровней. Приходите играть и слушать живую музыку.",
                "date": "2025-07-06",
                "time": "21:00:00",
                "place": "Green room",
                "address": "ул. Туманяна, 31/3",
                "category": "Музыка",
                "free": 1,
                "link": "https://t.me/easygoing_yerevan",
                "image": "",
                "ticket_link": "",
                "registration_link": ""
            }
        ];

        // Sort events by date
        this.events.sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));
    }

    generateVenues() {
        this.venues = [
            { name: "The Shelter", short: "S", address: "ул. Туманяна, 31/3", hours: "18:00-02:00", tags: ["drink", "dance", "late", "events"] },
            { name: "Letters and Numbers", short: "L&N", address: "ул. Абовяна, 12", hours: "10:00-22:00", tags: ["coffee", "eat", "events"] },
            { name: "Green Room", short: "GR", address: "ул. Туманяна, 31/3", hours: "19:00-02:00", tags: ["drink", "dance", "events", "late"] },
            { name: "Мастерская АртЛав", short: "AL", address: "ул. Сарьяна, 10", hours: "12:00-20:00", tags: ["events"] },
            { name: "Dargett Craft Beer", short: "DCB", address: "ул. Сарьяна, 5", hours: "16:00-01:00", tags: ["drink", "craft", "late"] },
            { name: "Calumet Ethnic Lounge Bar", short: "C", address: "ул. Московская, 15", hours: "18:00-02:00", tags: ["drink", "hookah", "date", "late"] },
            { name: "Pandok", short: "P", address: "ул. Пушкина, 8", hours: "12:00-24:00", tags: ["eat", "drink", "date"] },
            { name: "Bourbon Street", short: "BS", address: "ул. Абовяна, 20", hours: "19:00-03:00", tags: ["drink", "dance", "late"] },
            { name: "Coffee Central", short: "CC", address: "ул. Северный проспект, 2", hours: "07:00-21:00", tags: ["coffee"] },
            { name: "Black Angus", short: "BA", address: "ул. Теряна, 10", hours: "12:00-23:00", tags: ["eat", "burger"] },
            { name: "Wine Republic", short: "WR", address: "ул. Сарьяна, 25", hours: "17:00-01:00", tags: ["drink", "date", "late"] },
            { name: "Jazzve", short: "J", address: "ул. Московская, 3", hours: "08:00-20:00", tags: ["coffee"] }
        ];
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Category filters
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.category));
        });

        // Venue filters
        document.querySelectorAll('.venue-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setVenueFilter(e.target.dataset.filter));
        });

        // Modal controls
        const closeBtn = document.getElementById('close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        const modal = document.getElementById('event-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal__overlay') || e.target.classList.contains('modal')) {
                    this.closeModal();
                }
            });
        }

        // Footer actions
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }

        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareApp());
        }

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    switchTab(tabName) {
        this.currentTab = tabName;
        
        // Update tab buttons
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const activeContent = document.getElementById(`${tabName}-tab`);
        if (activeContent) {
            activeContent.classList.add('active');
        }

        this.renderCurrentTab();
    }

    setFilter(category) {
        this.currentFilter = category;
        
        // Update filter buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-category="${category}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        this.renderEvents();
    }

    setVenueFilter(filter) {
        this.currentVenueFilter = filter;
        
        // Update filter buttons
        document.querySelectorAll('.venue-filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-filter="${filter}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        this.renderVenues();
    }

    renderCurrentTab() {
        switch (this.currentTab) {
            case 'events':
                this.renderEventsTab();
                break;
            case 'venues':
                this.renderVenues();
                break;
            case 'calendar':
                this.renderCalendar();
                break;
        }
    }

    renderEventsTab() {
        this.renderTodayEvents();
        this.renderRecommendations();
        this.renderEvents();
    }

    renderTodayEvents() {
        const today = new Date().toISOString().split('T')[0];
        const todayEvents = this.events.filter(event => event.date === today);
        const container = document.getElementById('today-events');

        if (!container) return;

        if (todayEvents.length === 0) {
            container.innerHTML = '<div class="no-events"><h3>Сегодня событий нет</h3><p>Проверьте завтрашние события</p></div>';
            return;
        }

        container.innerHTML = todayEvents.map(event => this.createEventHTML(event)).join('');
        this.attachEventListeners(container);
    }

    renderRecommendations() {
        const recommendations = [
            {
                title: "The Shelter",
                description: "Скидка 20% на все коктейли до 21:00",
                meta: "Коктейль-бар • ул. Туманяна, 31/3"
            },
            {
                title: "Letters and Numbers",
                description: "Бесплатный кофе при заказе десерта",
                meta: "Кафе • ул. Абовяна, 12"
            },
            {
                title: "Green Room",
                description: "Живая музыка каждую пятницу",
                meta: "Бар • ул. Туманяна, 31/3"
            },
            {
                title: "Dargett Craft Beer",
                description: "Новое крафтовое пиво от местной пивоварни",
                meta: "Крафтовое пиво • ул. Сарьяна, 5"
            }
        ];

        const container = document.getElementById('recommendations');
        if (!container) return;

        container.innerHTML = recommendations.map(rec => `
            <div class="recommendation-item">
                <h3 class="recommendation-item__title">${rec.title}</h3>
                <p class="recommendation-item__description">${rec.description}</p>
                <div class="recommendation-item__meta">${rec.meta}</div>
            </div>
        `).join('');
    }

    renderEvents() {
        let filteredEvents = this.events;
        
        if (this.currentFilter !== 'all') {
            filteredEvents = this.events.filter(event => event.category === this.currentFilter);
        }

        const container = document.getElementById('all-events');
        if (!container) return;
        
        if (filteredEvents.length === 0) {
            container.innerHTML = '<div class="no-events"><h3>События не найдены</h3><p>Попробуйте выбрать другую категорию</p></div>';
            return;
        }

        container.innerHTML = filteredEvents.map(event => this.createEventHTML(event)).join('');
        this.attachEventListeners(container);
    }

    renderVenues() {
        let filteredVenues = this.venues;
        
        if (this.currentVenueFilter !== 'all') {
            filteredVenues = this.venues.filter(venue => venue.tags.includes(this.currentVenueFilter));
        }

        const container = document.getElementById('venues-list');
        if (!container) return;
        
        if (filteredVenues.length === 0) {
            container.innerHTML = '<div class="no-events"><h3>Заведения не найдены</h3><p>Попробуйте выбрать другой фильтр</p></div>';
            return;
        }

        container.innerHTML = filteredVenues.map(venue => `
            <div class="venue-item">
                <div class="venue-item__header">
                    <h3 class="venue-item__name">${venue.name}</h3>
                    <span class="venue-item__short">${venue.short}</span>
                </div>
                <div class="venue-item__address">${venue.address}</div>
                <div class="venue-item__hours">Часы работы: ${venue.hours}</div>
            </div>
        `).join('');
    }

    renderCalendar() {
        // Generate unique dates from events
        const dates = [...new Set(this.events.map(event => event.date))].sort();
        
        const calendarContainer = document.getElementById('calendar-dates');
        if (!calendarContainer) return;

        calendarContainer.innerHTML = dates.map(date => {
            const dateObj = new Date(date + 'T00:00:00');
            const formattedDate = this.formatCalendarDate(dateObj);
            return `
                <div class="calendar-date ${this.selectedDate === date ? 'active' : ''}" data-date="${date}">
                    ${formattedDate}
                </div>
            `;
        }).join('');

        // Add event listeners for date selection
        document.querySelectorAll('.calendar-date').forEach(dateEl => {
            dateEl.addEventListener('click', (e) => {
                document.querySelectorAll('.calendar-date').forEach(d => d.classList.remove('active'));
                e.target.classList.add('active');
                this.selectedDate = e.target.dataset.date;
                this.renderCalendarEvents();
            });
        });

        // Show events for first date by default
        if (dates.length > 0 && !this.selectedDate) {
            this.selectedDate = dates[0];
            const firstDate = document.querySelector('.calendar-date');
            if (firstDate) {
                firstDate.classList.add('active');
            }
        }
        
        this.renderCalendarEvents();
    }

    renderCalendarEvents() {
        if (!this.selectedDate) return;

        const dateEvents = this.events.filter(event => event.date === this.selectedDate);
        const container = document.getElementById('calendar-events');
        if (!container) return;

        if (dateEvents.length === 0) {
            container.innerHTML = '<div class="no-events"><h3>На эту дату событий нет</h3></div>';
            return;
        }

        container.innerHTML = dateEvents.map(event => this.createEventHTML(event)).join('');
        this.attachEventListeners(container);
    }

    createEventHTML(event) {
        const dateTime = this.formatDateTime(event.date, event.time);
        const isFree = event.free == 1;
        
        // Escape quotes and special characters for JSON storage in data attribute
        const eventJson = JSON.stringify(event).replace(/"/g, '&quot;');
        
        return `
            <div class="event-item" data-event="${eventJson}">
                <div class="event-item__header">
                    <h3 class="event-item__title">${event.title}</h3>
                    <div class="event-item__date">${dateTime}</div>
                </div>
                <div class="event-item__meta">
                    <div class="event-item__place">${event.place}</div>
                    <div class="event-item__category">${event.category}</div>
                </div>
                <div class="event-item__description">${event.description}</div>
                <div class="event-item__badges">
                    ${isFree ? '<span class="event-badge event-badge--free">Бесплатно</span>' : ''}
                </div>
            </div>
        `;
    }

    attachEventListeners(container) {
        if (!container) return;
        
        container.querySelectorAll('.event-item').forEach(item => {
            item.addEventListener('click', () => {
                try {
                    const eventJson = item.dataset.event.replace(/&quot;/g, '"');
                    const eventData = JSON.parse(eventJson);
                    this.showEventModal(eventData);
                } catch (error) {
                    console.error('Error parsing event data:', error);
                }
            });
        });
    }

    showEventModal(event) {
        const modal = document.getElementById('event-modal');
        const modalBody = document.getElementById('modal-body');
        
        if (!modal || !modalBody) return;
        
        const dateTime = this.formatDateTime(event.date, event.time);
        const isFree = event.free == 1;
        
        modalBody.innerHTML = `
            <h2>${event.title}</h2>
            <div style="margin-bottom: 20px;">
                <p><strong>Дата и время:</strong> ${dateTime}</p>
                <p><strong>Место:</strong> ${event.place}</p>
                <p><strong>Адрес:</strong> ${event.address}</p>
                <p><strong>Категория:</strong> ${event.category}</p>
                ${isFree ? '<p><strong>Вход:</strong> Бесплатно</p>' : ''}
            </div>
            <div style="margin-bottom: 20px;">
                <p>${event.description}</p>
            </div>
            <div class="event-actions" style="display: flex; gap: 10px; flex-wrap: wrap;">
                ${event.link ? `<a href="${event.link}" target="_blank" class="btn btn--primary">Открыть в Telegram</a>` : ''}
                ${event.ticket_link ? `<a href="${event.ticket_link}" target="_blank" class="btn btn--secondary">Купить билет</a>` : ''}
                ${event.registration_link ? `<a href="${event.registration_link}" target="_blank" class="btn btn--secondary">Регистрация</a>` : ''}
            </div>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('event-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen not supported');
            });
        } else {
            document.exitFullscreen();
        }
    }

    shareApp() {
        if (navigator.share) {
            navigator.share({
                title: 'Беспечный Ереван',
                text: 'Рекомендации заведений и анонсы событий Еревана',
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('Ссылка скопирована в буфер обмена!');
            }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = window.location.href;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('Ссылка скопирована в буфер обмена!');
            });
        }
    }

    formatDateTime(date, time) {
        const dateObj = new Date(date + 'T' + time);
        const options = {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return dateObj.toLocaleDateString('ru-RU', options);
    }

    formatCalendarDate(dateObj) {
        const weekdays = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
        const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        
        const weekday = weekdays[dateObj.getDay()];
        const month = months[dateObj.getMonth()];
        const day = dateObj.getDate();
        const year = dateObj.getFullYear();
        
        return `${weekday}, ${day} ${month} ${year}`;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.jauntyApp = new JauntyYerevanApp();
});