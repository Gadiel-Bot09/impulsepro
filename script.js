// ========================================
// MercadoPago Configuration
// ========================================
const mp = new MercadoPago('APP_USR-7e5e48f1-9615-4b9f-8b5a-efeb5e55e3ef', {
    locale: 'es-CO'
});

// ========================================
// DOM Elements
// ========================================
const checkoutBtn = document.getElementById('checkout-btn');
const faqItems = document.querySelectorAll('.faq-item');

// ========================================
// MercadoPago Checkout Integration
// ========================================
async function initMercadoPago() {
    try {
        checkoutBtn.addEventListener('click', async () => {
            try {
                // Deshabilitar botón
                checkoutBtn.disabled = true;
                const originalHTML = checkoutBtn.innerHTML;
                checkoutBtn.innerHTML = '<span style="font-size: 1.2rem;">Procesando... ⏳</span>';

                // Llamar al backend para crear la preferencia
                const response = await fetch('http://localhost:3000/create_preference', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: 'cliente@pulsepro.com' // Opcional
                    })
                });

                if (!response.ok) {
                    throw new Error('Error al conectar con el servidor');
                }

                const preference = await response.json();

                console.log('✅ Preferencia creada:', preference.id);

                // Redirigir a MercadoPago en nueva pestaña
                window.open(preference.init_point, '_blank');

                // Mostrar instrucciones importantes en la pestaña original
                showPaymentInstructionModal();

                // Restaurar botón después de unos segundos
                setTimeout(() => {
                    checkoutBtn.disabled = false;
                    checkoutBtn.innerHTML = originalHTML;
                }, 3000);

            } catch (error) {
                console.error('❌ Error al procesar el pago:', error);

                // Mostrar error al usuario
                showNotification('❌ Error al procesar el pago. Verifica que el servidor esté corriendo.');

                // Restaurar botón
                checkoutBtn.disabled = false;
                checkoutBtn.innerHTML = originalHTML;
            }
        });

    } catch (error) {
        console.error('❌ Error al inicializar MercadoPago:', error);
    }
}

// ========================================
// Simplified Payment Button (Alternative)
// ========================================
// If you want a simpler implementation, uncomment this:
/*
checkoutBtn.addEventListener('click', () => {
    // Redirect to MercadoPago payment link
    // You'll need to create this link in your MercadoPago dashboard
    const paymentLink = 'https://mpago.la/YOUR_LINK_HERE';
    window.open(paymentLink, '_blank');
});
*/

// ========================================
// FAQ Accordion Functionality
// ========================================
function initFAQ() {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all FAQ items
            faqItems.forEach(faq => faq.classList.remove('active'));

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// ========================================
// Smooth Scroll for Navigation Links
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// Scroll Animations
// ========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const animatedElements = document.querySelectorAll(
        '.feature-card, .step-card, .comparison-card, .faq-item, .pricing-card'
    );

    animatedElements.forEach(el => observer.observe(el));
}

// ========================================
// Header Scroll Effect
// ========================================
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 255, 136, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });
}

// ========================================
// Check Payment Status from URL
// ========================================
function checkPaymentStatus() {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const paymentId = urlParams.get('payment_id');

    if (status) {
        let message = '';
        let icon = '';

        switch (status) {
            case 'success':
                icon = '✅';
                message = '¡Pago exitoso! Gracias por tu compra. Recibirás un email con los detalles de acceso.';
                break;
            case 'pending':
                icon = '⏳';
                message = 'Tu pago está pendiente. Te notificaremos cuando se confirme.';
                break;
            case 'failure':
                icon = '❌';
                message = 'El pago no pudo procesarse. Por favor, intenta nuevamente.';
                break;
        }

        if (message) {
            showNotification(icon + ' ' + message);
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
}

// ========================================
// Notification Toast
// ========================================
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #00ff88, #00d4ff);
        color: #0a0a0a;
        padding: 1.5rem 2rem;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 255, 136, 0.4);
        z-index: 10000;
        font-weight: 600;
        max-width: 400px;
        animation: slideIn 0.5s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

// ========================================
// Add Slide Animations
// ========================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// Counter Animation for Price
// ========================================
function animateCounter() {
    const priceElement = document.querySelector('.amount');
    if (!priceElement) return;

    const target = 90000;
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    priceElement.textContent = Math.floor(current).toLocaleString('es-CO');
                }, 16);
                observer.unobserve(entry.target);
            }
        });
    });

    observer.observe(priceElement);
}

// ========================================
// Initialize Everything on DOM Load
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initMercadoPago();
    initFAQ();
    initSmoothScroll();
    initScrollAnimations();
    initHeaderScroll();
    checkPaymentStatus();
    animateCounter();

    console.log('🚀 PulsePro initialized successfully!');
});

// ========================================
// Payment Instruction Modal
// ========================================
function showPaymentInstructionModal() {
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10001;
        opacity: 0;
        transition: opacity 0.3s ease;
        backdrop-filter: blur(5px);
    `;

    // Crear modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: linear-gradient(145deg, #1a1a1a, #0a0a0a);
        border: 1px solid #333;
        padding: 2.5rem;
        border-radius: 20px;
        max-width: 500px;
        width: 90%;
        text-align: center;
        position: relative;
        transform: scale(0.9);
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        box-shadow: 0 20px 60px rgba(0, 255, 136, 0.2);
    `;

    modal.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">📱</div>
        <h3 style="color: #fff; font-size: 1.8rem; margin-bottom: 1rem;">¡Casi listo!</h3>
        <p style="color: #ccc; font-size: 1.1rem; line-height: 1.6; margin-bottom: 2rem;">
            Se ha abierto la pasarela de pago en otra pestaña.
            <br><br>
            <strong style="color: #00ff88;">IMPORTANTE:</strong><br>
            Al finalizar tu pago, por favor <b>envía una captura del comprobante</b> a nuestro WhatsApp para activar tu licencia de inmediato.
        </p>
        <a href="https://wa.me/573003813533?text=Hola,%20adjunto%20mi%20comprobante%20de%20pago%20para%20la%20licencia%20Pro" 
           target="_blank"
           style="background: #00ff88; color: #000; padding: 1rem 2rem; border-radius: 50px; text-decoration: none; font-weight: bold; display: inline-block; transition: transform 0.2s;">
           Enviar Comprobante por WhatsApp →
        </a>
        <button id="close-modal-btn" style="background: transparent; border: none; color: #666; display: block; margin: 1.5rem auto 0; cursor: pointer; text-decoration: underline;">
            Cerrar esta ventana
        </button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Animar entrada
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    });

    // Evento cerrar
    const closeBtn = modal.querySelector('#close-modal-btn');
    closeBtn.addEventListener('click', () => {
        overlay.style.opacity = '0';
        modal.style.transform = 'scale(0.9)';
        setTimeout(() => overlay.remove(), 300);
    });
}

// ========================================
// Mobile Menu Toggle (Optional Enhancement)
// ========================================
function initMobileMenu() {
    const menuToggle = document.createElement('button');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.innerHTML = '☰';
    menuToggle.style.cssText = `
        display: none;
        background: linear-gradient(135deg, #00ff88, #00d4ff);
        border: none;
        color: #0a0a0a;
        font-size: 1.5rem;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        cursor: pointer;
    `;

    const nav = document.querySelector('.nav');
    const navMenu = document.querySelector('.nav-menu');

    if (window.innerWidth <= 768) {
        nav.appendChild(menuToggle);

        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active') ? '✕' : '☰';
        });
    }
}

// ========================================
// Export for testing (if needed)
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initMercadoPago,
        initFAQ,
        showNotification
    };
}
