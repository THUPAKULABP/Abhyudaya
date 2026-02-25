document.addEventListener('DOMContentLoaded', () => {
    const data = window.SITE_DATA;

    // HERO
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

    // USP BANNER
    const uspTitle = document.querySelector('.usp-title');
    if (uspTitle) {
        uspTitle.innerHTML = `<span class="usp-highlight">${data.uspBanner.titleLine1.split('•')[0].trim()}</span> • ${data.uspBanner.titleLine1.split('•')[1] || ''}<br>${data.uspBanner.titleLine2}`;
    }
    const uspDesc = document.querySelector('.usp-content p');
    if (uspDesc) uspDesc.innerText = data.uspBanner.description;

    // STATS
    const statCards = document.querySelectorAll('.stats-grid .stat-card');
    statCards.forEach((card, i) => {
        if (data.stats[i]) {
            card.querySelector('.stat-number').setAttribute('data-target', data.stats[i].count);
            card.querySelector('.stat-number').innerText = '0';
            card.querySelector('.stat-label').innerText = data.stats[i].label;
        }
    });

    // ABOUT
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

    // PROGRAMS
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
                if (featuresList) {
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

    // TESTIMONIALS
    const testCards = document.querySelectorAll('.testimonials-grid .testimonial-card');
    testCards.forEach((card, i) => {
        if (data.testimonials[i]) {
            card.querySelector('.testimonial-avatar').innerText = data.testimonials[i].avatar;
            card.querySelector('.testimonial-info h4').innerText = data.testimonials[i].name;
            card.querySelector('.testimonial-info .role').innerText = data.testimonials[i].role;
            card.querySelector('.testimonial-text').innerText = data.testimonials[i].text;
        }
    });

    // STUDENT LIFE
    const lifeCards = document.querySelectorAll('.life-grid .life-card');
    lifeCards.forEach((card, i) => {
        if (data.studentLife[i]) {
            card.querySelector('img').src = data.studentLife[i].image;
            card.querySelector('.life-icon i').className = data.studentLife[i].icon;
            card.querySelector('h3').innerText = data.studentLife[i].title;
            card.querySelector('p').innerText = data.studentLife[i].description;
        }
    });

    // VIDEOS
    const flipPages = document.querySelectorAll('.flipbook-page');
    flipPages.forEach((page, i) => {
        if (data.videos[i]) {
            const front = page.querySelector('.flipbook-page-front');
            if (front) {
                front.querySelector('img').src = data.videos[i].thumbnail;
                front.querySelector('.page-info h3').innerText = data.videos[i].title;
                front.querySelector('.page-info p').innerText = data.videos[i].subtitle;

                // Set up YouTube player logic
                const playBtn = front.querySelector('.play-button');
                if (playBtn) {
                    playBtn.onclick = (e) => {
                        e.stopPropagation(); // prevent flipbook page turn
                        openYoutubeModal(data.videos[i].videoId);
                    };
                }
            }
            const back = page.querySelector('.flipbook-page-back');
            if (back) {
                const backIcon = back.querySelector('i');
                if (backIcon) {
                    backIcon.className = data.videos[i].backIcon;
                    backIcon.style.color = data.videos[i].backIconColor;
                }
                const backTitleObj = back.querySelector('h3');
                if (backTitleObj) backTitleObj.innerText = data.videos[i].backTitle;
                const backDescObj = back.querySelector('p');
                if (backDescObj) backDescObj.innerText = data.videos[i].backDesc;
            }
        }
    });

    // GALLERY
    const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');
    galleryItems.forEach((item, i) => {
        if (data.gallery[i]) {
            item.querySelector('img').src = data.gallery[i].image;
            item.querySelector('h3').innerText = data.gallery[i].title;
            item.querySelector('p').innerText = data.gallery[i].subtitle;
        }
    });

    // CONTACT
    const contactInfo = document.querySelector('.contact-info');
    if (contactInfo) {
        contactInfo.querySelector('.contact-info-header p').innerText = data.contact.locationDesc;
        const methods = contactInfo.querySelectorAll('.contact-method');
        if (methods[0]) {
            methods[0].href = `tel:${data.contact.phone}`;
            methods[0].querySelector('p').innerText = data.contact.phoneDisplay;
        }
        if (methods[1]) {
            methods[1].href = `https://wa.me/${data.contact.whatsapp}?text=Hello!`;
        }
        if (methods[2]) {
            methods[2].href = `mailto:${data.contact.email}`;
            methods[2].querySelector('p').innerText = data.contact.email;
        }
        if (methods[3]) {
            methods[3].querySelector('p').innerText = data.contact.address;
        }
    }
});

// YOUTUBE MODAL LOGIC
function createYoutubeModal() {
    const modalHTML = `
        <div class="modal-overlay yt-modal" id="ytModal" style="display:none; justify-content:center; align-items:center; z-index:999999;">
            <div class="modal-content" style="padding: 1rem; width: 90%; max-width: 900px; background: #000; position:relative; aspect-ratio: 16/9; border: 2px solid var(--primary);">
                <button onclick="closeYoutubeModal()" style="position:absolute; top:-40px; right:0; background:transparent; border:none; color:#fff; font-size:2rem; cursor:pointer;"><i class="ri-close-line"></i></button>
                <iframe id="ytIframe" width="100%" height="100%" src="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        </div>
    `;
    const div = document.createElement('div');
    div.innerHTML = modalHTML;
    document.body.appendChild(div);

    document.getElementById('ytModal').addEventListener('click', (e) => {
        if (e.target.id === 'ytModal') closeYoutubeModal();
    });
}

function openYoutubeModal(videoId) {
    let _modal = document.getElementById('ytModal');
    if (!_modal) {
        createYoutubeModal();
        _modal = document.getElementById('ytModal');
    }
    const iframe = document.getElementById('ytIframe');

    // Extract video ID if full URL is given
    let finalId = videoId;
    if (videoId.includes('youtube.com') || videoId.includes('youtu.be')) {
        const url = new URL(videoId);
        finalId = url.searchParams.get('v') || url.pathname.slice(1);
    }

    iframe.src = `https://www.youtube.com/embed/${finalId}?autoplay=1`;
    _modal.style.display = 'flex';
    setTimeout(() => {
        _modal.classList.add('active'); // fade in
        _modal.style.visibility = 'visible';
    }, 10);
}

function closeYoutubeModal() {
    const _modal = document.getElementById('ytModal');
    if (_modal) {
        _modal.classList.remove('active');
        setTimeout(() => {
            _modal.style.display = 'none';
            document.getElementById('ytIframe').src = '';
        }, 400);
    }
}
