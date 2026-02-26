/* =====================================================================
   hydrate.js — Abhyudaya Website Dynamic Content Renderer
   Rebuilds ALL sections from SITE_DATA so new content added via Admin
   is always visible. Supports "Load More", YouTube auto-thumbnails,
   search, and sort order.
   ===================================================================== */

const INITIAL_SHOW = { gallery: 6, testimonials: 6, studentLife: 6, videos: 4 };

/* ── Helper: extract YouTube video ID from any URL or raw ID ─────── */
function extractYouTubeId(input) {
    if (!input) return '';
    try {
        if (input.includes('youtube.com') || input.includes('youtu.be')) {
            const url = new URL(input);
            return url.searchParams.get('v') || url.pathname.replace('/', '');
        }
    } catch (_) {}
    return input.trim();
}

/* ── Helper: get YouTube thumbnail URL from videoId ─────────────── */
function ytThumb(videoId) {
    const id = extractYouTubeId(videoId);
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

/* ── Helper: create "Load More" button ───────────────────────────── */
function createLoadMoreBtn(label, onClick) {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'text-align:center; margin-top: 3rem;';
    wrapper.innerHTML = `
        <button class="load-more-btn" style="
            display: inline-flex; align-items: center; gap: 0.75rem;
            padding: 1rem 2.5rem;
            background: rgba(255,107,0,0.1);
            border: 2px solid rgba(255,107,0,0.4);
            color: #ff6b00; border-radius: 100px;
            font-family: 'Inter', sans-serif; font-size: 1rem; font-weight: 700;
            cursor: pointer; transition: all 0.4s; letter-spacing: 0.02em;
        " onmouseenter="this.style.background='rgba(255,107,0,0.2)';this.style.borderColor='#ff6b00';this.style.transform='translateY(-3px)'"
           onmouseleave="this.style.background='rgba(255,107,0,0.1)';this.style.borderColor='rgba(255,107,0,0.4)';this.style.transform=''"
        >
            <i class="ri-add-circle-line"></i> ${label}
        </button>`;
    wrapper.querySelector('button').addEventListener('click', onClick);
    return wrapper;
}

document.addEventListener('DOMContentLoaded', async () => {
    if (window.loadDataFromFirebase) {
        window.SITE_DATA = await window.loadDataFromFirebase();
    }
    const data = window.SITE_DATA;

    // ── ANNOUNCEMENT ────────────────────────────────────────────────
    if (data.announcement && data.announcement.enabled) {
        const bar = document.getElementById('announcementBar');
        const textObj = document.getElementById('announcementText');
        const linkObj = document.getElementById('announcementLink');
        if (bar && textObj && linkObj && data.announcement.text) {
            textObj.innerText = data.announcement.text;
            if (data.announcement.link && data.announcement.linkText) {
                linkObj.href = data.announcement.link;
                linkObj.innerText = data.announcement.linkText;
            } else {
                linkObj.style.display = 'none';
            }
            bar.style.display = 'block';
            if (window.gsap) gsap.from(bar, { y: -50, opacity: 0, duration: 1, ease: 'power3.out', delay: 2 });
        }
    }

    // ── HERO ────────────────────────────────────────────────────────
    const heroTitle1 = document.querySelector('.hero-title .line:nth-child(1) span');
    if (heroTitle1) heroTitle1.innerText = data.hero.titleLine1;
    const heroTitle2 = document.querySelector('.hero-title .line:nth-child(2) span.gradient-text');
    if (heroTitle2) heroTitle2.innerText = data.hero.titleLine2;
    const heroBadge = document.querySelector('.hero-badge span');
    if (heroBadge) heroBadge.innerText = data.hero.badgeText;
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) heroSubtitle.innerText = data.hero.subtitle;
    const heroLoc = document.querySelector('.hero-location span');
    if (heroLoc) heroLoc.innerText = data.hero.location;

    // ── USP BANNER ──────────────────────────────────────────────────
    const uspTitle = document.querySelector('.usp-title');
    if (uspTitle) {
        uspTitle.innerHTML = `<span class="usp-highlight">${data.uspBanner.titleLine1.split('•')[0].trim()}</span> • ${data.uspBanner.titleLine1.split('•')[1] || ''}<br>${data.uspBanner.titleLine2}`;
    }
    const uspDesc = document.querySelector('.usp-content p');
    if (uspDesc) uspDesc.innerText = data.uspBanner.description;

    // ── STATS ───────────────────────────────────────────────────────
    const statCards = document.querySelectorAll('.stats-grid .stat-card');
    statCards.forEach((card, i) => {
        if (data.stats[i]) {
            card.querySelector('.stat-number').setAttribute('data-target', data.stats[i].count);
            card.querySelector('.stat-number').innerText = '0';
            card.querySelector('.stat-label').innerText = data.stats[i].label;
        }
    });

    // ── ABOUT ───────────────────────────────────────────────────────
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        aboutSection.querySelector('.section-tag').innerText = data.about.tag;
        aboutSection.querySelector('.section-title').innerText = data.about.title;
        aboutSection.querySelector('.section-subtitle').innerText = data.about.subtitle;
        const aboutCards = aboutSection.querySelectorAll('.cards-grid .card');
        aboutCards.forEach((card, i) => {
            if (data.about.cards[i]) {
                card.querySelector('.card-icon i').className = data.about.cards[i].icon;
                card.querySelector('h3').innerText = data.about.cards[i].title;
                card.querySelector('p').innerText = data.about.cards[i].description;
            }
        });
    }

    // ── PROGRAMS ────────────────────────────────────────────────────
    const progSection = document.getElementById('programs');
    if (progSection) {
        progSection.querySelector('.section-tag').innerText = data.programs.tag;
        progSection.querySelector('.section-title').innerText = data.programs.title;
        progSection.querySelector('.section-subtitle').innerText = data.programs.subtitle;
        const progCards = progSection.querySelectorAll('.cards-grid .card');
        progCards.forEach((card, i) => {
            if (data.programs.cards[i]) {
                card.querySelector('.card-icon i').className = data.programs.cards[i].icon;
                card.querySelector('h3').innerText = data.programs.cards[i].title;
                card.querySelector('p').innerText = data.programs.cards[i].description;
                const featuresList = card.querySelector('.card-features');
                if (featuresList && data.programs.cards[i].features) {
                    featuresList.innerHTML = '';
                    data.programs.cards[i].features.forEach(feat => {
                        const li = document.createElement('li');
                        li.innerText = feat;
                        featuresList.appendChild(li);
                    });
                }
            }
        });
    }

    // ── TESTIMONIALS — Full rebuild with Load More ───────────────────
    renderTestimonials(data.testimonials);

    // ── STUDENT LIFE — Full rebuild with Load More ───────────────────
    renderStudentLife(data.studentLife);

    // ── VIDEOS (Flipbook) — Full rebuild ────────────────────────────
    renderVideos(data.videos);

    // ── GALLERY — Full rebuild with Load More ───────────────────────
    renderGallery(data.gallery);

    // ── CONTACT ─────────────────────────────────────────────────────
    const contactInfo = document.querySelector('.contact-info');
    if (contactInfo) {
        contactInfo.querySelector('.contact-info-header p').innerText = data.contact.locationDesc;
        const methods = contactInfo.querySelectorAll('.contact-method');
        if (methods[0]) { methods[0].href = `tel:${data.contact.phone}`; methods[0].querySelector('p').innerText = data.contact.phoneDisplay; }
        if (methods[1]) { methods[1].href = `https://wa.me/${data.contact.whatsapp}?text=Hello!`; }
        if (methods[2]) { methods[2].href = `mailto:${data.contact.email}`; methods[2].querySelector('p').innerText = data.contact.email; }
        if (methods[3]) { methods[3].href = data.contact.mapUrl || '#'; methods[3].querySelector('p').innerText = data.contact.address; }
    }
});

/* ═══════════════════════════════════════════════════════════════════
   SECTION RENDERERS — All fully rebuild DOM from data array
   ═══════════════════════════════════════════════════════════════════ */

/* ── TESTIMONIALS ────────────────────────────────────────────────── */
function renderTestimonials(items) {
    const grid = document.querySelector('.testimonials-grid');
    if (!grid) return;
    const show = INITIAL_SHOW.testimonials;
    grid.innerHTML = '';

    items.slice(0, show).forEach(t => grid.appendChild(buildTestimonialCard(t)));

    if (items.length > show) {
        let shown = show;
        const btn = createLoadMoreBtn(`Load More Reviews (${items.length - show} more)`, () => {
            items.slice(shown).forEach(t => {
                const card = buildTestimonialCard(t);
                card.style.animation = 'fadeInUp 0.5s ease both';
                grid.appendChild(card);
            });
            shown = items.length;
            btn.remove();
        });
        grid.parentElement.appendChild(btn);
    }
}

function buildTestimonialCard(t) {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.innerHTML = `
        <div class="testimonial-header">
            <div class="testimonial-avatar">${t.avatar || '?'}</div>
            <div class="testimonial-info">
                <h4>${t.name || ''}</h4>
                <span class="role">${t.role || ''}</span>
            </div>
        </div>
        <p class="testimonial-text">${t.text || ''}</p>
        <div class="testimonial-rating">
            <i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i>
        </div>`;
    return card;
}

/* ── STUDENT LIFE ────────────────────────────────────────────────── */
function renderStudentLife(items) {
    const grid = document.querySelector('.life-grid');
    if (!grid) return;
    const show = INITIAL_SHOW.studentLife;
    grid.innerHTML = '';

    items.slice(0, show).forEach(s => grid.appendChild(buildLifeCard(s)));

    if (items.length > show) {
        let shown = show;
        const btn = createLoadMoreBtn(`Load More Activities (${items.length - show} more)`, () => {
            items.slice(shown).forEach(s => {
                const card = buildLifeCard(s);
                card.style.animation = 'fadeInUp 0.5s ease both';
                grid.appendChild(card);
            });
            shown = items.length;
            btn.remove();
        });
        grid.parentElement.appendChild(btn);
    }
}

function buildLifeCard(s) {
    const card = document.createElement('div');
    card.className = 'life-card';
    card.innerHTML = `
        <img src="${s.image || ''}" alt="${s.title || ''}" loading="lazy" style="width:100%;height:100%;object-fit:cover;transition:transform 0.6s;">
        <div class="life-icon"><i class="${s.icon || 'ri-image-line'}"></i></div>
        <div class="life-card-overlay">
            <h3>${s.title || ''}</h3>
            <p>${s.description || ''}</p>
        </div>`;
    return card;
}

/* ── GALLERY ─────────────────────────────────────────────────────── */
function renderGallery(items) {
    const grid = document.querySelector('.gallery-grid');
    if (!grid) return;
    const show = INITIAL_SHOW.gallery;
    grid.innerHTML = '';

    items.slice(0, show).forEach(g => grid.appendChild(buildGalleryItem(g)));

    if (items.length > show) {
        let shown = show;
        const btn = createLoadMoreBtn(`View More Photos (${items.length - show} more)`, () => {
            items.slice(shown).forEach(g => {
                const item = buildGalleryItem(g);
                item.style.animation = 'fadeInUp 0.5s ease both';
                grid.appendChild(item);
            });
            shown = items.length;
            btn.remove();
        });
        grid.parentElement.appendChild(btn);
    }
}

function buildGalleryItem(g) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
        <img src="${g.image || ''}" alt="${g.title || ''}" loading="lazy">
        <div class="gallery-overlay">
            <h3>${g.title || ''}</h3>
            <p>${g.subtitle || ''}</p>
        </div>`;
    return item;
}

/* ── VIDEOS (Flipbook) — rebuilds flipbook pages from data ──────── */
function renderVideos(videos) {
    const flipbook = document.querySelector('.flipbook');
    if (!flipbook) return;

    // Clear and rebuild
    flipbook.innerHTML = '';

    const show = Math.min(videos.length, INITIAL_SHOW.videos);
    const initialVideos = videos.slice(0, show);

    initialVideos.forEach((v, i) => {
        const thumb = (v.thumbnail && !v.thumbnail.includes('unsplash') && v.thumbnail.trim() !== '')
            ? v.thumbnail
            : ytThumb(v.videoId);
        const page = document.createElement('div');
        page.className = 'flipbook-page';
        page.style.zIndex = show - i;
        page.innerHTML = `
            <div class="flipbook-page-front">
                <img src="${thumb}" alt="${v.title || ''}" loading="lazy" style="width:100%;height:100%;object-fit:cover;">
                <div class="page-overlay"></div>
                <div class="page-info">
                    <h3>${v.title || ''}</h3>
                    <p>${v.subtitle || ''}</p>
                </div>
                <button class="play-button" data-video-id="${extractYouTubeId(v.videoId)}">
                    <i class="ri-play-fill"></i>
                </button>
            </div>
            <div class="flipbook-page-back">
                <div class="back-content">
                    <i class="${v.backIcon || 'ri-video-line'}" style="color:${v.backIconColor || 'var(--primary)'}"></i>
                    <h3>${v.backTitle || v.title || ''}</h3>
                    <p>${v.backDesc || v.subtitle || ''}</p>
                </div>
            </div>`;

        page.querySelector('.play-button').addEventListener('click', (e) => {
            e.stopPropagation();
            openYoutubeModal(v.videoId);
        });

        flipbook.appendChild(page);
    });

    // Re-init flipbook navigation
    initFlipbookNav(flipbook, videos, show);
}

function initFlipbookNav(flipbook, allVideos, initialShown) {
    const navEl = document.querySelector('.flipbook-nav');
    if (!navEl) return;

    let currentPage = 0;
    const pages = () => flipbook.querySelectorAll('.flipbook-page');

    function updateFlipbook() {
        const all = pages();
        all.forEach((page, i) => {
            page.classList.toggle('flipped', i < currentPage);
            page.style.zIndex = i < currentPage
                ? (i + 1)
                : (all.length - i + initialShown);
        });
        navEl.querySelector('#prevBtn').disabled = currentPage === 0;
        navEl.querySelector('#nextBtn').disabled = currentPage >= all.length;
    }

    navEl.querySelector('#prevBtn').onclick = () => {
        if (currentPage > 0) { currentPage--; updateFlipbook(); }
    };
    navEl.querySelector('#nextBtn').onclick = () => {
        if (currentPage < pages().length) { currentPage++; updateFlipbook(); }
    };

    pages().forEach((page, idx) => {
        page.addEventListener('click', () => {
            if (idx === currentPage) { currentPage++; updateFlipbook(); }
        });
    });

    updateFlipbook();
}

/* ═══════════════════════════════════════════════════════════════════
   YOUTUBE MODAL
   ═══════════════════════════════════════════════════════════════════ */
function createYoutubeModal() {
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="modal-overlay yt-modal" id="ytModal" style="display:none; justify-content:center; align-items:center; z-index:999999;">
            <div class="modal-content" style="padding:1rem; width:90%; max-width:900px; background:#000; position:relative; aspect-ratio:16/9; border:2px solid var(--primary);">
                <button onclick="closeYoutubeModal()" style="position:absolute; top:-40px; right:0; background:transparent; border:none; color:#fff; font-size:2rem; cursor:pointer;"><i class="ri-close-line"></i></button>
                <iframe id="ytIframe" width="100%" height="100%" src="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        </div>`;
    document.body.appendChild(div);
    document.getElementById('ytModal').addEventListener('click', e => {
        if (e.target.id === 'ytModal') closeYoutubeModal();
    });
}

function openYoutubeModal(videoId) {
    let modal = document.getElementById('ytModal');
    if (!modal) { createYoutubeModal(); modal = document.getElementById('ytModal'); }
    const finalId = extractYouTubeId(videoId);
    document.getElementById('ytIframe').src = `https://www.youtube.com/embed/${finalId}?autoplay=1`;
    modal.style.display = 'flex';
    setTimeout(() => { modal.classList.add('active'); modal.style.visibility = 'visible'; }, 10);
}

function closeYoutubeModal() {
    const modal = document.getElementById('ytModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => { modal.style.display = 'none'; document.getElementById('ytIframe').src = ''; }, 400);
    }
}

/* ═══════════════════════════════════════════════════════════════════
   CONTACT FORM SUBMISSION
   ═══════════════════════════════════════════════════════════════════ */
window.submitContactForm = async function () {
    const submitBtn = document.getElementById('contactSubmitBtn');
    const submitText = document.getElementById('contactSubmitText');
    const submitIcon = document.getElementById('contactSubmitIcon');
    const form = document.getElementById('contactForm');
    const originalText = submitText.innerText;
    const originalIcon = submitIcon.className;

    submitBtn.disabled = true;
    submitText.innerText = 'Sending...';
    submitIcon.className = 'ri-loader-4-line ri-spin';

    const payload = {
        firstName: document.getElementById('contactFirstName').value,
        lastName: document.getElementById('contactLastName').value,
        email: document.getElementById('contactEmail').value,
        phone: document.getElementById('contactPhone').value,
        program: document.getElementById('contactProgram').value,
        message: document.getElementById('contactMessage').value,
        timestamp: new Date().toISOString()
    };

    try {
        if (window.firebaseInitPromise) await window.firebaseInitPromise;
        if (!window.db) throw new Error('Firebase not initialized');
        await window.db.ref('contact_submissions').push(payload);
        submitText.innerText = 'Sent Successfully!';
        submitIcon.className = 'ri-check-line';
        submitBtn.style.background = '#22c55e';
        form.reset();
        setTimeout(() => { submitText.innerText = originalText; submitIcon.className = originalIcon; submitBtn.style.background = ''; submitBtn.disabled = false; }, 5000);
    } catch (e) {
        console.error(e);
        submitText.innerText = 'Failed. Try WhatsApp!';
        submitIcon.className = 'ri-error-warning-line';
        submitBtn.style.background = '#ef4444';
        setTimeout(() => { submitText.innerText = originalText; submitIcon.className = originalIcon; submitBtn.style.background = ''; submitBtn.disabled = false; }, 4000);
    }
};

/* ── FadeInUp animation for Load More items ─────────────────────── */
const style = document.createElement('style');
style.textContent = `@keyframes fadeInUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }`;
document.head.appendChild(style);
