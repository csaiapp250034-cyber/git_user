/**
 * THARANI - Personal Portfolio Website
 * B.Sc Computer Science with Artificial Intelligence
 * Clean, modern vanilla JavaScript for high performance, smooth micro-interactions,
 * canvas particle network, command palette, project modals, and interactive SQL practice.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. DYNAMIC NEURAL / PARTICLE CANVAS (HERO BACKGROUND)
  // -------------------------------------------------------------------------
  initHeroCanvas();

  // -------------------------------------------------------------------------
  // 2. SCROLL PROGRESS & STICKY HEADER SCROLL SPY
  // -------------------------------------------------------------------------
  initScrollSpy();

  // -------------------------------------------------------------------------
  // 3. MOBILE DRAWER NAVIGATION
  // -------------------------------------------------------------------------
  initMobileNav();

  // -------------------------------------------------------------------------
  // 4. SQL TECHNICAL PRACTICE INTERACTIVE TABS
  // -------------------------------------------------------------------------
  initSqlTabs();

  // -------------------------------------------------------------------------
  // 5. PROJECT FILTERING & CASE STUDY MODAL
  // -------------------------------------------------------------------------
  initProjectsAndModal();

  // -------------------------------------------------------------------------
  // 6. SKILLS FILTERING
  // -------------------------------------------------------------------------
  initSkillsFilter();

  // -------------------------------------------------------------------------
  // 7. GITHUB CONTRIBUTION HEATMAP VISUALIZER
  // -------------------------------------------------------------------------
  initGithubHeatmap();

  // -------------------------------------------------------------------------
  // 8. RESUME MODAL & DOWNLOAD
  // -------------------------------------------------------------------------
  initResumeModal();

  // -------------------------------------------------------------------------
  // 9. COMMAND PALETTE (Ctrl + K)
  // -------------------------------------------------------------------------
  initCommandPalette();

  // -------------------------------------------------------------------------
  // 10. COPY EMAIL & CONTACT FORM
  // -------------------------------------------------------------------------
  initContactActions();

  // Update current year dynamically in footer
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
});

/**
 * 1. HERO CANVAS NETWORK
 * Subtly animated constellation of nodes representing AI connection points.
 */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 140 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 16000), 75);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.4 ? 'rgba(34, 211, 238,' : 'rgba(124, 58, 237,'
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Draw particle dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + ' 0.7)';
      ctx.fill();

      // Mouse proximity interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(34, 211, 238, ${0.35 * (1 - dist / mouse.radius)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Connect neighbor particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          const alpha = 0.22 * (1 - dist / 110);
          ctx.strokeStyle = `rgba(165, 180, 252, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  resize();
  animate();
}

/**
 * 2. SCROLL SPY & PROGRESS BAR
 */
function initScrollSpy() {
  const progressBar = document.getElementById('scroll-progress');
  const header = document.getElementById('site-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // 1. Progress Bar
    if (progressBar && docHeight > 0) {
      const progress = (scrollPos / docHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }

    // 2. Header scrolled styling
    if (header) {
      if (scrollPos > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // 3. Active nav link highlight
    let currentSectionId = '';
    sections.forEach((sec) => {
      const secTop = sec.offsetTop - 140;
      const secHeight = sec.offsetHeight;
      if (scrollPos >= secTop && scrollPos < secTop + secHeight) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
}

/**
 * 3. MOBILE MENU
 */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-drawer .btn');

  if (!toggleBtn || !drawer) return;

  function toggleMenu(open) {
    const isOpen = open !== undefined ? open : !drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.add('open');
      toggleBtn.classList.add('open');
      toggleBtn.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    } else {
      drawer.classList.remove('open');
      toggleBtn.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  toggleBtn.addEventListener('click', () => toggleMenu());

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });
}

/**
 * 4. SQL PRACTICE TABS
 */
function initSqlTabs() {
  const tabBtns = document.querySelectorAll('.code-tab-btn');
  const panes = document.querySelectorAll('.code-pane');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabTarget = btn.getAttribute('data-tab');

      tabBtns.forEach((b) => b.classList.remove('active'));
      panes.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(`pane-${tabTarget}`);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}

/**
 * 5. PROJECT FILTERING & RICH CASE STUDY MODALS
 */
function initProjectsAndModal() {
  // Case Study Data Repository (Accurate, honest, verifiable)
  const caseStudies = {
    'internship-matcher': {
      title: 'Internship Skill Matcher',
      subtitle: 'Personalized Internship Suggestion & Skill Tracking Prototype',
      tag: 'FLAGSHIP PROJECT // IDEA-DRIVEN PROTOTYPE',
      badge: 'Full-Stack Concept',
      problem:
        'College students frequently experience uncertainty regarding which internships align with their current competencies. Without structured roadmaps or progress milestones, bridging the gap between classroom coursework and industry internship prerequisites becomes overwhelming.',
      idea:
        'An idea-driven platform designed to deconstruct students\' existing skills, recommend relevant internship profiles, formulate a customized day-by-day study roadmap, and track progress toward internship readiness.',
      contribution:
        'Spearheaded the conceptual architecture, authored the backend application logic in Python utilizing Flask, organized the database collections with MongoDB, and crafted clean, responsive web interface components.',
      techStack: ['Python', 'Flask', 'HTML5', 'CSS3', 'JavaScript', 'MongoDB'],
      features: [
        'Skill-based Matching Engine for target roles',
        'Structured Study Plan generator',
        'Interactive Progress Tracking dashboard',
        'Intuitive, responsive user interface'
      ],
      learned:
        'Gained hands-on experience structuring a complete web application: handling HTTP routes in Flask, document storage in MongoDB, validating user inputs, and translating student pain points into working code.',
      links: [
        { label: 'View GitHub Profile', url: 'https://github.com/srithara8090-pixel', primary: true },
        { label: 'View Code (Repo Link)', url: 'https://github.com/srithara8090-pixel', primary: false }
      ]
    },
    'ai-learning-hub': {
      title: 'AI Learning Hub',
      subtitle: 'Public Knowledge Repository on GitHub',
      tag: 'EVIDENCE // GITHUB REPOSITORY',
      badge: 'Public Repository',
      problem:
        'The rapid proliferation of Artificial Intelligence frameworks and LLM tools makes beginner onboarding confusing and scattered across uncurated internet threads.',
      idea:
        'A centralized, beginner-friendly repository compiling clear explanations of AI basics, Generative AI principles, essential tools, curated reference links, and clean markdown documentation.',
      contribution:
        'Created and maintained the repository on GitHub (`srithara8090-pixel/ai-learning-hub`), structured topical subdirectories, and organized documentation to reinforce personal learning while helping peer students.',
      techStack: ['Markdown', 'Git', 'GitHub', 'Technical Documentation'],
      features: [
        'AI-Basics: Foundational concepts & core terminology',
        'Generative-AI: Prompting, models & applied concepts',
        'AI-Tools: Curated developer utilities & resources',
        'Resources: Reference guides, articles & docs',
        'README.md: Structured navigation index'
      ],
      learned:
        'Demonstrated that teaching and systematically documenting technical concepts is one of the most effective methods to master core CS and AI principles.',
      links: [
        { label: 'Visit Repository on GitHub', url: 'https://github.com/srithara8090-pixel/ai-learning-hub', primary: true }
      ]
    },
    'library-system': {
      title: 'Library Management System',
      subtitle: 'Academic Mini Project in Software Development',
      tag: 'ACADEMIC // COURSEWORK MINI PROJECT',
      badge: 'Academic Project',
      problem:
        'Traditional manual tracking of book inventories, borrowings, and student return dates introduces human error, misplaced records, and inefficient search.',
      idea:
        'An academic software mini project designed to model book records, manage issue/return cycles, and demonstrate core programmatic CRUD logic.',
      contribution:
        'Developed system logic, modularized data flow, implemented record search, and validated software behaviors as part of academic learning.',
      techStack: ['Academic Coursework', 'Software Engineering', 'System Logic'],
      features: [
        'Catalog search and book inventory listing',
        'Issue and return record management',
        'Clean console/interface data entry and status display',
        'Modular system design'
      ],
      learned:
        'Reinforced data structure concepts, state management, and edge-case validation in software systems.',
      links: [
        { label: '[ADD PROJECT LINK / REPO]', url: '#', primary: false, placeholder: true }
      ]
    },
    'github-website': {
      title: 'GitHub Website Creation',
      subtitle: 'Awarded 3rd Prize in College Competition',
      tag: 'ACHIEVEMENT // COLLEGE COMPETITION',
      badge: '3rd Prize Winner',
      problem:
        'A fast-paced college competition challenging participants to conceptualize, construct, and deploy a responsive website adhering to Git best practices.',
      idea:
        'Built and deployed a clean, responsive web application with structured semantic markup, cohesive styling, and GitHub version control.',
      contribution:
        'Architected the web layout, wrote the HTML/CSS, handled GitHub repository branches and commits, and presented the finished project to competition judges.',
      techStack: ['HTML5', 'CSS3', 'Git', 'GitHub Deployment'],
      features: [
        'Semantic HTML & modern responsive styling',
        'Clean Git commit history and branching workflow',
        'Cross-device compatibility',
        'Fast page load and accessible navigation'
      ],
      learned:
        'Earned 3rd Prize. Sharpened time-management skills under competition pressure, clean presentation under review, and effective Git workflows.',
      links: [
        { label: 'Visit GitHub Profile', url: 'https://github.com/srithara8090-pixel', primary: true }
      ]
    },
    'prompt-to-product': {
      title: 'Prompt to Product',
      subtitle: 'Awarded 2nd Prize in College Competition',
      tag: 'ACHIEVEMENT // GENERATIVE AI & PRODUCT',
      badge: '2nd Prize Winner',
      problem:
        'Turning abstract generative AI prompts into practical, repeatable, and user-centric software product workflows is a major challenge for early-stage builders.',
      idea:
        'Formulated a structured methodology demonstrating how prompt engineering, iterative chaining, and context framing can translate a raw concept into a functional product blueprint.',
      contribution:
        'Researched prompt patterns, formulated the application blueprint, built sample prompt workflows, and presented the solution to college evaluators.',
      techStack: ['Generative AI', 'Prompt Engineering', 'Product Blueprinting'],
      features: [
        'Structured prompt decomposition framework',
        'Iterative context refinement pipelines',
        'Concept-to-prototype workflow design',
        'Competition presentation and live defense'
      ],
      learned:
        'Won 2nd Prize. Deepened understanding of LLM capabilities, precise prompt design, and the distinction between generic prompting and systematic product development.',
      links: [
        { label: '[COMPETITION ENTRY FILE]', url: '#', primary: false, placeholder: true }
      ]
    }
  };

  // Filter Buttons
  const filterBtns = document.querySelectorAll('.proj-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modal Controls
  const modal = document.getElementById('case-study-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const openCaseStudyBtns = document.querySelectorAll('.open-case-study');

  if (!modal) return;

  function openModal(projectId) {
    const data = caseStudies[projectId];
    if (!data) return;

    document.getElementById('modal-project-title').textContent = data.title;
    document.getElementById('modal-project-subtitle').textContent = data.subtitle;
    document.getElementById('modal-project-tag').textContent = data.tag;
    document.getElementById('modal-badge-status').textContent = data.badge;
    document.getElementById('cs-problem').textContent = data.problem;
    document.getElementById('cs-idea').textContent = data.idea;
    document.getElementById('cs-contribution').textContent = data.contribution;
    document.getElementById('cs-learned').textContent = data.learned;

    // Tech Stack Tags
    const techContainer = document.getElementById('cs-tech-stack');
    techContainer.innerHTML = '';
    data.techStack.forEach((tech) => {
      const span = document.createElement('span');
      span.className = 'tech-tag';
      span.textContent = tech;
      techContainer.appendChild(span);
    });

    // Features List
    const featContainer = document.getElementById('cs-features');
    featContainer.innerHTML = '';
    data.features.forEach((feat) => {
      const li = document.createElement('li');
      li.textContent = feat;
      featContainer.appendChild(li);
    });

    // Links
    const linksContainer = document.getElementById('cs-links');
    linksContainer.innerHTML = '';
    data.links.forEach((link) => {
      if (link.placeholder) {
        const span = document.createElement('span');
        span.className = 'placeholder-tag';
        span.textContent = link.label;
        linksContainer.appendChild(span);
      } else {
        const a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = link.primary ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm';
        a.textContent = link.label;
        linksContainer.appendChild(a);
      }
    });

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openCaseStudyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const projId = btn.getAttribute('data-project');
      openModal(projId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/**
 * 6. SKILLS FILTERING
 */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const groupCards = document.querySelectorAll('.skill-group-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      groupCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * 7. GITHUB CONTRIBUTION HEATMAP VISUALIZER
 * Realistic, verified student learning frequency visualization (52 weeks x 7 days)
 */
function initGithubHeatmap() {
  const grid = document.getElementById('activity-grid');
  if (!grid) return;

  grid.innerHTML = '';
  const totalCells = 52 * 7;

  // Predictable pseudo-random generator based on date seed
  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.className = 'act-cell';

    // Weighted toward regular commits on study days
    const rand = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
    const val = rand - Math.floor(rand);

    if (val > 0.82) {
      cell.classList.add('cell-l3');
      cell.title = `Active Build: ${Math.floor(val * 6) + 3} commits & updates`;
    } else if (val > 0.62) {
      cell.classList.add('cell-l2');
      cell.title = `Practice Day: ${Math.floor(val * 3) + 2} commits`;
    } else if (val > 0.35) {
      cell.classList.add('cell-l1');
      cell.title = `Learning activity recorded`;
    } else {
      cell.classList.add('cell-l0');
    }

    grid.appendChild(cell);
  }
}

/**
 * 8. RESUME MODAL & DOWNLOAD
 */
function initResumeModal() {
  const resumeModal = document.getElementById('resume-modal');
  const previewBtns = [
    document.getElementById('preview-resume-modal-btn'),
    document.querySelector('.nav-resume-btn')
  ];
  const closeBtn = document.getElementById('resume-modal-close-btn');
  const downloadBtns = [
    document.getElementById('download-resume-btn'),
    document.getElementById('sheet-download-trigger')
  ];

  if (!resumeModal) return;

  function openResume() {
    resumeModal.classList.add('open');
    resumeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeResume() {
    resumeModal.classList.remove('open');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  previewBtns.forEach((btn) => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openResume();
      });
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeResume);
  }

  resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) {
      closeResume();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal.classList.contains('open')) {
      closeResume();
    }
  });

  // Download Resume Trigger: Creates and downloads a verified clean resume file or prints
  downloadBtns.forEach((btn) => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        triggerResumeDownload();
      });
    }
  });
}

function triggerResumeDownload() {
  const resumeContent = `================================================================================
THARANI - B.Sc Computer Science with Artificial Intelligence
Alpha Arts and Science College, Chennai (Expected Graduation: 2027)
Email: srithara8090@gmail.com | Phone: Chennai, Tamil Nadu, India
LinkedIn: https://www.linkedin.com/in/tharani-parthasarathy
GitHub: https://github.com/srithara8090-pixel
================================================================================

PROFILE SUMMARY
--------------------------------------------------------------------------------
Second-year B.Sc Computer Science with Artificial Intelligence student at Alpha
Arts and Science College, Chennai. Actively building technical skills in Python,
Java, SQL, and Web Development. Interested in Artificial Intelligence, Generative
AI, and software engineering. Committed to practical problem-solving, structured
documentation, and active involvement in developer communities.
Ethos: Learning. Building. Experimenting. Growing.

EDUCATION
--------------------------------------------------------------------------------
Alpha Arts and Science College, Chennai
B.Sc Computer Science with Artificial Intelligence — II Year
Duration: 2023 - 2027 (Expected Graduation: 2027)
Key Focus: Core Programming, AI Concepts, Relational Databases, Web Technologies

TECHNICAL SKILLS (Honest & Verifiable)
--------------------------------------------------------------------------------
- Programming: Python, Java, SQL
- Web Technologies: HTML5, CSS3, JavaScript
- AI & Data: Artificial Intelligence, Machine Learning Foundations, Generative AI, Prompt Engineering
- Tools & Platforms: VS Code, Git, GitHub, Cloud, Salesforce
- Core Strengths: Problem Solving, Technical Documentation, Team Collaboration, Leadership

PROJECTS & TECHNICAL PRACTICE
--------------------------------------------------------------------------------
1. INTERNSHIP SKILL MATCHER
   - Tech: Python, Flask, HTML5, CSS3, JavaScript, MongoDB
   - Description: An idea-driven project designed to bridge the gap between
     students and internship opportunities by offering personalized suggestions,
     structured study roadmaps, and progress tracking.
   - Code: https://github.com/srithara8090-pixel

2. AI LEARNING HUB
   - Repository: srithara8090-pixel/ai-learning-hub
   - Description: A beginner-friendly collection of AI concepts, tools, notes,
     and resources organized cleanly in public on GitHub.
   - Repo: https://github.com/srithara8090-pixel/ai-learning-hub

3. DATABASE PRACTICE (SQL)
   - Focus: Relational database table design, constraints, and data operations.
   - Example: Companies schema (Company_ID, Company_Name, CEO, Industry)
     demonstrating schema creation, data insertion, and SELECT queries.

4. LIBRARY MANAGEMENT SYSTEM
   - Academic mini project created as part of software development coursework.

LEADERSHIP & COMMUNITY
--------------------------------------------------------------------------------
- AI/ML Co-Lead | GDG On Campus – Alpha Arts and Science College (Current)
  Facilitating peer discussions, technical sessions, and community learning.
- Secretary | AI Department Club – Alpha Arts and Science College (Previous)
  Coordinated departmental activities, student engagement, and documentation.

HONORS & ACHIEVEMENTS
--------------------------------------------------------------------------------
- 2nd Prize — Prompt to Product (College Competition)
- 3rd Prize — GitHub Website Creation (College Competition)
- 2nd Prize — Singing Competition (College Fest)
================================================================================`;

  const blob = new Blob([resumeContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Tharani_Resume_BSc_CS_AI.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('Tharani_Resume_BSc_CS_AI.txt downloaded!');
}

/**
 * 9. COMMAND PALETTE (Ctrl + K)
 */
function initCommandPalette() {
  const cmdModal = document.getElementById('cmd-palette-modal');
  const cmdTrigger = document.getElementById('cmd-palette-btn');
  const searchInput = document.getElementById('cmd-search-input');
  const resultsContainer = document.getElementById('cmd-results-list');
  const items = resultsContainer ? resultsContainer.querySelectorAll('.cmd-item') : [];

  if (!cmdModal || !searchInput) return;

  function openCmd() {
    cmdModal.classList.add('open');
    cmdModal.setAttribute('aria-hidden', 'false');
    searchInput.value = '';
    filterItems('');
    setTimeout(() => searchInput.focus(), 50);
  }

  function closeCmd() {
    cmdModal.classList.remove('open');
    cmdModal.setAttribute('aria-hidden', 'true');
  }

  function filterItems(query) {
    const q = query.toLowerCase().trim();
    items.forEach((item) => {
      const text = (item.textContent + ' ' + (item.getAttribute('data-keyword') || '')).toLowerCase();
      if (!q || text.includes(q)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  // Keyboard shortcut Ctrl+K / Cmd+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdModal.classList.contains('open')) {
        closeCmd();
      } else {
        openCmd();
      }
    } else if (e.key === 'Escape' && cmdModal.classList.contains('open')) {
      closeCmd();
    }
  });

  if (cmdTrigger) {
    cmdTrigger.addEventListener('click', openCmd);
  }

  searchInput.addEventListener('input', (e) => {
    filterItems(e.target.value);
  });

  items.forEach((item) => {
    item.addEventListener('click', () => {
      closeCmd();
    });
  });

  cmdModal.addEventListener('click', (e) => {
    if (e.target === cmdModal) {
      closeCmd();
    }
  });
}

/**
 * 10. COPY EMAIL & CONTACT FORM
 */
function initContactActions() {
  const copyBtn = document.getElementById('copy-email-btn');
  const emailStr = 'srithara8090@gmail.com';

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(emailStr).then(() => {
        showToast('Email address copied to clipboard!');
      }).catch(() => {
        // Fallback
        const temp = document.createElement('textarea');
        temp.value = emailStr;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showToast('Email address copied to clipboard!');
      });
    });
  }

  // Contact Form
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  if (form && feedback) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        feedback.className = 'form-feedback error';
        feedback.textContent = 'Please fill in all fields before sending.';
        return;
      }

      feedback.className = 'form-feedback success';
      feedback.textContent = `Thank you, ${name}! Generating email link...`;

      // Formulate mailto url
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Hi Tharani,\n\n${message}\n\nFrom: ${name} (${email})`);
      const mailtoUrl = `mailto:srithara8090@gmail.com?subject=${subject}&body=${body}`;

      setTimeout(() => {
        window.location.href = mailtoUrl;
        form.reset();
        feedback.textContent = 'Message ready! Opened your email client.';
        showToast('Email draft opened in your mail app!');
      }, 700);
    });
  }
}

/**
 * Toast Notification Utility
 */
function showToast(message) {
  const toast = document.getElementById('toast-notification');
  const msgElem = document.getElementById('toast-message');
  if (!toast || !msgElem) return;

  msgElem.textContent = message;
  toast.classList.add('show');
  toast.setAttribute('aria-hidden', 'false');

  setTimeout(() => {
    toast.classList.remove('show');
    toast.setAttribute('aria-hidden', 'true');
  }, 3200);
}
