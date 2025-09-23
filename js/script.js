// ===== CONFIGURACIÓN INICIAL =====
// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página cargada correctamente');
    
    // Inicializar todas las funcionalidades
    initWelcomeModal();
    initNavigation();
    initContactForm();
    initScrollEffects();
    initAnimations();
});

// ===== MODAL DE BIENVENIDA =====
function initWelcomeModal() {
    // Verificar si ya se mostró el modal en esta sesión
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
    
    if (!hasSeenWelcome) {
        // Mostrar modal después de un pequeño delay para mejor UX
        setTimeout(() => {
            showWelcomeModal();
        }, 500);
    }
}

function showWelcomeModal() {
    const welcomeModal = document.getElementById('welcomeModal');
    const userNameInput = document.getElementById('userName');
    const submitBtn = document.getElementById('submitWelcome');
    const skipBtn = document.getElementById('skipWelcome');
    
    if (welcomeModal) {
        welcomeModal.style.display = 'flex';
        
        // Enfocar el campo de nombre
        setTimeout(() => {
            userNameInput.focus();
        }, 100);
        
        // Event listeners para los botones
        submitBtn.addEventListener('click', handleWelcomeSubmit);
        skipBtn.addEventListener('click', handleWelcomeSkip);
        
        // Event listener para Enter en el campo de nombre
        userNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleWelcomeSubmit();
            }
        });
        
        // Validación en tiempo real
        userNameInput.addEventListener('input', validateNameRealTime);
    }
}

function handleWelcomeSubmit() {
    const userName = document.getElementById('userName').value.trim();
    
    // Validar nombre
    const nameValidation = validateName(userName);
    if (!nameValidation.isValid) {
        showFieldError('userName', nameValidation.message);
        return;
    }
    
    // Si el nombre es válido, proceder
    processWelcomeData(userName);
}

function handleWelcomeSkip() {
    // Marcar como visto y cerrar modal
    sessionStorage.setItem('hasSeenWelcome', 'true');
    hideWelcomeModal();
    
    // Mostrar mensaje genérico
    showWelcomeNotification('¡Bienvenido! Esperamos que disfrutes explorando el portafolio.');
}

function processWelcomeData(name) {
    // Guardar datos en sessionStorage
    sessionStorage.setItem('userName', name);
    sessionStorage.setItem('hasSeenWelcome', 'true');
    
    // Cerrar modal
    hideWelcomeModal();
    
    // Mostrar mensaje personalizado
    const firstName = name.split(' ')[0];
    showWelcomeNotification(`¡Hola ${firstName}! Bienvenido al portafolio de Javier Valderrama.`);
    
    // Log en consola
    console.log(`👋 Usuario registrado: ${name}`);
}

function hideWelcomeModal() {
    const welcomeModal = document.getElementById('welcomeModal');
    if (welcomeModal) {
        welcomeModal.style.animation = 'fadeOut 0.3s ease-in forwards';
        setTimeout(() => {
            welcomeModal.style.display = 'none';
        }, 300);
    }
}

// ===== VALIDACIONES =====
function validateName(name) {
    // Verificar que no esté vacío
    if (!name) {
        return {
            isValid: false,
            message: 'El nombre es obligatorio'
        };
    }
    
    // Verificar longitud mínima
    if (name.length < 2) {
        return {
            isValid: false,
            message: 'El nombre debe tener al menos 2 caracteres'
        };
    }
    
    // Verificar longitud máxima
    if (name.length > 50) {
        return {
            isValid: false,
            message: 'El nombre no puede tener más de 50 caracteres'
        };
    }
    
    // Verificar que contenga solo letras, espacios y algunos caracteres especiales
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-']+$/;
    if (!nameRegex.test(name)) {
        return {
            isValid: false,
            message: 'El nombre solo puede contener letras, espacios, guiones y apostrofes'
        };
    }
    
    // Verificar que no sean solo espacios
    if (name.replace(/\s/g, '').length === 0) {
        return {
            isValid: false,
            message: 'El nombre no puede ser solo espacios'
        };
    }
    
    return {
        isValid: true,
        message: ''
    };
}


function validateNameRealTime() {
    const userName = document.getElementById('userName').value.trim();
    const validation = validateName(userName);
    
    if (validation.isValid) {
        clearFieldError('userName');
    } else {
        showFieldError('userName', validation.message);
    }
}


function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId.replace('user', '') + 'Error');
    
    if (field && errorElement) {
        field.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId.replace('user', '') + 'Error');
    
    if (field && errorElement) {
        field.classList.remove('error');
        errorElement.classList.remove('show');
        errorElement.textContent = '';
    }
}

function showWelcomeNotification(message) {
    const welcomeMessage = document.getElementById('welcomeMessage');
    const welcomeText = document.getElementById('welcomeText');
    const closeBtn = document.getElementById('closeWelcome');
    
    if (welcomeMessage && welcomeText) {
        welcomeText.textContent = message;
        welcomeMessage.style.display = 'block';
        
        // Auto-cerrar después de 5 segundos
        setTimeout(() => {
            hideWelcomeNotification();
        }, 5000);
        
        // Event listener para cerrar manualmente
        if (closeBtn) {
            closeBtn.addEventListener('click', hideWelcomeNotification);
        }
    }
}

function hideWelcomeNotification() {
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        welcomeMessage.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => {
            welcomeMessage.style.display = 'none';
            welcomeMessage.style.animation = '';
        }, 300);
    }
}


// ===== NAVEGACIÓN RESPONSIVE =====
function initNavigation() {
    // Obtener elementos del menú hamburguesa
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Función para alternar el menú móvil
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }

    // Event listener para el botón hamburguesa
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Cerrar menú móvil al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Cerrar menú móvil al hacer clic fuera de él
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Scroll suave para los enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Obtener el ID de la sección objetivo
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calcular la posición considerando la altura del navbar fijo
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                // Scroll suave hacia la sección
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== FORMULARIO DE CONTACTO =====
function initContactForm() {
    // Obtener elementos del formulario
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    
    if (contactForm) {
        // Event listener para el envío del formulario
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevenir envío por defecto
            
            // Obtener datos del formulario
            const formData = new FormData(contactForm);
            const nombre = formData.get('nombre');
            const email = formData.get('email');
            const mensaje = formData.get('mensaje');
            
            // Validar que todos los campos estén llenos
            if (!nombre || !email || !mensaje) {
                alert('Por favor, completa todos los campos del formulario.');
                return;
            }
            
            // Validar formato de email básico
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, ingresa un correo electrónico válido.');
                return;
            }
            
            // Simular envío del formulario
            console.log('Formulario enviado correctamente');
            console.log('Datos del formulario:', {
                nombre: nombre,
                email: email,
                mensaje: mensaje,
                timestamp: new Date().toISOString()
            });
            
            // Mostrar mensaje de éxito
            showSuccessMessage();
            
            // Limpiar formulario
            contactForm.reset();
        });
    }
}

// ===== MOSTRAR MENSAJE DE ÉXITO =====
function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    const contactForm = document.getElementById('contactForm');
    
    if (successMessage && contactForm) {
        // Ocultar formulario y mostrar mensaje
        contactForm.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Agregar clase para animación
        successMessage.classList.add('fade-in');
        
        // Después de 5 segundos, volver a mostrar el formulario
        setTimeout(() => {
            successMessage.style.display = 'none';
            contactForm.style.display = 'block';
            successMessage.classList.remove('fade-in');
        }, 5000);
    }
}

// ===== EFECTOS DE SCROLL =====
function initScrollEffects() {
    // Efecto de transparencia en el navbar al hacer scroll
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        if (scrollPosition > 100) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backgroundColor = '#ffffff';
            navbar.style.backdropFilter = 'none';
        }
    });
    
    // Animación de aparición de elementos al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos que deben animarse
    const animateElements = document.querySelectorAll('.experience-card, .project-card, .section-title');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// ===== ANIMACIONES =====
function initAnimations() {
    // Agregar estilos CSS para animaciones dinámicas
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: slideInUp 0.6s ease-out forwards;
        }
        
        .fade-in {
            animation: fadeIn 0.5s ease-in forwards;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        
        /* Animación de hover para botones */
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }
        
        .btn:hover::before {
            left: 100%;
        }
    `;
    document.head.appendChild(style);
}

// ===== FUNCIONALIDADES ADICIONALES =====

// Función para mostrar información de los proyectos al hacer clic en "Ver más"
function initProjectButtons() {
    const projectButtons = document.querySelectorAll('.project-card .btn-outline');
    
    projectButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtener información del proyecto
            const projectCard = this.closest('.project-card');
            const projectTitle = projectCard.querySelector('h3').textContent;
            const projectDescription = projectCard.querySelector('p').textContent;
            
            // Crear modal con información del proyecto
            showProjectModal(projectTitle, projectDescription);
        });
    });
}

// Función para mostrar modal de proyecto
function showProjectModal(title, description) {
    // Crear elemento modal
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${description}</p>
                    <p><strong>Estado:</strong> En desarrollo</p>
                    <p><strong>Tecnologías:</strong> HTML, CSS, JavaScript</p>
                    <p><strong>Fecha de inicio:</strong> Enero 2025</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary modal-close-btn">Cerrar</button>
                </div>
            </div>
        </div>
    `;
    
    // Agregar estilos del modal
    const modalStyles = `
        .project-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2000;
            animation: fadeIn 0.3s ease-out;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .modal-content {
            background-color: white;
            border-radius: 12px;
            max-width: 500px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid #E5E7EB;
        }
        
        .modal-header h3 {
            color: #1F2937;
            margin: 0;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #6B7280;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-close:hover {
            color: #1F2937;
        }
        
        .modal-body {
            padding: 1.5rem;
        }
        
        .modal-body p {
            margin-bottom: 1rem;
            color: #6B7280;
            line-height: 1.6;
        }
        
        .modal-footer {
            padding: 1.5rem;
            border-top: 1px solid #E5E7EB;
            text-align: right;
        }
        
        .modal-close-btn {
            margin: 0;
        }
    `;
    
    // Agregar estilos si no existen
    if (!document.getElementById('modal-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'modal-styles';
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Agregar modal al DOM
    document.body.appendChild(modal);
    
    // Event listeners para cerrar modal
    const closeButtons = modal.querySelectorAll('.modal-close, .modal-close-btn');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.remove();
        });
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            modal.remove();
        }
    });
    
    // Cerrar modal con tecla Escape
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Inicializar botones de proyecto cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initProjectButtons();
});

// ===== FUNCIONES DE UTILIDAD =====

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos de notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#2563EB'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remover notificación después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Agregar estilos de animación para notificaciones
const notificationStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;

// Agregar estilos de notificación al documento
const notificationStyleSheet = document.createElement('style');
notificationStyleSheet.textContent = notificationStyles;
document.head.appendChild(notificationStyleSheet);

// ===== INICIALIZACIÓN FINAL =====
// Mensaje de bienvenida en consola
console.log('🚀 Portafolio de Javier Valderrama Villamizar cargado correctamente');
console.log('📧 Para contactar: javier.valderrama@email.com');
console.log('⚖️ Especialidad: Derecho Civil, Mercantil y Litigación');
