/* --------------------------------------------------
   Patricia De Stena - Arteterapia Landing Page JS
-------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    // --- Header Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initially

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-up');
    
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve after revealing to prevent repeated animations on scrolling up/down
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealOnScroll.observe(element);
    });

    // --- Active Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    
    const highlightNav = () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // Offset for fixed navbar
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    };
    window.addEventListener('scroll', highlightNav);

    // --- Contact Form Logic & WhatsApp Redirection ---
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const btnSubmit = document.getElementById('btnSubmit');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Form inputs
            const nombre = document.getElementById('formNombre').value.trim();
            const email = document.getElementById('formEmail').value.trim();
            const telefono = document.getElementById('formTelefono').value.trim();
            const grupoSelect = document.getElementById('formGrupo');
            const grupoText = grupoSelect.options[grupoSelect.selectedIndex].text;
            const mensaje = document.getElementById('formMensaje').value.trim();

            if (!nombre || !email || !mensaje || !grupoSelect.value) {
                showStatus('Por favor, completa todos los campos requeridos (*).', 'error');
                return;
            }

            // Disable button and show sending state
            btnSubmit.disabled = true;
            btnSubmit.innerText = 'Enviando...';
            showStatus('¡Procesando consulta! Serás redirigido a WhatsApp...', 'success');

            // Construct WhatsApp Message
            const basePhone = '5491123456789'; // Patricia's phone number (can be replaced by the user)
            
            let wppMessage = `Hola Patricia! Me contacto desde tu sitio web.\n\n`;
            wppMessage += `*Nombre:* ${nombre}\n`;
            wppMessage += `*Email:* ${email}\n`;
            if (telefono) wppMessage += `*Teléfono:* ${telefono}\n`;
            wppMessage += `*Interés:* ${grupoText}\n\n`;
            wppMessage += `*Consulta:* ${mensaje}`;

            const encodedMessage = encodeURIComponent(wppMessage);
            const wppUrl = `https://wa.me/${basePhone}?text=${encodedMessage}`;

            // Redirect to WhatsApp after a short delay for user feedback
            setTimeout(() => {
                window.open(wppUrl, '_blank');
                
                // Reset form
                contactForm.reset();
                btnSubmit.disabled = false;
                btnSubmit.innerText = 'Enviar Consulta';
                showStatus('¡Consulta procesada con éxito y enviada por WhatsApp!', 'success');
                
                // Clear success message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
            }, 1500);
        });
    }

    function showStatus(msg, type) {
        formStatus.textContent = msg;
        formStatus.className = 'form-status ' + type;
        formStatus.style.display = 'block';
    }
});
