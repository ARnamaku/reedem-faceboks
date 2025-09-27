document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================================
    // KONFIGURASI UTAMA - Ubah hadiah dan warna di sini
    // ===================================================================================
    const prizes = [
        { text: 'Try Again', color: '#ee1b1bff', textColor: '#444' },
        { text: '$200', color: '#81c784', textColor: '#fff' }, // Green
        { text: '$10.000', color: '#ffffff', textColor: '#444' },
        { text: 'No Luck', color: '#e57373', textColor: '#fff' }, // Red
        { text: '$50.000', color: '#64b5f6', textColor: '#fff' },   // Blue
        { text: '$35.000', color: '#f06292', textColor: '#fff' }, // Pink
        { text: '$1000', color: '#e2d02aff', textColor: '#444' },   // Yellow
        { text: '$500', color: '#ffd54f', textColor: '#444' }    // Amber
    ];

    // ===================================================================================
    // Elemen dan Variabel Global
    // ===================================================================================
    const wheel = document.getElementById('wheel');
    const wheelLabels = document.getElementById('wheel-labels');
    const spinBtn = document.getElementById('spin-btn');
    const popup = document.getElementById('popup');
    const prizeAmount = document.getElementById('prize-amount');
    const redeemBtn = document.getElementById('redeem-btn'); // Meski sudah jadi link, variabel ini tetap ada
    const confettiCanvas = document.getElementById('confetti-canvas');
    
    const myConfetti = confetti.create(confettiCanvas, { resize: true, useWorker: true });

    const segmentCount = prizes.length;
    const segmentAngle = 360 / segmentCount;
    let isSpinning = false;
    let currentRotation = 0;

    // ===================================================================================
    // Inisialisasi Aplikasi
    // ===================================================================================
    const init = () => {
        buildWheel();
        initializeSliders();
        
        // Cek apakah pengguna sudah pernah spin saat halaman dimuat
        if (localStorage.getItem('hasSpun') === 'true') {
            disableSpinButton('ALREADY SPUN!');
        }

        spinBtn.addEventListener('click', spinWheel);

        // ======================================================
        // PERUBAHAN: Blok kode untuk redeemBtn dihapus dari sini.
        // Navigasi sekarang ditangani oleh tag <a> di HTML.
        // ======================================================
    };

    // ===================================================================================
    // Fungsi-Fungsi Utama
    // ===================================================================================

    const buildWheel = () => {
        const gradientParts = prizes.map((prize, i) => {
            const startAngle = i * segmentAngle;
            const endAngle = (i + 1) * segmentAngle;
            return `${prize.color} ${startAngle}deg ${endAngle}deg`;
        });
        wheel.style.background = `conic-gradient(${gradientParts.join(', ')})`;

        wheelLabels.innerHTML = '';
        prizes.forEach((prize, i) => {
            const labelAngle = (i * segmentAngle) + (segmentAngle / 2);
            
            const label = document.createElement('div');
            label.className = 'prize-label';
            label.style.transform = `rotate(${labelAngle}deg)`;
            
            const textSpan = document.createElement('span');
            textSpan.textContent = prize.text;
            textSpan.style.color = prize.textColor;

            label.appendChild(textSpan);
            wheelLabels.appendChild(label);
        });
    };
    
    // ==========================================================================
    // PERUBAHAN: Logika kalkulasi sudut diperbaiki agar hasil selalu akurat.
    // ==========================================================================
    const spinWheel = () => {
        if (isSpinning || localStorage.getItem('hasSpun') === 'true') return;

        isSpinning = true;
        localStorage.setItem('hasSpun', 'true');
        disableSpinButton('...');

        const targetSegmentIndex = Math.floor(Math.random() * segmentCount);
        const randomSpins = Math.floor(Math.random() * 4) + 5;
        
        // Kalkulasi sudut yang tepat untuk mengarahkan ke TENGAH segmen pemenang
        const targetAngle = (targetSegmentIndex * segmentAngle) + (segmentAngle / 2);
        const finalRotation = (360 * randomSpins) + (360 - targetAngle);
        
        currentRotation = finalRotation;
        wheel.style.transform = `rotate(${currentRotation}deg)`;

        setTimeout(() => {
            showPrize(prizes[targetSegmentIndex]);
            isSpinning = false;
        }, 7500); // Sesuaikan dengan durasi transisi di CSS
    };

    const showPrize = (wonPrize) => {
        prizeAmount.textContent = wonPrize.text;
        popup.classList.add('show');
        myConfetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    };

    const disableSpinButton = (text) => {
        spinBtn.disabled = true;
        spinBtn.textContent = text;
    };
    
    function initializeSliders() {
        const recentWinners = [{ name: 'John D.', prize: 5000 }, { name: 'Maria S.', prize: 100 }, { name: 'Chen L.', prize: 25000 }, { name: 'Fatima A.', prize: 1000 }, { name: 'David P.', prize: 50 }, { name: 'Isabella G.', prize: 50000 }];
        const winnersSliderWrapper = document.querySelector('#winners-slider .swiper-wrapper');
        if (winnersSliderWrapper) {
            winnersSliderWrapper.innerHTML = recentWinners.map(w => `<div class="swiper-slide winner-card"><strong>${w.name}</strong> just won <span>$${w.prize.toLocaleString()}!</span></div>`).join('');
            new Swiper('#winners-slider', { loop: true, slidesPerView: 'auto', spaceBetween: 15, allowTouchMove: false, autoplay: { delay: 0, disableOnInteraction: false }, speed: 4000 });
        }
        new Swiper('#testimonial-slider', { loop: true, slidesPerView: 1, spaceBetween: 20, autoplay: { delay: 5000, disableOnInteraction: false }, pagination: { el: '.swiper-pagination', clickable: true }, breakpoints: { 768: { slidesPerView: 2 }, 992: { slidesPerView: 3 } } });
    }

    init();
});