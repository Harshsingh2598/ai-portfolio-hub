// AuraOS - Main Application & Workstation Controller Script (app.js)

document.addEventListener("DOMContentLoaded", () => {
  // Ensure portfolioData is loaded
  if (!window.portfolioData) {
    console.error("Portfolio data not found!");
    return;
  }

  const data = window.portfolioData;
  const agent = new AIAgent(data);
  const terminal = new TerminalEngine(data);

  // 1. Initialize System Elements
  initSystemClocks();
  renderProfileHUD(data);
  renderSkillsHUD(data);
  renderProjectsHUD(data);
  initTypewriter();

  // 2. Initialize UI Tabs Router
  let graphInstance = null;
  initTabsRouter(data, (nodeId) => {
    openProjectModal(nodeId, data, agent);
  });

  // Load physics graph canvas by default
  setTimeout(() => {
    graphInstance = new NodeGraph("physics-canvas", data, (nodeId) => {
      openProjectModal(nodeId, data, agent);
    });
  }, 100);

  // 3. Initialize Terminal CLI Console
  initTerminalCLI(terminal, agent);

  // 4. Initialize Chat replica & Settings
  initChatbotUI(agent);
  initSettingsPanel(agent);

  // 5. Initialize Sound & Microphone bindings
  initAudioVoiceControls(agent);

  // 6. Bind Modal window
  initProjectModals(data, agent);
});

// System Clocks & CPU load simulator
function initSystemClocks() {
  const clockEl = document.getElementById("system-clock");
  const cpuEl = document.getElementById("cpu-load");

  setInterval(() => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    clockEl.textContent = time;
  }, 1000);

  setInterval(() => {
    const mockCpu = Math.floor(Math.random() * 12) + 5; // 5% to 17% load
    cpuEl.textContent = `${mockCpu}%`;
  }, 4000);
}

// Render Profile biography details
function renderProfileHUD(data) {
  const bioContainer = document.getElementById("about-bio");
  const detailsContainer = document.getElementById("about-details");
  const timelineContainer = document.getElementById("timeline-container");
  const achievementsContainer = document.getElementById("achievements-container");

  bioContainer.textContent = data.profile.bio;

  // Render Coordinates
  const details = [
    { label: "IP Coordinates", val: "192.168.1.107 (Local Workstation)" },
    { label: "Role Title", val: data.profile.title },
    { label: "Location Node", val: data.profile.location },
    { label: "Direct Comms", val: data.profile.email },
    { label: "Phone Ring", val: data.profile.phone }
  ];
  detailsContainer.innerHTML = details.map(d => `
    <div class="detail-item">
      <span class="detail-label">${d.label}:</span>
      <span class="detail-val">${d.val}</span>
    </div>
  `).join("");

  // Render Education Timeline
  timelineContainer.innerHTML = data.timeline.map(item => `
    <div class="timeline-hud-item">
      <span class="timeline-hud-date">${item.date}</span>
      <div class="timeline-hud-title">${item.title}</div>
      <div class="timeline-hud-inst">${item.institution}</div>
    </div>
  `).join("");

  // Render Achievements
  achievementsContainer.innerHTML = data.achievements.map(item => `
    <div class="glass-card achievement-card">
      <div class="achievement-icon-wrapper">
        <i class="fas ${item.icon || 'fa-trophy'}"></i>
      </div>
      <div>
        <h3 class="achievement-title">${item.title}</h3>
        <p class="achievement-desc">${item.description}</p>
      </div>
    </div>
  `).join("");
}

// Render Skills category panels
function renderSkillsHUD(data) {
  const container = document.getElementById("skills-container");
  
  container.innerHTML = data.skills.map(cat => `
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
}

// Render projects cards
function renderProjectsHUD(data) {
  const container = document.getElementById("projects-container");
  
  container.innerHTML = data.projects.map(prj => `
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
          Read Specs <i class="fas fa-arrow-right"></i>
        </button>
        <button class="project-ask-ai-btn" data-project-title="${prj.title}">
          <i class="fas fa-robot"></i> Ask AI
        </button>
      </div>
    </div>
  `).join("");
}

// Typing Text Effect
function initTypewriter() {
  const element = document.getElementById("typewriter");
  if (!element) return;
  const words = [
    "AI / ML Developer",
    "Data Scientist & Analyst",
    "NLP & Deep Learning Engineer",
    "National Arm Wrestling Champion"
  ];
  
  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIdx];
    
    if (isDeleting) {
      element.textContent = currentWord.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 50;
    } else {
      element.textContent = currentWord.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIdx === currentWord.length) {
      isDeleting = true;
      typingSpeed = 2000;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 1000);
}

// Tab router viewport management
function initTabsRouter(data, onNodeDoubleClick) {
  const buttons = document.querySelectorAll(".ribbon-btn[data-tab]");
  const sections = document.querySelectorAll(".viewport-section");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");
      
      // Update active classes
      buttons.forEach(b => b.classList.remove("active"));
      sections.forEach(s => s.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(`viewport-${targetTab}`).classList.add("active");

      // Specific tab load logic
      if (targetTab === "skills") {
        // Animate progress bars
        const fills = document.querySelectorAll(".progress-fill");
        fills.forEach(fill => {
          const lvl = fill.parentElement.parentElement.querySelector(".progress-fill").getAttribute("data-level");
          fill.style.width = `${lvl}%`;
        });
      }
      
      // Play brief click sound
      window.dispatchEvent(new CustomEvent("playAlertSound", { detail: "click" }));
    });
  });
}

// CLI Terminal bind controls
function initTerminalCLI(terminalEngine, agent) {
  const input = document.getElementById("terminal-input");
  const logs = document.getElementById("terminal-logs");
  const bodyScroll = document.getElementById("terminal-body-scroll");

  function appendLog(line, isHtml = false) {
    const el = document.createElement("div");
    el.className = "terminal-log-line";
    if (isHtml) {
      el.innerHTML = line;
    } else {
      el.textContent = line;
    }
    logs.appendChild(el);
    bodyScroll.scrollTop = bodyScroll.scrollHeight;
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const command = input.value;
      input.value = "";

      if (!command.trim()) return;

      // Log command line
      appendLog(`guest@auraos:~$ ${command}`);

      // Exec command
      if (command.trim().toLowerCase() === "clear") {
        logs.innerHTML = "";
        return;
      }

      // Play click sound
      agent.playAudioAlert("click");

      const response = terminalEngine.execute(command);
      
      // Format markdown-like code breaks in terminal response
      let formatted = response
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>')
        .replace(/`(.*?)`/g, '<code style="background: rgba(255,255,255,0.06); padding: 1px 4px; border-radius: 3px;">$1</code>');

      appendLog(formatted, true);
    }
  });

  // Bubble sound toggle dispatcher
  window.addEventListener("playAlertSound", (e) => {
    agent.playAudioAlert(e.detail);
  });
}

// Dynamic Chatbot binds
function initChatbotUI(agent) {
  const form = document.getElementById("chat-form-submit");
  const input = document.getElementById("chat-user-input");
  const messages = document.getElementById("chat-messages");
  const suggestions = document.getElementById("chat-suggestions");

  function addMessage(sender, text) {
    const msg = document.createElement("div");
    msg.className = `message ${sender === 'user' ? 'user-message' : 'bot-message'}`;
    
    let formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: var(--secondary-light); text-decoration: underline;">$1</a>');

    if (formattedText.includes('* ')) {
      formattedText = formattedText.split('<br>').map(line => {
        if (line.trim().startsWith('* ')) {
          return `<li style="margin-left: 15px; list-style-type: square;">${line.trim().substring(2)}</li>`;
        }
        return line;
      }).join('');
    }

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    msg.innerHTML = `
      <div class="message-content">${formattedText}</div>
      <span class="message-time">${time}</span>
    `;
    
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTypingIndicator() {
    const wrapper = document.createElement("div");
    wrapper.className = "message bot-message";
    wrapper.id = "chat-typing-indicator";
    wrapper.innerHTML = `
      <div class="message-content">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;
    messages.appendChild(wrapper);
    messages.scrollTop = messages.scrollHeight;
  }

  function hideTypingIndicator() {
    const el = document.getElementById("chat-typing-indicator");
    if (el) el.remove();
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    input.value = "";
    addMessage("user", query);
    showTypingIndicator();

    agent.playAudioAlert("click");

    try {
      const reply = await agent.ask(query);
      hideTypingIndicator();
      addMessage("bot", reply);
      agent.playAudioAlert("success");
    } catch (err) {
      hideTypingIndicator();
      addMessage("bot", `❌ Connection failure: ${err.message}`);
      agent.playAudioAlert("alert");
    }
  });

  // Bind Suggestions
  suggestions.querySelectorAll(".suggest-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      input.value = btn.textContent;
      form.dispatchEvent(new Event("submit"));
    });
  });
}

// OS Settings slider drawer binds
function initSettingsPanel(agent) {
  const toggleBtn = document.getElementById("os-settings-btn");
  const closeBtn = document.getElementById("settings-close-btn");
  const panel = document.getElementById("chat-settings-panel");
  
  const keyInput = document.getElementById("api-key-input");
  const toggleKey = document.getElementById("toggle-key-visibility");
  const saveBtn = document.getElementById("save-key-btn");
  const clearBtn = document.getElementById("clear-key-btn");

  const modeLbl = document.getElementById("chat-mode-lbl");
  const headerStatus = document.getElementById("engine-status");

  function updateModeUI() {
    const active = agent.isLLMActive();
    const label = active ? "Live Gemini LLM" : "Offline Matcher";
    modeLbl.textContent = label;
    headerStatus.textContent = label;
    headerStatus.style.color = active ? "var(--secondary-light)" : "var(--text-muted)";
  }

  // Set initial UI state
  updateModeUI();

  toggleBtn.addEventListener("click", () => {
    panel.classList.toggle("active");
    agent.playAudioAlert("click");
  });

  closeBtn.addEventListener("click", () => {
    panel.classList.remove("active");
  });

  toggleKey.addEventListener("click", () => {
    const isPass = keyInput.type === "password";
    keyInput.type = isPass ? "text" : "password";
    toggleKey.querySelector("i").className = isPass ? "fas fa-eye-slash" : "fas fa-eye";
  });

  saveBtn.addEventListener("click", () => {
    const key = keyInput.value.trim();
    agent.setApiKey(key);
    updateModeUI();
    panel.classList.remove("active");
    agent.playAudioAlert("success");
  });

  clearBtn.addEventListener("click", () => {
    keyInput.value = "";
    agent.setApiKey("");
    updateModeUI();
    panel.classList.remove("active");
    agent.playAudioAlert("alert");
  });
}

// Audio Alerts & Microphone Voice Recognition bindings
function initAudioVoiceControls(agent) {
  const soundBtn = document.getElementById("sound-toggle-btn");
  const micBtn = document.getElementById("mic-trigger-btn");
  const overlay = document.getElementById("voice-overlay");
  const transcriptEl = document.getElementById("voice-transcript");

  // Sound Toggle
  soundBtn.addEventListener("click", () => {
    agent.soundActive = !agent.soundActive;
    soundBtn.classList.toggle("active", agent.soundActive);
    soundBtn.querySelector("i").className = agent.soundActive ? "fas fa-volume-up" : "fas fa-volume-mute";
    soundBtn.querySelector(".ribbon-lbl").textContent = agent.soundActive ? "SOUND" : "MUTED";
    
    agent.playAudioAlert("click");
  });

  // Set initial state
  soundBtn.classList.toggle("active", agent.soundActive);

  // Microphone Voice Commands
  if (!agent.recognition) {
    micBtn.style.opacity = "0.4";
    micBtn.title = "Voice Commands unsupported in this browser.";
    return;
  }

  micBtn.addEventListener("click", () => {
    agent.playAudioAlert("click");
    
    overlay.classList.add("active");
    transcriptEl.textContent = "Listening for commands... Speak now!";
    agent.recognition.start();
  });

  agent.recognition.onresult = (e) => {
    const result = e.results[0][0].transcript;
    transcriptEl.textContent = `"${result}"`;
    agent.playAudioAlert("success");

    setTimeout(() => {
      overlay.classList.remove("active");
      
      // Auto routing commands
      const command = result.toLowerCase().trim();
      
      // 1. Navigation shortcuts
      if (command.includes("show") || command.includes("display") || command.includes("open") || command.includes("view")) {
        if (command.includes("nexus") || command.includes("rag")) {
          document.querySelector(".ribbon-btn[data-tab='physics']").click();
          openProjectModal("nexusast", window.portfolioData, agent);
          return;
        }
        if (command.includes("solar") || command.includes("forecast")) {
          document.querySelector(".ribbon-btn[data-tab='physics']").click();
          openProjectModal("solarmind-ai", window.portfolioData, agent);
          return;
        }
        if (command.includes("skills") || command.includes("proficiency")) {
          document.querySelector(".ribbon-btn[data-tab='skills']").click();
          return;
        }
        if (command.includes("bio") || command.includes("timeline") || command.includes("education") || command.includes("profile")) {
          document.querySelector(".ribbon-btn[data-tab='profile']").click();
          return;
        }
        if (command.includes("projects") || command.includes("gallery")) {
          document.querySelector(".ribbon-btn[data-tab='projects']").click();
          return;
        }
      }

      // 2. Fallback: ask Chatbot directly
      const input = document.getElementById("chat-user-input");
      input.value = result;
      document.getElementById("chat-form-submit").dispatchEvent(new Event("submit"));
    }, 1000);
  };

  agent.recognition.onerror = (e) => {
    transcriptEl.textContent = `Speech recognition error: ${e.error}`;
    agent.playAudioAlert("alert");
    setTimeout(() => {
      overlay.classList.remove("active");
    }, 1500);
  };
}

// Modal popup triggers
function initProjectModals(data, agent) {
  const modal = document.getElementById("project-modal");
  const closeBtn = document.getElementById("modal-close");

  function closeModal() {
    modal.classList.remove("active");
  }

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

function openProjectModal(id, data, agent) {
  const modal = document.getElementById("project-modal");
  const modalBody = document.getElementById("modal-body");
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
      <button class="project-ask-ai-btn" data-project-title="${prj.title}" style="padding: 8px 14px; font-size: 0.8rem;">
        <i class="fas fa-robot"></i> Ask AI about this project
      </button>
    </div>
  `;

  modalBody.innerHTML = html;
  modal.classList.add("active");
  
  agent.playAudioAlert("success");

  // Bind the Ask AI button inside modal
  modalBody.querySelector(".project-ask-ai-btn").addEventListener("click", (e) => {
    modal.classList.remove("active");
    
    const title = e.target.closest(".project-ask-ai-btn").getAttribute("data-project-title");
    const input = document.getElementById("chat-user-input");
    input.value = `Tell me about the ${title} project`;
    document.getElementById("chat-form-submit").dispatchEvent(new Event("submit"));
  });
}
