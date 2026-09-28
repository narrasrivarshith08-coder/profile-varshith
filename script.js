document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. Custom Cursor & Hover Effects --- */
    const cursor = document.getElementById('cursor');
    const interactables = document.querySelectorAll('a, button, .interactive-elem');
    
    // Only enable custom cursor if not on a touch device (desktop)
    if (window.matchMedia("(hover: hover)").matches) {
        window.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        });

        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    /* --- 2. Scroll Progress & Sticky Navbar --- */
    const progressBar = document.getElementById('scrollProgress');
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        // Scroll Progress
        let scrollTop = window.scrollY;
        let docHeight = document.body.scrollHeight - window.innerHeight;
        let scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + "%";

        // Navbar styles
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Nav Links
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Adjusted offset for sticky container logic
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    /* --- 3. Mobile Navigation --- */
    const menuBtn = document.getElementById('menuBtn');
    const navLinksContainer = document.getElementById('navLinks');

    menuBtn.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        menuBtn.textContent = navLinksContainer.classList.contains('active') ? '✕' : '☰';
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
            menuBtn.textContent = '☰';
        });
    });

    /* --- 4. Scroll Reveal Animations --- */
    const revealElements = document.querySelectorAll('.reveal, .timeline-item');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active', 'revealed');
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => revealObserver.observe(el));

    /* --- 5. Interactive "My Work" Section Logic --- */
    const projects = [
        {
            title: "Personal Portfolio",
            desc: "A responsive portfolio website created to showcase my projects, skills, and journey.",
            tags: ["HTML", "CSS", "JavaScript"],
            visual: "Portfolio Concept"
        },
        {
            title: "TaskFlow",
            desc: "A simple task management application for creating, completing, and organizing daily tasks.",
            tags: ["HTML", "CSS", "JavaScript"],
            visual: "TaskFlow App"
        },
        {
            title: "Weatherly",
            desc: "A weather application that displays weather information through a clean interactive interface.",
            tags: ["HTML", "CSS", "JavaScript", "API"],
            visual: "Weatherly UI"
        },
        {
            title: "AI Study Assistant",
            desc: "An experimental concept for using AI tools to organize learning, generate study ideas, and improve productivity.",
            tags: ["HTML", "CSS", "JavaScript", "AI Tools"],
            visual: "AI Assistant"
        },
        {
            title: "CP Practice Tracker",
            desc: "A dashboard concept for tracking competitive programming problems, topics, difficulty, and progress.",
            tags: ["HTML", "CSS", "JavaScript"],
            visual: "CP Dashboard"
        }
    ];

    const workLeft = document.getElementById('workLeft');
    const wNum = document.getElementById('wNum');
    const wTitle = document.getElementById('wTitle');
    const wDesc = document.getElementById('wDesc');
    const wTags = document.getElementById('wTags');
    const wVisual = document.getElementById('wVisual');
    const workTriggers = document.querySelectorAll('.work-trigger-step');
    
    // Check if desktop or mobile logic should apply
    const isDesktop = window.innerWidth > 900;

    if (isDesktop) {
        // Desktop: Sticky Scroll Observer
        const workObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = parseInt(entry.target.getAttribute('data-index'));
                    updateProjectContent(index);
                }
            });
        }, { threshold: 0.5 }); // Trigger when section is 50% in view

        workTriggers.forEach(trigger => workObserver.observe(trigger));
    } else {
        // Mobile: Generate vertical stacked layout instead of sticky
        document.getElementById('workSticky').style.display = 'none';
        document.getElementById('workContainer').style.display = 'none';
        const mobileContainer = document.getElementById('mobileWorkFallback');
        mobileContainer.style.display = 'block';
        
        projects.forEach((proj, idx) => {
            const tagHTML = proj.tags.map(t => `<span>${t}</span>`).join('');
            const projHTML = `
                <div class="work-layout reveal" style="margin-bottom: 4rem; padding-top: 0;">
                    <div class="work-left">
                        <div class="work-number">0${idx + 1} / 05</div>
                        <h3 class="work-project-title">${proj.title}</h3>
                        <p class="work-project-desc">${proj.desc}</p>
                        <div class="work-tags">${tagHTML}</div>
                        <a href="#" class="view-project-link">VIEW PROJECT <i>→</i></a>
                    </div>
                    <div class="work-right">
                        <div class="work-visual-placeholder">${proj.visual}</div>
                    </div>
                </div>
            `;
            mobileContainer.insertAdjacentHTML('beforeend', projHTML);
        });
    }

    function updateProjectContent(index) {
        const project = projects[index];
        
        // Add a small fade out effect
        workLeft.style.opacity = 0;
        workLeft.style.transform = 'translateY(10px)';
        wVisual.style.opacity = 0;
        
        setTimeout(() => {
            // Update content
            wNum.textContent = `0${index + 1} / 05`;
            wTitle.textContent = project.title;
            wDesc.textContent = project.desc;
            
            // Update Tags
            wTags.innerHTML = '';
            project.tags.forEach(tag => {
                const span = document.createElement('span');
                span.textContent = tag;
                wTags.appendChild(span);
            });
            
            wVisual.textContent = project.visual;
            
            // Fade back in
            workLeft.style.opacity = 1;
            workLeft.style.transform = 'translateY(0)';
            wVisual.style.opacity = 1;
        }, 300); // match transition duration
    }

    /* --- 6. Tech Stack Interactions --- */
    const techItems = document.querySelectorAll('.tech-item');
    const techDescArea = document.getElementById('techDesc');

    techItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const desc = item.getAttribute('data-desc');
            techDescArea.classList.remove('active');
            
            setTimeout(() => {
                techDescArea.textContent = desc;
                techDescArea.classList.add('active');
            }, 150); // fast transition
        });
        
        item.addEventListener('mouseleave', () => {
            techDescArea.classList.remove('active');
            setTimeout(() => {
                techDescArea.textContent = "Hover over a technology to see how I use it.";
                techDescArea.classList.add('active');
            }, 150);
        });
    });
    // Ensure default state is visible
    techDescArea.classList.add('active');

    /* --- 7. Journey Timeline Animation --- */
    const journeySection = document.getElementById('journey');
    const timelineProgress = document.getElementById('timelineProgress');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    window.addEventListener('scroll', () => {
        // Calculate scroll inside journey section
        const sectionRect = journeySection.getBoundingClientRect();
        const sectionTop = sectionRect.top;
        const sectionHeight = sectionRect.height;
        const windowHeight = window.innerHeight;
        
        // Start drawing when the section title enters view, and finish when end of section reaches middle of screen
        let progress = 0;
        
        if (sectionTop < windowHeight / 2) {
            let distanceScrolled = (windowHeight / 2) - sectionTop;
            progress = (distanceScrolled / sectionHeight) * 100;
            
            // Cap at 100% and ensure it doesn't go negative
            progress = Math.max(0, Math.min(100, progress));
            
            timelineProgress.style.height = `${progress}%`;
        }

        // Activate dot colors dynamically
        timelineItems.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            // If the item dot is above the middle of the screen
            if (itemRect.top < (windowHeight / 2) + 50) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    });

    /* --- 8. Contact Form Validation --- */
    const form = document.getElementById('contactForm');
    const formMsg = document.getElementById('formMessage');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Frontend-only demonstration
        formMsg.style.opacity = '1';
        formMsg.style.color = 'var(--accent)';
        formMsg.textContent = "Message received. Thanks for reaching out.";
        
        // Reset form
        form.reset();
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMsg.style.opacity = '0';
        }, 5000);
    });
});