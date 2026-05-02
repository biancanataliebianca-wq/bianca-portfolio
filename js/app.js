document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section');

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

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            history.pushState(null, '', `#${targetId}`);
            switchSection(targetId);
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
                    el.classList.add('twitter-tweet');
                    if (window.twttr && window.twttr.widgets) {
                        window.twttr.widgets.load(el.parentElement);
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
                
                // YouTube (iframe)
                if (el.tagName === 'IFRAME' && el.hasAttribute('data-src')) {
                    el.src = el.getAttribute('data-src');
                    el.removeAttribute('data-src');
                }
                
                observer.unobserve(el);
            }
        });
    }, { rootMargin: '300px 0px' });

    document.querySelectorAll('.twitter-tweet-deferred, .instagram-media-deferred, iframe[data-src]').forEach(el => {
        observer.observe(el);
    });

    // Illustration Gallery Auto-generation
    const gallery = document.getElementById('gallery');
    const illustrationFiles = [
        "2f3fe628-ad7a-4f25-82a2-0c2832717cda.png",
        "9a2ac1fa-fe89-432e-a32d-edf0fc8a76c9.png",
        "d7660022-e184-4ef1-9be5-a20b8bf24096.png",
        "Diorama-style_Plastic_figure_texture_Quarter_view_Girl_happil_efea6157-b7ba-457d-8bdb-2efefb02b3fa_2.png",
        "g6ay8l.2ja.4r4r_Anthropomorphic_horse_High-quality_deformed_i_431e3ef8-4100-426b-b695-a2ec1a03b779_3.png",
        "g6ay8l.2ja.4r4r_Anthropomorphic_wolf_Dynamic_pose_slashing_st_b8153801-4fd2-425a-820c-e9410a32d5fb_2 (1).png",
        "g6ay8l.2ja.4r4r_Art_materials_that_combine_Japanese_fantasy_R_a12dfa15-3d37-41aa-a641-96c2e6b8572f_1.png",
        "g6ay8l.2ja.4r4r_a_deformed_illustration_with_a_manga-style_ro_bdfb57f7-bdd4-4079-89b8-2974ef18aeb9_0.png",
        "g6ay8l.2ja.4r4r_A_frontal_shot_of_the_upper_body_of_a_smiling_73f0d428-3eb0-46ab-b4b6-3fa2904dff61_0.png",
        "g6ay8l.2ja.4r4r_A_frontal_shot_of_the_upper_body_of_a_smiling_efadd191-3668-4d51-aca4-feafd5c31a3c_0.png",
        "g6ay8l.2ja.4r4r_A_frontal_shot_of_the_upper_body_of_a_smiling_f2146779-7482-412e-b337-c15d64a8aa7e_0.png",
        "g6ay8l.2ja.4r4r_A_frontal_shot_of_the_upper_body_of_a_smiling_f7ea31dc-8dca-4474-8e37-df8c8672988a_3.png",
        "g6ay8l.2ja.4r4r_A_full-body_drawing_A_high-quality_cute_defor_f187891d-bcdc-493c-9a0d-c67b7000f998_1.png",
        "g6ay8l.2ja.4r4r_A_high-quality_deformed_illustration_incorpor_1b85bf8a-f0c3-4903-972e-05af4a5554ba_0.png",
        "g6ay8l.2ja.4r4r_A_high-quality_deformed_illustration_incorpor_d631da37-7ff4-4054-a53e-81e42eeafb7c_2.png",
        "g6ay8l.2ja.4r4r_A_smiling_girl_drinking_hot_coffee_in_a_styli_26717b5b-d3b2-49d7-9797-e9e22ddbcfec_3 (1).png",
        "g6ay8l.2ja.4r4r_Cute_deformed_anime._The_Japanese_graphic_des_077153f0-4e4d-482e-ac58-9c6be9bd5607_0.png",
        "g6ay8l.2ja.4r4r_Cute_deformed_anime_Japanese_graphic_design_t_4f01b06b-e37a-40e8-83ba-ee1bd9d198cd_0.png",
        "g6ay8l.2ja.4r4r_Deformed_illustration_in_a_manga_rough_sketch_1fd8ed1e-4e06-4ed0-9bba-fbd8ee1423c6_1.png",
        "g6ay8l.2ja.4r4r_Elaborate_partially_peeled-off_papercraft_wit_5d116a2a-4f92-4717-bacd-a51a9ba8315a_1.png",
        "g6ay8l.2ja.4r4r_Elaborate_partially_peeled-off_papercraft_wit_c4487c9f-de22-4d74-b0a9-0dd78d9cbcdb_2.png",
        "g6ay8l.2ja.4r4r_Fairytale-like_fantasy_painting_style_A_city__2058149a-00a9-4a6f-b376-d2b1aaf700d7_2.png",
        "g6ay8l.2ja.4r4r_Full-body_drawing_High-quality_deformed_illus_7af29f84-f1b3-4150-b3e8-d8f7241bcbe6_1.png",
        "g6ay8l.2ja.4r4r_Full-body_drawing_The_face_is_meticulously_cr_18351da8-4092-4777-bb84-df8eccb1187d_1.png",
        "g6ay8l.2ja.4r4r_Full-body_drawing_The_face_is_meticulously_cr_44be6213-1fd1-46cb-967a-e1cc96777bb7_3.png",
        "g6ay8l.2ja.4r4r_Full-body_figure_Standing_pose_Cool_sunglasse_954f0594-7790-4638-8309-cd27ce916e50_0 (1).png",
        "g6ay8l.2ja.4r4r_Full-body_view_The_face_is_meticulously_craft_972e53b7-6adb-4b7b-865d-7122025bd050_1.png",
        "g6ay8l.2ja.4r4r_Girl_with_pigtails_Full-body_portrait_Stylish_c9d021c6-e3a3-4056-a365-b5faf7c50b23_3 (1).png",
        "g6ay8l.2ja.4r4r_High-quality_cute_deformed_illustrations_inco_50170d78-6c82-4459-8324-39005fb66372_3.png",
        "g6ay8l.2ja.4r4r_High-quality_illustration_incorporating_moder_37874337-0429-4310-a1bd-cc485bacba04_0 (1).png",
        "g6ay8l.2ja.4r4r_Manga_A_cute_20-year-old_girl_with_large_cat__a6733aab-fe48-4dbd-be6e-6a5699e88bf3_1.png",
        "g6ay8l.2ja.4r4r_The_face_is_meticulously_crafted_to_avoid_dis_b13b8e58-3c31-47e2-871f-0f29a909be16_0.png",
        "g6ay8l.2ja.4r4r__A_20-year-old_Japanese_girl_with_a_dignified_e_8c7d48b9-0cb9-423a-8b81-f6f7c1438009.png"
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
            
            // Open modal on click
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
    } else {
        switchSection('top');
    }

    // Handle back/forward buttons
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            switchSection(hash);
        } else {
            switchSection('top');
        }
    });
});
