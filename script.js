document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. MOBILE NAVIGATION --- */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-links a');

    // Toggle menu saat klik hamburger
    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Animasi hamburger (opsional, bisa ditambah CSS)
            hamburger.classList.toggle('open');
        });
    }

    // Tutup menu saat link diklik
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    /* --- 2. THEME TOGGLE (DARK/LIGHT) --- */
    const themeBtn = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Cek LocalStorage
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);

    if(themeBtn) {
        themeBtn.addEventListener('click', () => {
            const oldTheme = html.getAttribute('data-theme');
            const newTheme = oldTheme === 'light' ? 'dark' : 'light';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    /* --- 3. SCROLL ACTIVE LINK --- */
    // Agar link di navbar menyala sesuai posisi scroll
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
});

/* --- 4. ACCORDION FUNCTION --- */
// Fungsi dipanggil langsung dari onclick di HTML
function toggleChapters(elementId, btnElement) {
    const list = document.getElementById(elementId);
    
    if (list) {
        // Toggle class 'show' pada list
        list.classList.toggle('show');
        
        // Toggle class 'active' pada tombol (untuk putar panah)
        btnElement.classList.toggle('active');
    }
}

/* =========================================
   LIVE FOOTER MONITOR (Time & Network)
   ========================================= */

function initFooterMonitor() {
    const timeDisplay = document.getElementById('localTime');
    const connStatus = document.getElementById('connectionStatus');
    const connLabel = connStatus ? connStatus.querySelector('.monitor-label') : null;

    // 1. Fungsi Jam Digital
    if (timeDisplay) {
        function updateTime() {
            const now = new Date();
            // Format HH:MM:SS
            const timeString = now.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            timeDisplay.textContent = timeString;
        }
        setInterval(updateTime, 1000); // Update setiap detik
        updateTime(); // Jalan langsung saat load
    }

    // 2. Fungsi Deteksi Network (Online/Offline)
    if (connStatus && connLabel) {
        function updateNetworkStatus() {
            if (navigator.onLine) {
                connStatus.classList.remove('offline');
                connLabel.textContent = "ONLINE";
                connLabel.style.color = ""; // Reset warna
            } else {
                connStatus.classList.add('offline');
                connLabel.textContent = "OFFLINE";
                // Optional: Alert atau Log
                console.log("Connection Lost");
            }
        }

        // Event Listeners bawaan browser
        window.addEventListener('online', updateNetworkStatus);
        window.addEventListener('offline', updateNetworkStatus);
        
        // Cek status awal
        updateNetworkStatus();
    }
}

// Panggil fungsi saat halaman siap
document.addEventListener('DOMContentLoaded', initFooterMonitor);

/* =========================================
   BATTERY STATUS MONITOR
   ========================================= */

function initBatteryMonitor() {
    const batteryLevel = document.getElementById('batteryLevel');
    const batteryIcon = document.getElementById('batteryIcon');
    
    // Cek apakah browser mendukung Battery API
    if ('getBattery' in navigator) {
        navigator.getBattery().then(function(battery) {
            
            function updateBatteryUI() {
                // Update Persentase
                const level = Math.round(battery.level * 100);
                batteryLevel.textContent = `PWR: ${level}%`;
                
                // Reset Classes
                batteryIcon.className = '';
                
                // Update Icon & Warna berdasarkan status
                if (battery.charging) {
                    batteryIcon.innerHTML = '<i class="fas fa-bolt"></i>';
                    batteryIcon.classList.add('battery-charging');
                    batteryLevel.textContent += ' [CHG]';
                } else if (level <= 20) {
                    batteryIcon.innerHTML = '<i class="fas fa-battery-quarter"></i>';
                    batteryIcon.classList.add('battery-low');
                } else if (level <= 50) {
                    batteryIcon.innerHTML = '<i class="fas fa-battery-half"></i>';
                    batteryIcon.classList.add('battery-med');
                } else {
                    batteryIcon.innerHTML = '<i class="fas fa-battery-full"></i>';
                    batteryIcon.classList.add('battery-high');
                }
            }

            // Jalankan update pertama kali
            updateBatteryUI();

            // Dengarkan perubahan status baterai
            battery.addEventListener('levelchange', updateBatteryUI);
            battery.addEventListener('chargingchange', updateBatteryUI);
        });
    } else {
        // Fallback jika browser tidak support (misal Firefox desktop lama/Safari)
        if(batteryLevel) {
            batteryLevel.textContent = "SYS: READY";
            batteryIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
            batteryIcon.style.color = '#10B981';
        }
    }
}

// Panggil fungsi ini saat load
document.addEventListener('DOMContentLoaded', initBatteryMonitor);