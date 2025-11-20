  // DOM refs
        const header = document.getElementById('site-header');
        const menuToggle = document.getElementById('menuToggle');
        const mainNav = document.getElementById('mainNav');
        const fadeEls = document.querySelectorAll('.fade-up');
        const projects = document.querySelectorAll('.project');
        const modal = document.getElementById('modal');
        const modalImg = document.getElementById('modalImg');
        const modalTitle = document.getElementById('modalTitle');
        const modalDesc = document.getElementById('modalDesc');
        const modalClose = document.getElementById('modalClose');
        const toTop = document.getElementById('toTop');
        const yearEl = document.getElementById('year');
        yearEl.textContent = new Date().getFullYear();

        // Mobile menu toggle
        menuToggle.addEventListener('click', () => {
            const open = mainNav.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        // Close menu on nav click (mobile)
        mainNav.addEventListener('click', (e) => {
            if(e.target.tagName === 'A' && mainNav.classList.contains('open')){
                mainNav.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Header background on scroll
        const onScroll = () => {
            if(window.scrollY > 60) header.classList.add('scrolled'); else header.classList.remove('scrolled');
            toTop.classList.toggle('hidden', window.scrollY < 400);
        };
        window.addEventListener('scroll', onScroll, {passive:true});
        onScroll();

        // Intersection Observer for fade-in
        const io = new IntersectionObserver((entries) => {
            entries.forEach(en => {
                if(en.isIntersecting) en.target.classList.add('in-view');
            });
        }, {threshold:0.12});
        fadeEls.forEach(el => io.observe(el));

        // Smooth scroll offset adjustment for fixed header
        document.querySelectorAll('a[href^="#"]').forEach(a=>{
            a.addEventListener('click', (e)=>{
                const target = document.querySelector(a.getAttribute('href'));
                if(target){
                    e.preventDefault();
                    const headerHeight = header.offsetHeight;
                    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
                    window.scrollTo({top, behavior:'smooth'});
                }
            });
        });

        // Projects modal (lightbox)
        function openModal(src, title, desc){
            modalImg.src = src;
            modalImg.alt = title;
            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            // focus management
            modalClose.focus();
        }
        function closeModal(){
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
        }
        projects.forEach(p=>{
            p.addEventListener('click', ()=> openModal(p.dataset.src, p.dataset.title, p.dataset.desc));
            p.addEventListener('keypress', (e)=>{ if(e.key === 'Enter') openModal(p.dataset.src, p.dataset.title, p.dataset.desc); });
        });
        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
        document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });

        // Contact form validation & submit (client-side)
        const form = document.getElementById('contactForm');
        const feedback = document.getElementById('formFeedback');
        form.addEventListener('submit', (e)=>{
            e.preventDefault();
            feedback.textContent = '';
            const name = form.name.value.trim();
            const email = form.email.value.trim();
            const message = form.message.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!name || !email || !message){
                feedback.textContent = 'Please fill out all required fields.';
                return;
            }
            if(!emailRegex.test(email)){
                feedback.textContent = 'Please provide a valid email address.';
                form.email.focus();
                return;
            }
            // Simulate sending
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            setTimeout(()=>{
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
                feedback.textContent = 'Message sent successfully! We will reply within 2 business days.';
                form.reset();
            }, 900);
        });

        // Scroll to top
        toTop.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

        // Accessibility: ensure focus outlines visible for keyboard users (basic approach)
        (function(){
            function handleFirstTab(e){
                if(e.key === 'Tab'){
                    document.documentElement.classList.add('show-focus');
                    window.removeEventListener('keydown', handleFirstTab);
                }
            }
            window.addEventListener('keydown', handleFirstTab);
        })();

        // Lazy load images fallback (simple)
        if('loading' in HTMLImageElement.prototype === false){
            document.querySelectorAll('img[loading="lazy"]').forEach(img=>{
                const src = img.dataset.src || img.src;
                if(src) img.src = src;
            });
        }