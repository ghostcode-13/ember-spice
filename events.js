
// Subtle 3D tilt on event cards — desktop/mouse only
const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (supportsHover) {
    document.querySelectorAll('.event-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// Inquiry form → WhatsApp
const inquiryForm = document.getElementById('inquiry-form');
if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('ev-name').value;
        const phone = document.getElementById('ev-phone').value;
        const type = document.getElementById('ev-type').value;
        const guests = document.getElementById('ev-guests').value;
        const date = document.getElementById('ev-date').value;
        const message = document.getElementById('ev-message').value;

        let text = `Hi Ember & Spice! I'd like to inquire about a private event:\n\n`;
        text += `Name: ${name}\n`;
        text += `Phone: ${phone}\n`;
        text += `Event Type: ${type}\n`;
        text += `Guests: ${guests}\n`;
        text += `Date: ${date}\n`;
        if (message.trim()) text += `Details: ${message}\n`;

        const url = `https://api.whatsapp.com/send?phone=2348135836268&text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    });
}