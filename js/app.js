// =====================================================
        // CONFIGURACIÓN DE EMAILJS (variables de entorno simuladas)
        // =====================================================
        // EN PRODUCCIÓN: reemplazar con variables de entorno reales o servidor backend.
        // Aquí se usa un fallback a mailto si no se configuran.
        const EMAILJS_CONFIG = {
            publicKey: 'TU_PUBLIC_KEY',   // Reemplazar con tu clave pública
            serviceId: 'TU_SERVICE_ID',
            templateId: 'TU_TEMPLATE_ID'
        };

        // Inicializar EmailJS solo si la clave no es el placeholder
        if (EMAILJS_CONFIG.publicKey !== 'TU_PUBLIC_KEY') {
            emailjs.init(EMAILJS_CONFIG.publicKey);
        }

        // =====================================================
        // DOM READY
        // =====================================================
        document.addEventListener('DOMContentLoaded', function() {

            // ---- Tema claro forzado ----
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            window.localStorage.setItem('green-hearts-theme', 'light');

            // ---- Navbar scroll + barra de progreso de lectura ----
            const navbar = document.getElementById('navbar');
            const scrollProgress = document.getElementById('scrollProgress');
            let lastScroll = 0;
            window.addEventListener('scroll', function() {
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                if (currentScroll > 60) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                lastScroll = currentScroll;

                if (scrollProgress) {
                    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const pct = docHeight > 0 ? (currentScroll / docHeight) * 100 : 0;
                    scrollProgress.style.width = pct + '%';
                }
            }, { passive: true });

            // ---- Mobile menu ----
            const navToggle = document.getElementById('navToggle');
            const navMenu = document.getElementById('navMenu');
            const navOverlay = document.getElementById('navOverlay');
            const navLinks = document.querySelectorAll('.nav-links a');

            function toggleMenu(open) {
                const isOpen = open !== undefined ? open : navMenu.classList.toggle('open');
                navMenu.classList.toggle('open', isOpen);
                navOverlay.classList.toggle('show', isOpen);
                navToggle.setAttribute('aria-expanded', isOpen);
                if (isOpen) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            }

            navToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleMenu();
            });

            navOverlay.addEventListener('click', function() {
                toggleMenu(false);
            });

            navLinks.forEach(function(link) {
                link.addEventListener('click', function() {
                    toggleMenu(false);
                });
            });

            // Cerrar menú con Escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && navMenu.classList.contains('open')) {
                    toggleMenu(false);
                }
            });

            // ---- Intersection Observer (reveal) ----
            const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
            if ('IntersectionObserver' in window && revealEls.length) {
                const observer = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                        }
                    });
                }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
                revealEls.forEach(function(el) { observer.observe(el); });
            } else {
                revealEls.forEach(function(el) { el.classList.add('visible'); });
            }

            // ---- Contador animado ----
            let counted = false;
            const counters = document.querySelectorAll('.counter');
            const counterObserver = 'IntersectionObserver' in window ? new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting && !counted) {
                        counted = true;
                        counters.forEach(function(counter) {
                            const target = parseInt(counter.getAttribute('data-target'), 10);
                            const duration = 1800;
                            const step = target / (duration / 16);
                            let current = 0;
                            function updateCounter() {
                                current += step;
                                if (current < target) {
                                    counter.textContent = Math.floor(current).toLocaleString();
                                    requestAnimationFrame(updateCounter);
                                } else {
                                    counter.textContent = target.toLocaleString();
                                }
                            }
                            requestAnimationFrame(updateCounter);
                        });
                    }
                });
            }, { threshold: 0.3 }) : null;
            const impactoSection = document.getElementById('impacto');
            if (impactoSection && counterObserver) counterObserver.observe(impactoSection);

            // ---- Hero typing effect (con accesibilidad) ----
            const heroSubtitle = document.querySelector('.hero-subtitle');
            const messages = [
                'Green Hearts impulsa un futuro más limpio y sostenible desde el corazón del Caribe costarricense.',
                'La organización transforma los residuos en oportunidades y la participación comunitaria en acción ambiental.',
                'La participación voluntaria contribuye a construir un Sarapiquí más verde y sostenible.'
            ];
            let msgIndex = 0,
                charIndex = 0;
            let typingTimeout = null;

            function typeHero() {
                if (!heroSubtitle) return;
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    heroSubtitle.textContent = messages[0];
                    return;
                }
                heroSubtitle.textContent = messages[msgIndex].substring(0, charIndex);
                charIndex++;
                if (charIndex > messages[msgIndex].length) {
                    clearTimeout(typingTimeout);
                    typingTimeout = setTimeout(function() {
                        charIndex = 0;
                        msgIndex = (msgIndex + 1) % messages.length;
                        typeHero();
                    }, 2400);
                } else {
                    typingTimeout = setTimeout(typeHero, 55);
                }
            }
            typeHero();

            // ---- Efecto parallax en hero (solo si no hay preferencia de reducción) ----
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                const heroSection = document.getElementById('inicio');
                const heroBg = document.querySelector('.hero-bg');
                if (heroSection && heroBg) {
                    heroSection.addEventListener('mousemove', function(e) {
                        const rect = heroSection.getBoundingClientRect();
                        const x = (e.clientX - rect.left) / rect.width - 0.5;
                        const y = (e.clientY - rect.top) / rect.height - 0.5;
                        heroBg.style.transform = 'translate(' + (x * 14) + 'px, ' + (y * 12) + 'px) scale(1.02)';
                    }, { passive: true });
                    heroSection.addEventListener('mouseleave', function() {
                        heroBg.style.transform = 'scale(1.02)';
                    }, { passive: true });
                }
            }

            // ---- Lightbox ----
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightboxImg');
            const lightboxClose = document.getElementById('lightboxClose');

            function openLightbox(src, alt) {
                lightboxImg.src = src;
                lightboxImg.alt = alt || '';
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
                lightboxClose.focus();
            }

            function closeLightbox() {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }

            lightboxClose.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) closeLightbox();
            });
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') closeLightbox();
            });

            // ---- Menú multimedia local ----
            const mediaGrid = document.getElementById('mediaGrid');
            const mediaCount = document.getElementById('mediaCount');
            const mediaEmpty = document.getElementById('mediaEmpty');
            const mediaMoreWrap = document.getElementById('mediaMoreWrap');
            const mediaMore = document.getElementById('mediaMore');
            const mediaFilters = document.querySelectorAll('.media-filter');
            const MEDIA_PREVIEW_LIMIT = 8;
            let mediaExpanded = false;
            const IMAGE_PATH = 'assets/images/';
            const VIDEO_PATH = 'assets/videos/';
            const newImages = [
                'WhatsApp Image 2026-08-18 at 8.48.51 PM.jpeg',
                'WhatsApp Image 2026-08-18 at 8.48.51 PM (1).jpeg',
                'WhatsApp Image 2026-08-18 at 8.48.51 PM (2).jpeg',
                'WhatsApp Image 2026-08-18 at 8.48.51 PM (3).jpeg',
                'WhatsApp Image 2026-08-18 at 8.48.51 PM (4).jpeg',
                'WhatsApp Image 2026-08-18 at 8.49.03 PM.jpeg',
                'WhatsApp Image 2026-08-18 at 8.49.03 PM (1).jpeg',
                'WhatsApp Image 2026-08-18 at 8.49.03 PM (2).jpeg',
                'WhatsApp Image 2026-08-18 at 8.49.03 PM (3).jpeg',
                'WhatsApp Image 2026-08-18 at 8.49.03 PM (4).jpeg',
                'WhatsApp Image 2026-08-18 at 8.49.03 PM (5).jpeg',
                'WhatsApp Image 2026-08-18 at 8.49.03 PM (6).jpeg',
                'WhatsApp Image 2026-08-18 at 8.49.03 PM (7).jpeg',
                'WhatsApp Image 2026-08-18 at 8.49.03 PM (8).jpeg',
                'WhatsApp Image 2026-08-18 at 8.49.03 PM (9).jpeg',
                'WhatsApp Image 2026-08-18 at 8.49.03 PM (10).jpeg',
                'WhatsApp Image 2026-08-18 at 8.49.03 PM (11).jpeg'
            ];
            const newVideos = [
                'WhatsApp Video 2026-08-18 at 8.49.03 PM.mp4',
                'WhatsApp Video 2026-08-18 at 8.49.03 PM (1).mp4',
                'WhatsApp Video 2026-08-18 at 8.49.04 PM.mp4',
                'WhatsApp Video 2026-08-18 at 8.49.04 PM (1).mp4',
                'WhatsApp Video 2026-08-18 at 8.49.06 PM.mp4'
            ];

            function mediaTitle(filename, type, index) {
                return type === 'image' ? 'Fotografía de una actividad ambiental de Green Hearts' : 'Video de Green Hearts';
            }

            function handleBrokenMedia(card, kind) {
                card.classList.add('media-card-broken');
                const body = card.querySelector('.media-card-body');
                if (body) {
                    body.innerHTML = '<span class="media-card-title">Contenido no disponible</span><span class="media-card-type">' + (kind === 'image' ? 'Foto' : 'Video') + '</span>';
                }
            }

            function renderMedia() {
                if (!mediaGrid) return;
                newImages.forEach(function(filename, index) {
                    const card = document.createElement('article');
                    const title = mediaTitle(filename, 'image', index);
                    const mediaPath = encodeURI(IMAGE_PATH + filename);
                    card.className = 'media-card reveal';
                    card.dataset.mediaType = 'image';
                    card.innerHTML = '<button class="media-image-trigger" type="button" aria-label="Abrir imagen de una actividad ambiental">' +
                        '<img src="' + mediaPath + '" alt="' + title + '" loading="lazy" decoding="async" width="640" height="420">' +
                        '</button>';
                    const triggerButton = card.querySelector('button');
                    const image = card.querySelector('img');
                    if (triggerButton) {
                        triggerButton.addEventListener('click', function() {
                            if (image && image.complete && image.naturalWidth > 0) {
                                openLightbox(mediaPath, title);
                            }
                        });
                    }
                    if (image) {
                        image.addEventListener('error', function() {
                            handleBrokenMedia(card, 'image');
                            if (triggerButton) triggerButton.disabled = true;
                        });
                    }
                    mediaGrid.appendChild(card);
                    requestAnimationFrame(function() { card.classList.add('visible'); });
                });
                newVideos.forEach(function(filename, index) {
                    const card = document.createElement('article');
                    const title = mediaTitle(filename, 'video', index);
                    const mediaPath = encodeURI(VIDEO_PATH + filename);
                    card.className = 'media-card reveal';
                    card.dataset.mediaType = 'video';
                    card.innerHTML = '<video controls preload="metadata" playsinline src="' + mediaPath + '" aria-label="' + title + '">Tu navegador no puede reproducir este video.</video>' +
                        '<div class="media-card-body"><span class="media-card-title">' + title + '</span><span class="media-card-type">Video</span></div>' +
                        '<p class="media-video-error">Este navegador no admite este formato. <a href="' + mediaPath + '" target="_blank" rel="noopener">Abrir video</a></p>';
                    mediaGrid.appendChild(card);
                    const video = card.querySelector('video');
                    const videoError = card.querySelector('.media-video-error');
                    if (video) {
                        video.addEventListener('error', function() {
                            handleBrokenMedia(card, 'video');
                            if (videoError) videoError.style.display = 'block';
                        });
                        video.load();
                    }
                    requestAnimationFrame(function() { card.classList.add('visible'); });
                });
                applyMediaFilter('all');
            }

            function applyMediaFilter(filter) {
                const cards = mediaGrid ? mediaGrid.querySelectorAll('.media-card') : [];
                let visibleCount = 0;
                let matchingCount = 0;
                cards.forEach(function(card) {
                    const matches = filter === 'all' || card.dataset.mediaType === filter;
                    if (matches) matchingCount++;
                    const visible = matches && (mediaExpanded || visibleCount < MEDIA_PREVIEW_LIMIT);
                    card.hidden = !visible;
                    if (visible) visibleCount++;
                });
                if (mediaCount) mediaCount.textContent = matchingCount + (matchingCount === 1 ? ' elemento' : ' elementos');
                if (mediaEmpty) mediaEmpty.style.display = matchingCount ? 'none' : 'block';
                if (mediaMoreWrap) mediaMoreWrap.hidden = matchingCount <= MEDIA_PREVIEW_LIMIT;
                if (mediaMore) {
                    mediaMore.textContent = mediaExpanded ? 'Mostrar menos' : 'Ver más contenido';
                    mediaMore.setAttribute('aria-expanded', mediaExpanded ? 'true' : 'false');
                }
            }

            mediaFilters.forEach(function(filterButton) {
                filterButton.addEventListener('click', function() {
                    mediaFilters.forEach(function(button) {
                        const active = button === filterButton;
                        button.classList.toggle('active', active);
                        button.setAttribute('aria-selected', active ? 'true' : 'false');
                    });
                    applyMediaFilter(filterButton.dataset.filter);
                });
            });
            if (mediaMore) {
                mediaMore.addEventListener('click', function() {
                    mediaExpanded = !mediaExpanded;
                    const activeFilter = document.querySelector('.media-filter.active');
                    applyMediaFilter(activeFilter ? activeFilter.dataset.filter : 'all');
                    if (!mediaExpanded) mediaMore.focus();
                });
            }
            renderMedia();

            // ---- Carrusel protagonista en la portada ----
            const heroSectionForCarousel = document.getElementById('inicio');
            const galleryCarousel = document.querySelector('#galeria .carousel-container');
            if (heroSectionForCarousel && galleryCarousel) {
                heroSectionForCarousel.insertBefore(galleryCarousel, heroSectionForCarousel.firstElementChild);
                galleryCarousel.classList.add('hero-carousel');
                galleryCarousel.classList.remove('reveal');
                galleryCarousel.setAttribute('aria-label', 'Presentación visual de Green Hearts');
            }

            // ---- Carrusel mejorado ----
            let currentSlide = 0;
            const slides = document.querySelectorAll('.carousel-slide');
            const totalSlides = slides.length;
            const carouselTrack = document.getElementById('carouselTrack');
            const carouselNav = document.getElementById('carouselNav');
            const prevBtn = document.getElementById('carouselPrev');
            const nextBtn = document.getElementById('carouselNext');
            let autoPlayInterval = null;
            const AUTOPLAY_DELAY = 4000;

            // Crear dots
            slides.forEach(function(_, i) {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('role', 'tab');
                dot.setAttribute('aria-label', 'Ir a diapositiva ' + (i + 1));
                dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
                dot.setAttribute('aria-controls', 'carousel-slide-' + (i + 1));
                dot.addEventListener('click', function() {
                    goToSlide(i);
                    resetAutoPlay();
                });
                carouselNav.appendChild(dot);
            });

            slides.forEach(function(slide, i) {
                slide.id = 'carousel-slide-' + (i + 1);
                slide.setAttribute('role', 'group');
                slide.setAttribute('aria-roledescription', 'diapositiva');
                slide.setAttribute('aria-label', (i + 1) + ' de ' + totalSlides);
            });

            function goToSlide(index) {
                currentSlide = (index + totalSlides) % totalSlides;
                carouselTrack.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
                const dots = document.querySelectorAll('.carousel-dot');
                dots.forEach(function(d, i) {
                    const isActive = i === currentSlide;
                    d.classList.toggle('active', isActive);
                    d.setAttribute('aria-selected', isActive ? 'true' : 'false');
                });
                slides.forEach(function(slide, i) {
                    slide.setAttribute('aria-hidden', i === currentSlide ? 'false' : 'true');
                });
            }

            function changeSlide(direction) {
                goToSlide(currentSlide + direction);
                resetAutoPlay();
            }

            function startAutoPlay() {
                if (autoPlayInterval) clearInterval(autoPlayInterval);
                autoPlayInterval = setInterval(function() {
                    goToSlide(currentSlide + 1);
                }, AUTOPLAY_DELAY);
            }

            function resetAutoPlay() {
                if (autoPlayInterval) {
                    clearInterval(autoPlayInterval);
                    startAutoPlay();
                }
            }

            // Eventos de los botones
            prevBtn.addEventListener('click', function() { changeSlide(-1); });
            nextBtn.addEventListener('click', function() { changeSlide(1); });

            // Pausar al hover
            const carouselContainer = document.querySelector('.carousel-container');
            let touchStartX = 0;
            if (carouselContainer) {
                carouselContainer.addEventListener('mouseenter', function() {
                    if (autoPlayInterval) clearInterval(autoPlayInterval);
                });
                carouselContainer.addEventListener('mouseleave', function() {
                    startAutoPlay();
                });
                // También pausar cuando el foco está dentro (accesibilidad)
                carouselContainer.addEventListener('focusin', function() {
                    if (autoPlayInterval) clearInterval(autoPlayInterval);
                });
                carouselContainer.addEventListener('focusout', function() {
                    if (!carouselContainer.contains(document.activeElement)) startAutoPlay();
                });
                carouselContainer.addEventListener('keydown', function(e) {
                    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                        e.preventDefault();
                        changeSlide(e.key === 'ArrowRight' ? 1 : -1);
                    } else if (e.key === 'Home' || e.key === 'End') {
                        e.preventDefault();
                        goToSlide(e.key === 'Home' ? 0 : totalSlides - 1);
                        resetAutoPlay();
                    }
                });
                carouselContainer.addEventListener('touchstart', function(e) {
                    touchStartX = e.changedTouches[0].screenX;
                }, { passive: true });
                carouselContainer.addEventListener('touchend', function(e) {
                    const distance = e.changedTouches[0].screenX - touchStartX;
                    if (Math.abs(distance) > 45) changeSlide(distance < 0 ? 1 : -1);
                });
            }

            document.addEventListener('visibilitychange', function() {
                if (document.hidden) {
                    if (autoPlayInterval) clearInterval(autoPlayInterval);
                } else if (totalSlides > 0) {
                    startAutoPlay();
                }
            });

            // Iniciar autoplay si hay slides
            if (totalSlides > 0) {
                goToSlide(0);
                startAutoPlay();
            }

            // ---- Botón volver arriba ----
            const btnTop = document.getElementById('btnTop');
            if (btnTop) {
                window.addEventListener('scroll', function() {
                    if (window.pageYOffset > 500) {
                        btnTop.classList.add('visible');
                    } else {
                        btnTop.classList.remove('visible');
                    }
                }, { passive: true });

                btnTop.addEventListener('click', function() {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }

            const btnBack = document.getElementById('btnBack');
            if (btnBack) {
                btnBack.addEventListener('click', function() {
                    if (window.history.length > 1) {
                        window.history.back();
                    } else {
                        window.location.hash = 'inicio';
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                });
            }

            // ---- Formulario con EmailJS y fallback seguro ----
            const contactForm = document.getElementById('contactForm');
            const form = document.getElementById('btnEnviar');
            const nombreInput = document.getElementById('nombre');
            const emailInput = document.getElementById('email');
            const asuntoInput = document.getElementById('asunto');
            const mensajeInput = document.getElementById('mensaje');
            const msgEl = document.getElementById('formMsg');

            function showMessage(text, type) {
                msgEl.textContent = text;
                msgEl.className = 'form-msg ' + type;
                msgEl.style.display = 'block';
            }

            function clearMessage() {
                msgEl.className = 'form-msg';
                msgEl.textContent = '';
                msgEl.style.display = 'none';
            }

            // Sanitización básica (prevenir XSS) usando textContent
            function sanitize(str) {
                const temp = document.createElement('div');
                temp.textContent = str;
                return temp.textContent;
            }

            // ---- Seguridad del formulario: honeypot + límite de envíos (anti-spam) ----
            const honeypotInput = document.getElementById('sitioweb');
            const FORM_COOLDOWN_MS = 15000;
            let lastSubmitAt = 0;

            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                clearMessage();

                // Honeypot: si un bot rellenó el campo trampa oculto, se descarta en silencio
                // (no revelamos al bot que fue detectado, para no ayudarlo a afinar el ataque).
                if (honeypotInput && honeypotInput.value.trim() !== '') {
                    return;
                }

                // Límite de frecuencia en cliente: evita envíos repetidos accidentales o
                // automatizados. La protección real de backend correspondería a EmailJS/servidor.
                const now = Date.now();
                if (now - lastSubmitAt < FORM_COOLDOWN_MS) {
                    showMessage('⏳ Espera unos segundos antes de enviar otro mensaje.', 'error');
                    return;
                }

                const nombre = sanitize(nombreInput.value.trim()).slice(0, 80);
                const email = sanitize(emailInput.value.trim()).slice(0, 120);
                const asunto = sanitize(asuntoInput.value.trim()).slice(0, 120);
                const mensaje = sanitize(mensajeInput.value.trim()).slice(0, 2000);

                // Validaciones
                if (!nombre || !email || !mensaje) {
                    showMessage('⚠️ Por favor completa nombre, correo y mensaje.', 'error');
                    return;
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    showMessage('⚠️ Por favor ingresa un correo válido.', 'error');
                    return;
                }

                lastSubmitAt = now;

                // Si EmailJS está configurado, usarlo; si no, fallback a mailto (seguro)
                const isEmailJSConfigured = EMAILJS_CONFIG.publicKey !== 'TU_PUBLIC_KEY';
                const btn = form;
                const originalText = btn.textContent;

                if (isEmailJSConfigured) {
                    btn.textContent = 'Enviando...';
                    btn.disabled = true;

                    emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
                        nombre: nombre,
                        email: email,
                        asunto: asunto || 'Sin asunto',
                        mensaje: mensaje
                    }).then(function() {
                        showMessage('✅ ¡Mensaje enviado! Te responderemos pronto.', 'success');
                        btn.textContent = originalText;
                        btn.disabled = false;
                        nombreInput.value = '';
                        emailInput.value = '';
                        asuntoInput.value = '';
                        mensajeInput.value = '';
                    }, function(error) {
                        showMessage('❌ No fue posible enviar el mensaje. Puede intentarse nuevamente o escribirse directamente a green.hearts.una@gmail.com.', 'error');
                        btn.textContent = originalText;
                        btn.disabled = false;
                        console.error('EmailJS error:', error);
                    });
                } else {
                    // Fallback: abrir cliente de correo (no expone la contraseña, solo el correo destino)
                    const subject = encodeURIComponent((asunto || 'Mensaje desde Green Hearts') + ' — de ' + nombre);
                    const body = encodeURIComponent(
                        'Nombre: ' + nombre + '\n' +
                        'Correo: ' + email + '\n\n' +
                        'Mensaje:\n' + mensaje
                    );
                    window.location.href = 'mailto:green.hearts.una@gmail.com?subject=' + subject + '&body=' + body;
                    showMessage('📧 Se abrirá tu aplicación de correo para enviar el mensaje.', 'success');
                }
            });

            // Limpiar mensaje al empezar a escribir
            document.querySelectorAll('#contacto input, #contacto textarea').forEach(function(input) {
                input.addEventListener('input', clearMessage);
            });

            // =====================================================
            // FAUNA INTERACTIVA DE FONDO
            // Mariposas, colibrí y luciérnagas deambulan por la pantalla con un
            // pequeño motor de "wander + huida del cursor" en requestAnimationFrame.
            // Se detiene por completo si el usuario prefiere menos movimiento.
            // =====================================================
            const wildlifeLayer = document.getElementById('wildlifeLayer');
            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            if (wildlifeLayer && !reduceMotion) {
                const BUTTERFLY_SVG = function(colorA, colorB) {
                    return '<svg viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                        '<path class="wing-l" d="M17 17C10 8 2 8 2 15c0 6 7 8 15 6z" fill="' + colorA + '"/>' +
                        '<path class="wing-r" d="M17 17c7-9 15-9 15-2 0 6-7 8-15 6z" fill="' + colorB + '"/>' +
                        '<ellipse cx="17" cy="17" rx="1.6" ry="7" fill="#2b1d0e"/>' +
                        '</svg>';
                };
                const HUMMINGBIRD_SVG = '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                    '<ellipse cx="21" cy="20" rx="9" ry="6" fill="#0E7C4A"/>' +
                    '<path d="M30 19l9-2-9 5z" fill="#333"/>' +
                    '<path class="wing" d="M18 16c-6-6-14-6-14 0 5 4 10 3 14 0z" fill="#16A362" opacity="0.85"/>' +
                    '<circle cx="14" cy="18" r="4.5" fill="#0E7C4A"/>' +
                    '<circle cx="12.5" cy="17" r="0.8" fill="#fff"/>' +
                    '</svg>';

                const species = [
                    { type: 'butterfly', svg: BUTTERFLY_SVG('#E8871E', '#F4A020'), size: 30 },
                    { type: 'butterfly', svg: BUTTERFLY_SVG('#4A90D9', '#3A72AE'), size: 32 },
                    { type: 'butterfly', svg: BUTTERFLY_SVG('#F2C230', '#89A029'), size: 28 },
                    { type: 'hummingbird', svg: HUMMINGBIRD_SVG, size: 38 },
                    { type: 'firefly', svg: '', size: 8 },
                    { type: 'firefly', svg: '', size: 8 }
                ];

                const critters = species.map(function(spec) {
                    const el = document.createElement('div');
                    el.className = 'critter ' + spec.type;
                    el.setAttribute('tabindex', '-1');
                    if (spec.svg) el.innerHTML = spec.svg;
                    wildlifeLayer.appendChild(el);
                    return {
                        el: el,
                        type: spec.type,
                        size: spec.size,
                        x: Math.random() * (window.innerWidth - spec.size),
                        y: Math.random() * (window.innerHeight - spec.size),
                        angle: Math.random() * Math.PI * 2,
                        speed: spec.type === 'hummingbird' ? 2.6 : spec.type === 'firefly' ? 0.5 : 1.1
                    };
                });

                let mouseX = -9999, mouseY = -9999;
                window.addEventListener('mousemove', function(e) {
                    mouseX = e.clientX;
                    mouseY = e.clientY;
                }, { passive: true });
                window.addEventListener('mouseleave', function() {
                    mouseX = -9999;
                    mouseY = -9999;
                });

                critters.forEach(function(c) {
                    c.el.addEventListener('click', function() {
                        c.angle += Math.PI + (Math.random() - 0.5);
                        c.el.classList.remove('critter-scatter');
                        void c.el.offsetWidth; // reinicia la animación
                        c.el.classList.add('critter-scatter');
                    });
                });

                const runnerSpecies = species.filter(function(spec) { return spec.svg; });

                function spawnAnimalRunner(clientY) {
                    const spec = runnerSpecies[Math.floor(Math.random() * runnerSpecies.length)];
                    const runner = document.createElement('div');
                    runner.className = 'animal-runner ' + spec.type;
                    runner.innerHTML = spec.svg;
                    runner.style.top = Math.max(90, Math.min(window.innerHeight - 90, clientY || window.innerHeight * (0.3 + Math.random() * 0.45))) + 'px';
                    wildlifeLayer.appendChild(runner);
                    window.setTimeout(function() { runner.remove(); }, 2000);
                }

                document.addEventListener('click', function(e) {
                    const control = e.target.closest('button, a');
                    if (!control) return;
                    control.classList.remove('click-pulse');
                    void control.offsetWidth;
                    control.classList.add('click-pulse');
                    window.setTimeout(function() { control.classList.remove('click-pulse'); }, 450);
                    spawnAnimalRunner(e.clientY);
                });

                function tick() {
                    const w = window.innerWidth, h = window.innerHeight;
                    critters.forEach(function(c) {
                        // Deambular: pequeño giro aleatorio del rumbo
                        c.angle += (Math.random() - 0.5) * 0.35;

                        // Huir del cursor si está cerca
                        const dx = (c.x + c.size / 2) - mouseX;
                        const dy = (c.y + c.size / 2) - mouseY;
                        const dist = Math.hypot(dx, dy);
                        const fleeRadius = 110;
                        if (dist < fleeRadius) {
                            c.angle = Math.atan2(dy, dx);
                            c.x += Math.cos(c.angle) * (c.speed * 2.2);
                            c.y += Math.sin(c.angle) * (c.speed * 2.2);
                        } else {
                            c.x += Math.cos(c.angle) * c.speed;
                            c.y += Math.sin(c.angle) * c.speed;
                        }

                        // Envolver en los bordes de la pantalla
                        if (c.x < -c.size) c.x = w;
                        if (c.x > w) c.x = -c.size;
                        if (c.y < -c.size) c.y = h;
                        if (c.y > h) c.y = -c.size;

                        const facing = Math.cos(c.angle) < 0 ? -1 : 1;
                        c.el.style.transform = 'translate(' + c.x + 'px,' + c.y + 'px) scaleX(' + facing + ')';
                    });
                    requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
            }

        }); // Fin DOMContentLoaded
