// AuraPort - Main Application Script (app.js)

document.addEventListener("DOMContentLoaded", () => {
  // Ensure portfolioData is loaded
  if (!window.portfolioData) {
    console.error("Portfolio data not found!");
    return;
  }

  const data = window.portfolioData;
  const agent = new AIAgent(data);

  // Initialize all modules
  initTheme(data);
  renderHero(data);
  renderAbout(data);
  renderSkills(data);
  renderProjects(data);
  renderTimeline(data);
  renderAchievements(data);
  renderContactInfo(data);
  initProjectFilters(data);
  initModals(data, agent);
  initChatbotUI(agent);
  initMobileMenu();
  initContactForm();

  // Scroll Header Effect
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".header");
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
});

// 1. Theme Configuration
function initTheme(data) {
  if (data.theme) {
    document.documentElement.style.setProperty('--primary-hue', data.theme.hue || 260);
    if (data.theme.primaryGlow) {
      document.documentElement.style.setProperty('--glow-primary', data.theme.primaryGlow);
    }
    if (data.theme.secondaryGlow) {
      document.documentElement.style.setProperty('--glow-secondary', data.theme.secondaryGlow);
    }
  }
}

// 2. Render Hero Section
function renderHero(data) {
  const socialsContainer = document.getElementById("hero-socials");

  // Render Social Links
  let socialHtml = "";
  if (data.profile.github) {
    socialHtml += `<a href="${data.profile.github}" target="_blank" class="social-icon" title="GitHub"><i class="fab fa-github"></i></a>`;
  }
  if (data.profile.linkedin) {
    socialHtml += `<a href="${data.profile.linkedin}" target="_blank" class="social-icon" title="LinkedIn"><i class="fab fa-linkedin-in"></i></a>`;
  }
  if (data.profile.email) {
    socialHtml += `<a href="mailto:${data.profile.email}" class="social-icon" title="Email"><i class="far fa-envelope"></i></a>`;
  }
  socialsContainer.innerHTML = socialHtml;
}

// 3. Render About Section
function renderAbout(data) {
  const bioContainer = document.getElementById("about-bio");
  const detailsContainer = document.getElementById("about-details");

  bioContainer.textContent = data.profile.bio;

  const details = [
    { label: "Role", val: data.profile.title },
    { label: "Location", val: data.profile.location },
    { label: "Email", val: data.profile.email },
    { label: "Phone", val: data.profile.phone }
  ];

  detailsContainer.innerHTML = details.map(d => `
    <div class="detail-item">
      <span class="detail-label">${d.label}</span>
      <span class="detail-val">${d.val}</span>
    </div>
  `).join("");
}

// 4. Render Skills Section
function renderSkills(data) {
  const container = document.getElementById("skills-container");
  
  const html = data.skills.map(cat => `
    <div class="glass-card skills-category-card">
      <div class="skills-cat-header">
        <i class="fas ${cat.icon || 'fa-code'}"></i>
        <h3 class="skills-cat-title">${cat.category}</h3>
      </div>
      <div class="skill-list">
        ${cat.items.map(item => `
          <div class="skill-item">
            <div class="skill-info">
              <span class="skill-name">${item.name}</span>
              <span class="skill-percentage">${item.level}%</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" data-level="${item.level}"></div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("");

  container.innerHTML = html;

  // Animate progress bars on scroll intersection
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll(".progress-fill");
        fills.forEach(fill => {
          const level = fill.getAttribute("data-level");
          fill.style.width = `${level}%`;
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(container);
}

// 5. Render Projects List
function renderProjects(data) {
  const container = document.getElementById("projects-container");
  
  const html = data.projects.map(prj => `
    <div class="glass-card project-card" data-category="${prj.category}" id="project-card-${prj.id}">
      <div class="project-card-header">
        <span class="project-cat-badge">${prj.category}</span>
        <div class="project-links">
          ${prj.github ? `<a href="${prj.github}" target="_blank" class="project-link-icon" title="GitHub"><i class="fab fa-github"></i></a>` : ""}
          ${prj.live ? `<a href="${prj.live}" target="_blank" class="project-link-icon" title="Live Demo"><i class="fas fa-external-link-alt"></i></a>` : ""}
        </div>
      </div>
      <h3 class="project-card-title">${prj.title}</h3>
      <span class="project-card-tagline">${prj.tagline}</span>
      <p class="project-card-summary">${prj.summary}</p>
      <div class="tech-chips">
        ${prj.stack.map(s => `<span class="tech-chip">${s}</span>`).join("")}
      </div>
      <div class="project-card-footer">
        <button class="project-details-btn" data-project-id="${prj.id}">
          Read Details <i class="fas fa-arrow-right"></i>
        </button>
        <button class="project-ask-ai-btn" data-project-title="${prj.title}">
          <i class="fas fa-robot"></i> Ask AI
        </button>
      </div>
    </div>
  `).join("");

  container.innerHTML = html;
}

// 6. Render Timeline Section
function renderTimeline(data) {
  const container = document.getElementById("timeline-container");
  
  const html = data.timeline.map(item => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="glass-card timeline-card">
        <span class="timeline-date">${item.date}</span>
        <h3 class="timeline-title">${item.title}</h3>
        <h4 class="timeline-institution">${item.institution}</h4>
        <p class="timeline-details">${item.details}</p>
      </div>
    </div>
  `).join("");

  container.innerHTML = html;
}

// 7. Render Achievements Section
function renderAchievements(data) {
  const container = document.getElementById("achievements-container");
  
  const html = data.achievements.map(item => `
    <div class="glass-card achievement-card">
      <div class="achievement-icon-wrapper">
        <i class="fas ${item.icon || 'fa-trophy'}"></i>
      </div>
      <h3 class="achievement-title">${item.title}</h3>
      <p class="achievement-desc">${item.description}</p>
    </div>
  `).join("");

  container.innerHTML = html;
}

// 8. Render Contact Section Info Cards
function renderContactInfo(data) {
  const container = document.getElementById("contact-info-container");
  
  const cards = [
    { label: "Email Me", val: data.profile.email, icon: "fa-envelope", href: `mailto:${data.profile.email}` },
    { label: "Call Me", val: data.profile.phone, icon: "fa-phone", href: `tel:${data.profile.phone.replace(/[\s\-\+]/g, '')}` },
    { label: "My Location", val: data.profile.location, icon: "fa-map-marker-alt", href: "#" }
  ];

  container.innerHTML = cards.map(c => `
    <a href="${c.href}" class="glass-card contact-info-card" ${c.href !== '#' ? 'target="_blank"' : ''}>
      <div class="contact-info-icon">
        <i class="fas ${c.icon}"></i>
      </div>
      <div class="contact-info-text">
        <span class="contact-info-label">${c.label}</span>
        <span class="contact-info-value">${c.val}</span>
      </div>
    </a>
  `).join("");
}

// Project Filtering & Search
function initProjectFilters(data) {
  const searchInput = document.getElementById("project-search");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");

  let activeFilter = "all";
  let searchVal = "";

  function filterProjects() {
    cards.forEach(card => {
      const cat = card.getAttribute("data-category");
      const title = card.querySelector(".project-card-title").textContent.toLowerCase();
      const tagline = card.querySelector(".project-card-tagline").textContent.toLowerCase();
      const summary = card.querySelector(".project-card-summary").textContent.toLowerCase();
      
      const categoryMatch = activeFilter === "all" || cat === activeFilter;
      const textMatch = searchVal === "" || 
                        title.includes(searchVal) || 
                        tagline.includes(searchVal) || 
                        summary.includes(searchVal);

      if (categoryMatch && textMatch) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  }

  // Filter Button click listener
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.getAttribute("data-filter");
      filterProjects();
    });
  });

  // Search input listener
  searchInput.addEventListener("input", (e) => {
    searchVal = e.target.value.toLowerCase().trim();
    filterProjects();
  });
}

// Project Details Modals
function initModals(data, agent) {
  const modal = document.getElementById("project-modal");
  const modalBody = document.getElementById("modal-body");
  const closeBtn = document.getElementById("modal-close");
  const detailButtons = document.querySelectorAll(".project-details-btn");

  function openModal(id) {
    const prj = data.projects.find(p => p.id === id);
    if (!prj) return;

    const html = `
      <span class="modal-tag">${prj.category}</span>
      <h3 class="modal-title">${prj.title}</h3>
      <div class="modal-tagline">${prj.tagline}</div>
      <p class="modal-desc">${prj.description}</p>
      
      <h4 class="modal-subtitle"><i class="fas fa-list-check"></i> Project Highlights</h4>
      <ul class="modal-bullet-list">
        ${prj.highlights.map(h => `<li>${h}</li>`).join("")}
      </ul>

      <h4 class="modal-subtitle"><i class="fas fa-laptop-code"></i> Tech Stack</h4>
      <div class="tech-chips" style="margin-bottom: 25px;">
        ${prj.stack.map(s => `<span class="tech-chip">${s}</span>`).join("")}
      </div>

      <div class="modal-footer-row">
        <div class="modal-actions">
          ${prj.github ? `<a href="${prj.github}" target="_blank" class="primary-btn"><i class="fab fa-github"></i> GitHub</a>` : ""}
          ${prj.live ? `<a href="${prj.live}" target="_blank" class="secondary-btn"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ""}
        </div>
        <button class="project-ask-ai-btn" data-project-title="${prj.title}" style="padding: 10px 18px; font-size: 0.88rem;">
          <i class="fas fa-robot"></i> Ask AI about this project
        </button>
      </div>
    `;

    modalBody.innerHTML = html;
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Disable background scrolling

    // Bind the Ask AI button inside the modal
    modalBody.querySelector(".project-ask-ai-btn").addEventListener("click", (e) => {
      closeModal();
      triggerAskAIForProject(e.target.closest(".project-ask-ai-btn").getAttribute("data-project-title"));
    });
  }

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "auto"; // Re-enable background scrolling
  }

  detailButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-project-id");
      openModal(id);
    });
  });

  closeBtn.addEventListener("click", closeModal);
  
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Bind all standalone card Ask AI buttons
  document.querySelectorAll(".project-ask-ai-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const title = btn.getAttribute("data-project-title");
      triggerAskAIForProject(title);
    });
  });

  function triggerAskAIForProject(title) {
    const drawer = document.getElementById("chat-drawer");
    drawer.classList.add("active");
    
    // Auto submit query to chat
    const input = document.getElementById("chat-user-input");
    input.value = `Tell me about the ${title} project`;
    document.getElementById("chat-form-submit").dispatchEvent(new Event("submit"));
  }
}

// Conversational Chatbot UI
function initChatbotUI(agent) {
  const drawer = document.getElementById("chat-drawer");
  const openBtn = document.getElementById("open-chat-btn");
  const closeBtn = document.getElementById("close-chat-btn");
  const heroAskBtn = document.getElementById("hero-ask-ai");
  const mobChatBtn = document.getElementById("mobile-chat-btn");

  const chatForm = document.getElementById("chat-form-submit");
  const chatInput = document.getElementById("chat-user-input");
  const chatMessages = document.getElementById("chat-messages");
  const chatSuggestions = document.getElementById("chat-suggestions");

  const settingsToggle = document.getElementById("chat-settings-toggle");
  const settingsPanel = document.getElementById("chat-settings-panel");
  const apiKeyInput = document.getElementById("api-key-input");
  const toggleKeyBtn = document.getElementById("toggle-key-visibility");
  const saveKeyBtn = document.getElementById("save-key-btn");
  const clearKeyBtn = document.getElementById("clear-key-btn");

  // Load saved API Key into UI input on launch
  apiKeyInput.value = agent.apiKey;

  function toggleDrawer(open) {
    if (open) {
      drawer.classList.add("active");
    } else {
      drawer.classList.remove("active");
      settingsPanel.classList.remove("active");
    }
  }

  // Toggle buttons listeners
  openBtn.addEventListener("click", () => toggleDrawer(true));
  closeBtn.addEventListener("click", () => toggleDrawer(false));
  if (heroAskBtn) heroAskBtn.addEventListener("click", () => toggleDrawer(true));
  if (mobChatBtn) mobChatBtn.addEventListener("click", () => {
    document.getElementById("mobile-nav").classList.remove("active");
    toggleDrawer(true);
  });

  // Settings Panel listeners
  settingsToggle.addEventListener("click", () => {
    settingsPanel.classList.toggle("active");
  });

  toggleKeyBtn.addEventListener("click", () => {
    const isPass = apiKeyInput.type === "password";
    apiKeyInput.type = isPass ? "text" : "password";
    toggleKeyBtn.querySelector("i").className = isPass ? "fas fa-eye-slash" : "fas fa-eye";
  });

  saveKeyBtn.addEventListener("click", () => {
    const key = apiKeyInput.value.trim();
    agent.setApiKey(key);
    settingsPanel.classList.remove("active");
    appendSystemMessage(key ? "✅ Gemini API Key saved. Conversational AI Active!" : "ℹ️ API Key cleared. Operating in Offline Smart Mode.");
  });

  clearKeyBtn.addEventListener("click", () => {
    apiKeyInput.value = "";
    agent.setApiKey("");
    settingsPanel.classList.remove("active");
    appendSystemMessage("ℹ️ API Key cleared. Operating in Offline Smart Mode.");
  });

  // Append System Notifications inside Chat
  function appendSystemMessage(text) {
    const msg = document.createElement("div");
    msg.className = "message bot-message";
    msg.innerHTML = `<div class="message-content" style="border-left-color: var(--secondary); background: rgba(0, 242, 254, 0.05);">${text}</div><span class="message-time">System notification</span>`;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Add Message Block
  function addMessage(sender, text) {
    const msgBlock = document.createElement("div");
    msgBlock.className = `message ${sender === 'user' ? 'user-message' : 'bot-message'}`;
    
    // Parse simple markdown-like elements (bullets, bold, links)
    let formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: var(--secondary-light); text-decoration: underline;">$1</a>');

    // Handle bullets
    if (formattedText.includes('* ')) {
      formattedText = formattedText.split('<br>').map(line => {
        if (line.trim().startsWith('* ')) {
          return `<li style="margin-left: 15px; list-style-type: square;">${line.trim().substring(2)}</li>`;
        }
        return line;
      }).join('');
    }

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    msgBlock.innerHTML = `
      <div class="message-content">${formattedText}</div>
      <span class="message-time">${time}</span>
    `;
    
    chatMessages.appendChild(msgBlock);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Show Typing Indicator
  function showTypingIndicator() {
    const indicator = document.createElement("div");
    indicator.className = "message bot-message typing-indicator-wrapper";
    indicator.id = "typing-indicator";
    indicator.innerHTML = `
      <div class="message-content">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Hide Typing Indicator
  function hideTypingIndicator() {
    const ind = document.getElementById("typing-indicator");
    if (ind) ind.remove();
  }

  // Submit Handler
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = chatInput.value.trim();
    if (!query) return;

    chatInput.value = "";
    addMessage("user", query);
    
    showTypingIndicator();
    
    try {
      const response = await agent.ask(query);
      hideTypingIndicator();
      addMessage("bot", response);
    } catch (err) {
      hideTypingIndicator();
      addMessage("bot", `❌ Error matching AI response: ${err.message}`);
    }
  });

  // Suggested Questions click handler
  chatSuggestions.querySelectorAll(".suggest-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      chatInput.value = btn.textContent;
      chatForm.dispatchEvent(new Event("submit"));
    });
  });
}

// Mobile Navigation Menu
function initMobileMenu() {
  const toggleBtn = document.getElementById("mobile-toggle");
  const navDrawer = document.getElementById("mobile-nav");
  const links = document.querySelectorAll(".mobile-link");

  toggleBtn.addEventListener("click", () => {
    navDrawer.classList.toggle("active");
    toggleBtn.querySelector("i").className = navDrawer.classList.contains("active") ? "fas fa-times" : "fas fa-bars";
  });

  links.forEach(link => {
    link.addEventListener("click", () => {
      navDrawer.classList.remove("active");
      toggleBtn.querySelector("i").className = "fas fa-bars";
    });
  });
}

// Contact Form Validation & Simulated Submission
function initContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const submitBtn = document.getElementById("form-submit-btn");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const name = document.getElementById("form-name").value.trim();
    const email = document.getElementById("form-email").value.trim();
    const subject = document.getElementById("form-subject").value.trim();
    const message = document.getElementById("form-message").value.trim();

    if (!name || !email || !subject || !message) {
      status.className = "form-status error";
      status.textContent = "Please fill in all details.";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.querySelector("span").textContent = "Sending...";
    submitBtn.querySelector("i").className = "fas fa-spinner fa-spin";
    status.textContent = "";

    // Simulate server response delay
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.querySelector("span").textContent = "Send Message";
      submitBtn.querySelector("i").className = "fas fa-paper-plane";
      
      status.className = "form-status success";
      status.innerHTML = `<i class="fas fa-circle-check"></i> Thank you, ${name}! Your message has been sent successfully. Harsh will contact you soon.`;
      
      form.reset();
    }, 1500);
  });
}
