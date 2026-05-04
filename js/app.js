document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section');

    // Illustration Gallery Auto-generation
    const gallery = document.getElementById('gallery');
    const illustrationFiles = [
        "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg",
        "11.jpg", "12.jpg", "13.jpg", "14.jpg", "15.jpg", "16.jpg", "17.jpg", "18.jpg", "19.jpg", "20.jpg",
        "21.jpg", "22.jpg", "23.jpg", "24.jpg", "25.jpg", "26.jpg", "27.jpg", "28.jpg", "29.jpg", "30.jpg",
        "31.jpg", "32.jpg", "33.jpg", "34.jpg", "35.jpg", "36.jpg", "37.jpg", "38.jpg", "39.jpg", "40.jpg",
        "41.jpg", "42.jpg", "43.jpg", "44.jpg", "45.jpg", "46.jpg", "47.jpg", "48.jpg", "49.jpg", "50.jpg",
        "51.jpg", "52.jpg", "53.jpg", "54.jpg", "55.jpg", "56.jpg", "57.jpg", "58.jpg", "59.jpg", "60.jpg",
        "61.jpg", "62.jpg", "63.jpg", "64.jpg", "65.jpg", "66.jpg", "67.jpg", "68.jpg", "69.jpg", "70.jpg",
        "71.jpg", "72.jpg", "73.jpg", "74.jpg", "75.jpg", "76.jpg", "77.jpg", "79.jpg", "80.jpg", "81.jpg",
        "82.jpg"
    ];

    if (gallery) {
        illustrationFiles.forEach(file => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            const img = document.createElement('img');
            img.src = `assets/illustrations/${file}`;
            img.alt = 'Bianca Illustration';
            img.loading = 'lazy';
            img.style.cursor = 'pointer';
            
            img.addEventListener('click', () => {
                const modal = document.getElementById('imageModal');
                const modalImg = document.getElementById('modalImage');
                modal.style.display = 'block';
                modalImg.src = img.src;
            });

            item.appendChild(img);
            gallery.appendChild(item);
        });
    }

    // Navigation switching
    function switchSection(targetId) {
        sections.forEach(section => {
            if (section.id === targetId) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        navLinks.forEach(link => {
            if (link.getAttribute('data-target') === targetId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function triggerDeferred(container) {
        const deferred = container.querySelectorAll('.twitter-tweet-deferred, .instagram-media-deferred, .lazy-youtube');
        deferred.forEach(el => observer.observe(el));
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            history.pushState(null, '', `#${targetId}`);
            switchSection(targetId);
            
            // Give the browser a moment to render the section before observing
            requestAnimationFrame(() => {
                triggerDeferred(document.getElementById(targetId));
            });
        });
    });

    // Lazy load Embeds (Twitter, Instagram, YouTube)
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                
                // Twitter
                if (el.classList.contains('twitter-tweet-deferred')) {
                    el.classList.remove('twitter-tweet-deferred');
                    const link = el.querySelector('a');
                    if (link) {
                        const url = link.href;
                        const tweetId = url.match(/status\/(\d+)/)?.[1];
                        if (tweetId) {
                            // Clear the blockquote to prepare for the widget
                            el.innerHTML = '';
                            el.classList.add('twitter-tweet');
                            
                            const loadTweet = (t) => {
                                t.widgets.createTweet(tweetId, el, {
                                    theme: 'dark',
                                    align: 'center',
                                    dnt: true
                                });
                            };

                            if (window.twttr && window.twttr.widgets) {
                                loadTweet(window.twttr);
                            } else {
                                const checkTwttr = setInterval(() => {
                                    if (window.twttr && window.twttr.widgets) {
                                        loadTweet(window.twttr);
                                        clearInterval(checkTwttr);
                                    }
                                }, 500);
                                setTimeout(() => clearInterval(checkTwttr), 5000);
                            }
                        }
                    }
                }
                
                // Instagram
                if (el.classList.contains('instagram-media-deferred')) {
                    el.classList.remove('instagram-media-deferred');
                    el.classList.add('instagram-media');
                    if (window.instgrm && window.instgrm.Embeds) {
                        window.instgrm.Embeds.process();
                    }
                }
                
                // YouTube Lazy Load
                if (el.classList.contains('lazy-youtube')) {
                    const src = el.getAttribute('data-src');
                    if (src) {
                        el.setAttribute('src', src);
                    }
                    el.classList.remove('lazy-youtube');
                }
                
                observer.unobserve(el);
            }
        });
    }, { rootMargin: '300px 0px' });

    document.querySelectorAll('.twitter-tweet-deferred, .instagram-media-deferred, .lazy-youtube').forEach(el => {
        observer.observe(el);
    });

    // Modal Close Logic
    const modal = document.getElementById('imageModal');
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        }
    }
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Handle initial hash
    const initialHash = window.location.hash.substring(1);
    if (initialHash && document.getElementById(initialHash)) {
        switchSection(initialHash);
        requestAnimationFrame(() => {
            triggerDeferred(document.getElementById(initialHash));
        });
    } else {
        switchSection('top');
    }

    window.addEventListener('popstate', () => {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            switchSection(hash);
            requestAnimationFrame(() => {
                triggerDeferred(document.getElementById(hash));
            });
        } else {
            switchSection('top');
        }
    });
});

