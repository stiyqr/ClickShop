const promoPriceSectionElement = document.getElementById('promo-price-section');
const promoPriceElement = document.getElementById('promoPrice');
const hasPromoSelectElement = document.getElementById('hasPromo');

function togglePromoPriceSection() {
    if (hasPromoSelectElement.value === 'true') {
        promoPriceSectionElement.style.display = 'block';
        promoPriceElement.required = true;
        
    }
    else {
        promoPriceSectionElement.style.display = 'none';
        promoPriceElement.required = false;
    }
}

document.addEventListener('DOMContentLoaded', togglePromoPriceSection, false);
hasPromoSelectElement.addEventListener('change', togglePromoPriceSection);