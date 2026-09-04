const dishes = [
    { name: "Smoky Party Jollof Rice", price: 4500, img: "./images/smoky-jollof.png" },
    { name: "Egusi Soup & Pounded Yam", price: 5800, img: "./images/egusi.png" },
    { name: "Catfish Pepper Soup", price: 6200, img: "./images/catfish01.png" },
    { name: "Suya Platter & Yaji Dip", price: 7500, img: "./images/suya platter.png" },
    { name: "Oxtail Stew & White Rice", price: 9000, img: "./images/Oxtail Stew.png" },
    { name: "Asun & Plantain Chips", price: 5200, img: "./images/Asun & plantain chips.png" }
];

const order = {}; // { dishName: qty }

const itemsWrap = document.getElementById('order-items');
const summaryList = document.getElementById('summary-list');
const summaryTotal = document.getElementById('summary-total-amount');
const whatsappBtn = document.getElementById('send-whatsapp');

function formatNaira(n) {
    return '₦' + n.toLocaleString();
}

function renderItems() {
    itemsWrap.innerHTML = dishes.map(d => `
        <div class="order-item-card">
            <img src="${d.img}" alt="${d.name}">
            <div class="oi-info">
                <h4>${d.name}</h4>
                <span class="oi-price">${formatNaira(d.price)}</span>
            </div>
            <div class="oi-qty">
                <button class="qty-btn" data-action="dec" data-name="${d.name}">−</button>
                <span class="qty-val" id="qty-${dishes.indexOf(d)}">0</span>
                <button class="qty-btn" data-action="inc" data-name="${d.name}">+</button>
            </div>
        </div>
    `).join('');
}

function updateSummary() {
    const entries = Object.entries(order).filter(([_, qty]) => qty > 0);

    if (entries.length === 0) {
        summaryList.innerHTML = '<p class="summary-empty">No items yet — add a dish to get started.</p>';
        summaryTotal.textContent = formatNaira(0);
        return;
    }

    let total = 0;
    summaryList.innerHTML = entries.map(([name, qty]) => {
        const dish = dishes.find(d => d.name === name);
        const lineTotal = dish.price * qty;
        total += lineTotal;
        return `<div class="summary-line"><span>${qty}× ${name}</span><span>${formatNaira(lineTotal)}</span></div>`;
    }).join('');

    summaryTotal.textContent = formatNaira(total);
}

itemsWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.qty-btn');
    if (!btn) return;

    const name = btn.dataset.name;
    const index = dishes.findIndex(d => d.name === name);
    order[name] = order[name] || 0;

    if (btn.dataset.action === 'inc') order[name]++;
    if (btn.dataset.action === 'dec') order[name] = Math.max(0, order[name] - 1);

    document.getElementById('qty-' + index).textContent = order[name];
    updateSummary();
});

whatsappBtn.addEventListener('click', () => {
    const entries = Object.entries(order).filter(([_, qty]) => qty > 0);
    if (entries.length === 0) {
        alert('Add at least one item to your order first.');
        return;
    }

    let message = "Hi Ember & Spice! I'd like to place an order:\n\n";
    let total = 0;
    entries.forEach(([name, qty]) => {
        const dish = dishes.find(d => d.name === name);
        const lineTotal = dish.price * qty;
        total += lineTotal;
        message += `• ${qty}× ${name} — ${formatNaira(lineTotal)}\n`;
    });
    message += `\nTotal: ${formatNaira(total)}`;

    const url = `https://api.whatsapp.com/send?phone=2348135836268&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
});

renderItems();

