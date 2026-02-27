/* =====================================================================
   hydrate.js — Abhyudaya Website Dynamic Content Renderer
   Fully rebuilds Gallery, Testimonials, Student Life from SITE_DATA.
   Videos section: updates existing flipbook pages AND adds extras.
   Supports "Load More", auto-YouTube thumbnails.
   ===================================================================== */

const INITIAL_SHOW = { gallery: 6, testimonials: 6, studentLife: 6 };

/* ── Extract YouTube video ID from any URL or raw ID ────────────── */
function extractYouTubeId(input) {
    if (!input) return '';
    try {
        let u = new URL(input);
        if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
            if (u.pathname.startsWith('/shorts/')) return u.pathname.split('/shorts/')[1].split('?')[0];
            if (u.searchParams.has('v')) return u.searchParams.get('v');
            if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
            if (u.pathname.startsWith('/embed/')) return u.pathname.split('/embed/')[1];
        }
    } catch (_) { }

    // Fallback regex if URL parse fails or it's a raw string
    const match = input.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/);
    return (match && match[2] && match[2].length >= 10) ? match[2] : input.trim();
}

/* ── Get YouTube thumbnail URL ────────────────────────────────────── */
function ytThumb(videoId) {
    const id = extractYouTubeId(videoId);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
}

/* ── Resolve best thumbnail URL ──────────────────────────────────── */
function resolveThumbnail(v) {
    if (v.thumbnail && v.thumbnail.trim() !== '' && !v.thumbnail.includes('unsplash.com')) {
        return v.thumbnail;
    }
    return ytThumb(v.videoId) || v.thumbnail || '';
}

/* ── Create "Load More" button ───────────────────────────────────── */
function createLoadMoreBtn(label, onClick) {
    const wrapper = document.createElement('div');
    wrapper.className = 'load-more-wrapper';
    wrapper.style.cssText = 'text-align:center; margin-top: 3rem;';
    const btn = document.createElement('button');
    btn.innerHTML = `<i class="ri-add-circle-line"></i> ${label}`;
    btn.style.cssText = `
        display: inline-flex; align-items: center; gap: 0.75rem;
        padding: 1rem 2.5rem;
        background: rgba(255,107,0,0.1);
        border: 2px solid rgba(255,107,0,0.4);
        color: #ff6b00; border-radius: 100px;
        font-family: 'Inter', sans-serif; font-size: 1rem; font-weight: 700;
        cursor: pointer; transition: all 0.4s;`;
    btn.onmouseenter = () => { btn.style.background = 'rgba(255,107,0,0.2)'; btn.style.borderColor = '#ff6b00'; btn.style.transform = 'translateY(-3px)'; };
    btn.onmouseleave = () => { btn.style.background = 'rgba(255,107,0,0.1)'; btn.style.borderColor = 'rgba(255,107,0,0.4)'; btn.style.transform = ''; };
    btn.addEventListener('click', onClick);
    wrapper.appendChild(btn);
    return wrapper;
}

/* ── FadeIn animation for new items ──────────────────────────────── */
const _style = document.createElement('style');
_style.textContent = `@keyframes fadeInUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }`;
document.head.appendChild(_style);

/* =====================================================================
   MAIN ENTRY POINT
   ===================================================================== */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        if (window.loadDataFromFirebase) {
            window.SITE_DATA = await window.loadDataFromFirebase();
        }
    } catch (e) {
        console.warn('Firebase load failed, using local data:', e);
    }

    const data = window.SITE_DATA;
    if (!data) return;

    try { hydrateAnnouncement(data); } catch (e) { console.warn('Announcement error:', e); }
    try { hydrateHero(data); } catch (e) { console.warn('Hero error:', e); }
    try { hydrateUSP(data); } catch (e) { console.warn('USP error:', e); }
    try { hydrateStats(data); } catch (e) { console.warn('Stats error:', e); }
    try { hydrateAbout(data); } catch (e) { console.warn('About error:', e); }
    try { hydratePrograms(data); } catch (e) { console.warn('Programs error:', e); }
    try { hydrateTestimonials(data); } catch (e) { console.warn('Testimonials error:', e); }
    try { hydrateStudentLife(data); } catch (e) { console.warn('StudentLife error:', e); }
    try { hydrateVideos(data); } catch (e) { console.warn('Videos error:', e); }
    try { hydrateGallery(data); } catch (e) { console.warn('Gallery error:', e); }
    try { hydrateContact(data); } catch (e) { console.warn('Contact error:', e); }

    // Re-initialize GSAP animations to account for freshly added items
    if (typeof window.refreshGSAP === 'function') {
        window.refreshGSAP();
    }
});

/* ═══════════════════════════════════════════════════════════════════
   SECTION UPDATERS
   ═══════════════════════════════════════════════════════════════════ */

function hydrateAnnouncement(data) {
    const ann = data.announcement || {};
    // Treat 'true' string as boolean true
    const isEnabled = ann.enabled === true || ann.enabled === 'true';

    if (!isEnabled) {
        const bar = document.getElementById('announcementBar');
        if (bar) bar.style.display = 'none';
        const nav = document.getElementById('navbar');
        if (nav) nav.style.top = '0';
        return;
    }

    const bar = document.getElementById('announcementBar');
    const textObj = document.getElementById('announcementText');
    const linkObj = document.getElementById('announcementLink');
    if (!bar || !textObj || !linkObj || !ann.text) return;

    bar.className = `theme-${ann.theme || 'classic'}`;
    textObj.innerText = ann.text;

    if (ann.link && ann.linkText) {
        linkObj.href = ann.link;
        const linkSpan = linkObj.querySelector('span');
        if (linkSpan) linkSpan.innerText = ann.linkText;
        linkObj.style.display = 'inline-flex';
    } else {
        linkObj.style.display = 'none';
    }

    bar.style.display = 'flex';

    // Push the navbar down by the height of the announcement bar
    setTimeout(() => {
        const nav = document.getElementById('navbar');
        if (nav) {
            nav.style.top = bar.offsetHeight + 'px';
            nav.style.transition = 'top 0.3s ease, padding 0.3s, background 0.3s';
        }
    }, 50);
}

function hydrateHero(data) {
    const t1 = document.querySelector('.hero-title .line:nth-child(1) span');
    if (t1) t1.innerText = data.hero.titleLine1;
    const t2 = document.querySelector('.hero-title .line:nth-child(2) span.gradient-text');
    if (t2) t2.innerText = data.hero.titleLine2;
    const badge = document.querySelector('.hero-badge span');
    if (badge) badge.innerText = data.hero.badgeText;
    const sub = document.querySelector('.hero-subtitle');
    if (sub) sub.innerText = data.hero.subtitle;
    const loc = document.querySelector('.hero-location span');
    if (loc) loc.innerText = data.hero.location;
}

function hydrateUSP(data) {
    const title = document.querySelector('.usp-title');
    if (title) {
        const parts = data.uspBanner.titleLine1.split('•');
        title.innerHTML = `<span class="usp-highlight">${(parts[0] || '').trim()}</span> • ${parts[1] || ''}<br>${data.uspBanner.titleLine2}`;
    }
    const desc = document.querySelector('.usp-content p');
    if (desc) desc.innerText = data.uspBanner.description;
}

function hydrateStats(data) {
    const grid = document.querySelector('.stats-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const items = data.stats || [];
    items.forEach(st => {
        const card = document.createElement('div');
        card.className = 'stat-card';
        card.innerHTML = `
            <div class="stat-number" data-target="${st.count || 0}">0</div>
            <div class="stat-label">${st.label || ''}</div>
        `;
        grid.appendChild(card);
    });
}

function hydrateAbout(data) {
    const section = document.getElementById('about');
    if (!section) return;
    const tag = section.querySelector('.section-tag');
    if (tag) tag.innerText = data.about.tag;
    const title = section.querySelector('.section-title');
    if (title) title.innerText = data.about.title;
    const sub = section.querySelector('.section-subtitle');
    if (sub) sub.innerText = data.about.subtitle;

    const grid = section.querySelector('.cards-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const cards = data.about.cards || [];
    cards.forEach(c => {
        const card = document.createElement('div');
        card.className = 'card reveal';
        card.innerHTML = `
            <div class="card-icon"><i class="${c.icon || 'ri-award-line'}"></i></div>
            <h3>${c.title || ''}</h3>
            <p>${c.description || ''}</p>
        `;
        grid.appendChild(card);
    });
}

function hydratePrograms(data) {
    const section = document.getElementById('programs');
    if (!section) return;
    const tag = section.querySelector('.section-tag');
    if (tag) tag.innerText = data.programs.tag;
    const title = section.querySelector('.section-title');
    if (title) title.innerText = data.programs.title;
    const sub = section.querySelector('.section-subtitle');
    if (sub) sub.innerText = data.programs.subtitle;

    const grid = section.querySelector('.cards-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const cards = data.programs.cards || [];
    cards.forEach((c, idx) => {
        const colors = [
            'linear-gradient(135deg, #ff6b00, #ff8533)',
            'linear-gradient(135deg, #d4af37, #f59e0b)',
            'linear-gradient(135deg, #1e3a8a, #3b82f6)',
            'linear-gradient(135deg, #10b981, #34d399)'
        ];
        const bg = colors[idx % colors.length];

        const card = document.createElement('div');
        card.className = 'card reveal';

        const fList = (c.features || []).map(f => `<li>${f}</li>`).join('');

        card.innerHTML = `
            <div class="card-icon" style="background: ${bg};"><i class="${c.icon || 'ri-graduation-cap-line'}"></i></div>
            <h3>${c.title || ''}</h3>
            <p>${c.description || ''}</p>
            <ul class="card-features">${fList}</ul>
        `;
        grid.appendChild(card);
    });
}

/* ── TESTIMONIALS — Full rebuild ─────────────────────────────────── */
function hydrateTestimonials(data) {
    const grid = document.querySelector('.testimonials-grid');
    if (!grid) return;
    const items = data.testimonials || [];
    const show = INITIAL_SHOW.testimonials;
    grid.innerHTML = '';
    items.slice(0, show).forEach(t => grid.appendChild(buildTestimonialCard(t)));
    // Remove any old load-more
    const old = grid.parentElement.querySelector('.load-more-wrapper');
    if (old) old.remove();
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

/* ── STUDENT LIFE — Full rebuild ─────────────────────────────────── */
function hydrateStudentLife(data) {
    const grid = document.querySelector('.life-grid');
    if (!grid) return;
    const items = data.studentLife || [];
    const show = INITIAL_SHOW.studentLife;
    grid.innerHTML = '';
    items.slice(0, show).forEach(s => grid.appendChild(buildLifeCard(s)));
    const old = grid.parentElement.querySelector('.load-more-wrapper');
    if (old) old.remove();
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
        <img src="${s.image || ''}" alt="${s.title || ''}" loading="lazy"
            style="width:100%;height:100%;object-fit:cover;transition:transform 0.6s;position:absolute;top:0;left:0;">
        <div class="life-icon"><i class="${s.icon || 'ri-image-line'}"></i></div>
        <div class="life-card-overlay">
            <h3>${s.title || ''}</h3>
            <p>${s.description || ''}</p>
        </div>`;
    return card;
}

/* ── VIDEOS — Update existing flipbook pages + handle extras ─────── */
function hydrateVideos(data) {
    const flipbook = document.querySelector('.flipbook');
    if (!flipbook) return;
    const videos = data.videos || [];
    const pages = flipbook.querySelectorAll('.flipbook-page');

    // Update existing pages
    pages.forEach((page, i) => {
        if (!videos[i]) return;
        const v = videos[i];
        const thumb = resolveThumbnail(v);

        // Front: update image + text
        const imgEl = page.querySelector('.flipbook-page-front img');
        if (imgEl) imgEl.src = thumb;
        const h3 = page.querySelector('.page-info h3');
        if (h3) h3.innerText = v.title || '';
        const p = page.querySelector('.page-info p');
        if (p) p.innerText = v.subtitle || '';

        // Play button — set up click handler
        const playBtn = page.querySelector('.play-button');
        if (playBtn) {
            const newBtn = playBtn.cloneNode(true); // remove old listeners
            playBtn.parentNode.replaceChild(newBtn, playBtn);
            newBtn.addEventListener('click', e => {
                e.stopPropagation();
                openYoutubeModal(v.videoId);
            });
        }

        // Back: update text
        const backIcon = page.querySelector('.flipbook-page-back i');
        if (backIcon && v.backIcon) { backIcon.className = v.backIcon; backIcon.style.color = v.backIconColor || 'var(--primary)'; }
        const backH3 = page.querySelector('.flipbook-page-back h3');
        if (backH3) backH3.innerText = v.backTitle || v.title || '';
        const backP = page.querySelector('.flipbook-page-back p');
        if (backP) backP.innerText = v.backDesc || '';
    });

    // If there are MORE videos than HTML pages, render them in an extra grid
    const container = flipbook.closest('.flipbook-container') || flipbook.parentElement;
    let extraGrid = document.getElementById('extraVideosGrid');
    if (extraGrid) extraGrid.remove(); // clear old

    const oldBtn = container.querySelector('.load-more-wrapper');
    if (oldBtn) oldBtn.remove();

    if (videos.length > pages.length) {
        const extraVideos = videos.slice(pages.length);

        extraGrid = document.createElement('div');
        extraGrid.id = 'extraVideosGrid';
        extraGrid.style.display = 'grid';
        extraGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
        extraGrid.style.gap = '2rem';
        extraGrid.style.marginTop = '4rem';
        extraGrid.style.display = 'none';

        extraVideos.forEach(v => {
            const thumb = resolveThumbnail(v);
            const card = document.createElement('div');
            card.style.position = 'relative';
            card.style.borderRadius = '1rem';
            card.style.overflow = 'hidden';
            card.style.cursor = 'pointer';
            card.style.aspectRatio = '16/9';
            card.style.border = '1px solid rgba(255,255,255,0.1)';
            card.style.transition = 'transform 0.3s, border-color 0.3s';
            card.onmouseenter = () => { card.style.transform = 'translateY(-5px)'; card.style.borderColor = 'var(--primary)'; };
            card.onmouseleave = () => { card.style.transform = ''; card.style.borderColor = 'rgba(255,255,255,0.1)'; };

            card.innerHTML = `
                <img src="${thumb}" style="width:100%; height:100%; object-fit:cover;" loading="lazy">
                <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.9), transparent); display:flex; flex-direction:column; justify-content:flex-end; padding:1.5rem;">
                    <h3 style="font-family:'Syne', sans-serif; font-size:1.2rem; margin-bottom:0.25rem;">${v.title || ''}</h3>
                    <p style="color:rgba(255,255,255,0.7); font-size:0.875rem;">${v.subtitle || ''}</p>
                </div>
                <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:50px; height:50px; background:rgba(255,107,0,0.9); border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:1.5rem;"><i class="ri-play-fill"></i></div>
            `;
            card.addEventListener('click', () => openYoutubeModal(v.videoId));
            extraGrid.appendChild(card);
        });

        container.appendChild(extraGrid);

        const btn = createLoadMoreBtn(`View ${extraVideos.length} More Video${extraVideos.length > 1 ? 's' : ''}`, () => {
            extraGrid.style.display = 'grid';
            extraGrid.style.animation = 'fadeInUp 0.5s ease both';
            btn.remove();
        });
        container.appendChild(btn);
    }
}

/* ── GALLERY — Full rebuild ──────────────────────────────────────── */
function hydrateGallery(data) {
    const grid = document.querySelector('.gallery-grid');
    if (!grid) return;
    const items = data.gallery || [];
    const show = INITIAL_SHOW.gallery;
    grid.innerHTML = '';
    items.slice(0, show).forEach(g => grid.appendChild(buildGalleryItem(g)));
    const old = grid.parentElement.querySelector('.load-more-wrapper');
    if (old) old.remove();
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

/* ── CONTACT ──────────────────────────────────────────────────────── */
function hydrateContact(data) {
    const contactInfo = document.querySelector('.contact-info');
    if (!contactInfo || !data.contact) return;
    const headerP = contactInfo.querySelector('.contact-info-header p');
    if (headerP) headerP.innerText = data.contact.locationDesc;
    const methods = contactInfo.querySelectorAll('.contact-method');
    if (methods[0]) { methods[0].href = `tel:${data.contact.phone}`; const p = methods[0].querySelector('p'); if (p) p.innerText = data.contact.phoneDisplay; }
    if (methods[1]) { methods[1].href = `https://wa.me/${data.contact.whatsapp}?text=Hello!`; }
    if (methods[2]) { methods[2].href = `mailto:${data.contact.email}`; const p = methods[2].querySelector('p'); if (p) p.innerText = data.contact.email; }
    if (methods[3]) { methods[3].href = data.contact.mapUrl || '#'; const p = methods[3].querySelector('p'); if (p) p.innerText = data.contact.address; }
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
