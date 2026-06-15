// AuraOS - Mock Terminal Console Engine (terminal.js)

class TerminalEngine {
  constructor(portfolioData) {
    this.data = portfolioData;
    this.currentDir = "/";
    this.history = [];
    
    // Virtual File System Structure
    this.fs = {
      "/": ["projects", "skills", "info"],
      "/projects": [
        "nexusast.txt", "solarmind.txt", "omniagent.txt", "smartcity.txt",
        "drrt.txt", "crop.txt", "fitness.txt", "sales.txt"
      ],
      "/skills": [
        "generative_ai.txt", "machine_learning.txt", "programming.txt", "visualization.txt"
      ],
      "/info": [
        "bio.txt", "contact.txt", "education.txt", "achievements.txt"
      ]
    };

    // Arm Wrestling Game State
    this.wrestleState = {
      active: false,
      score: 0,
      timer: 0,
      interval: null
    };
  }

  // Parse terminal command
  execute(line) {
    const tokens = line.trim().split(/\s+/);
    const cmd = tokens[0].toLowerCase();
    const args = tokens.slice(1);

    // If Arm Wrestling Game is active, parse keys differently
    if (this.wrestleState.active) {
      return this.handleWrestleInput(line.trim().toUpperCase());
    }

    if (!cmd) return "";

    switch (cmd) {
      case "help":
        return `Available commands:
  ls           - List files in current directory
  cd <dir>     - Change directory (e.g. cd projects)
  cat <file>   - View file contents (e.g. cat bio.txt)
  skills       - Display skills ASCII chart
  projects     - List all feature projects
  contact      - Display contact coordinates
  neofetch     - Display system info & ASCII banner
  wrestle      - Challenge Harsh's AI in Arm Wrestling!
  clear        - Clear the console screen`;

      case "ls":
        return this.cmdLs();

      case "cd":
        return this.cmdCd(args[0]);

      case "cat":
        return this.cmdCat(args[0]);

      case "skills":
        return this.cmdSkills();

      case "projects":
        return this.cmdProjects();

      case "contact":
        return this.cmdContact();

      case "neofetch":
        return this.cmdNeofetch();

      case "wrestle":
        return this.startWrestleGame();

      default:
        return `command not found: ${cmd}. Type 'help' for available commands.`;
    }
  }

  // LS command
  cmdLs() {
    const items = this.fs[this.currentDir] || [];
    if (items.length === 0) return "(empty directory)";
    
    // Format directories vs files
    return items.map(item => {
      if (!item.endsWith(".txt")) {
        return `<span style="color: var(--secondary); font-weight: bold;">${item}/</span>`;
      }
      return `<span style="color: var(--text-main);">${item}</span>`;
    }).join("    ");
  }

  // CD command
  cmdCd(target) {
    if (!target || target === "~") {
      this.currentDir = "/";
      return "";
    }

    if (target === "..") {
      if (this.currentDir !== "/") {
        this.currentDir = "/";
      }
      return "";
    }

    // Resolve relative pathing
    let resolved = this.currentDir === "/" ? "/" + target : this.currentDir + "/" + target;
    resolved = resolved.replace(/\/+/g, "/");

    if (this.fs[resolved]) {
      this.currentDir = resolved;
      return "";
    }

    return `cd: no such directory: ${target}`;
  }

  // CAT command
  cmdCat(filename) {
    if (!filename) return "cat: missing filename. Usage: cat <file>";

    // Resolve absolute path in virtual fs
    let filePath = filename;
    if (!filename.includes("/")) {
      filePath = this.currentDir === "/" ? "/" + filename : this.currentDir + "/" + filename;
    }
    filePath = filePath.replace(/\/+/g, "/");

    const dirPath = filePath.substring(0, filePath.lastIndexOf("/")) || "/";
    const name = filePath.substring(filePath.lastIndexOf("/") + 1);

    if (!this.fs[dirPath] || !this.fs[dirPath].includes(name)) {
      return `cat: ${filename}: No such file in directory.`;
    }

    // Return file mockup contents
    return this.getFileContent(name);
  }

  // Mock File Database
  getFileContent(name) {
    const p = this.data.profile;
    
    switch (name) {
      // Info files
      case "bio.txt":
        return p.bio;
      case "contact.txt":
        return `EMAIL:    ${p.email}\nPHONE:    ${p.phone}\nLINKEDIN: ${p.linkedin}\nGITHUB:   ${p.github}\nLOCATION: ${p.location}`;
      case "education.txt":
        return this.data.timeline.map(item => `[${item.date}] ${item.title}\nInstitution: ${item.institution}\n${item.details}\n`).join("\n");
      case "achievements.txt":
        return this.data.achievements.map(a => `✦ ${a.title}\n  ${a.description}\n`).join("\n");

      // Skill files
      case "generative_ai.txt":
        return `GENAI & AGENTS CORES:\n` + this.getSkillsCategory("Generative AI & LLMs");
      case "machine_learning.txt":
        return `ML / DL WORKFLOWS:\n` + this.getSkillsCategory("Machine Learning & Stats");
      case "programming.txt":
        return `LANGUAGES & FRAMEWORKS:\n` + this.getSkillsCategory("Programming & Databases");
      case "visualization.txt":
        return `BI & AUTOMATIONS:\n` + this.getSkillsCategory("Data Visualization & Automation");

      // Project files
      default:
        const prjId = name.replace(".txt", "");
        const prj = this.data.projects.find(prj => prj.id.includes(prjId) || prjId.includes(prj.id));
        if (prj) {
          return `TITLE:    ${prj.title}\nTAGLINE:  ${prj.tagline}\nSUMMARY:  ${prj.summary}\nSTACK:    ${prj.stack.join(", ")}\nHIGHLIGHTS:\n${prj.highlights.map(h => ` - ${h}`).join("\n")}`;
        }
        return `File corrupt or empty.`;
    }
  }

  getSkillsCategory(categoryName) {
    const cat = this.data.skills.find(s => s.category === categoryName);
    if (!cat) return "";
    return cat.items.map(item => `  - ${item.name.padEnd(35)} [${this.makeProgressBar(item.level)}] ${item.level}%`).join("\n");
  }

  makeProgressBar(level) {
    const chars = Math.round(level / 10);
    return "█".repeat(chars) + "░".repeat(10 - chars);
  }

  // Skills Chart Command
  cmdSkills() {
    let output = "📊 **Harsh's Technical Mastery Index**\n\n";
    this.data.skills.forEach(cat => {
      output += `<span style="color: var(--secondary); font-weight: bold;">[${cat.category}]</span>\n`;
      cat.items.forEach(item => {
        output += `  ${item.name.padEnd(32)} [${this.makeProgressBar(item.level)}] ${item.level}%\n`;
      });
      output += "\n";
    });
    return output;
  }

  // Projects List Command
  cmdProjects() {
    let output = "📁 **Featured Projects List**\n\n";
    this.data.projects.forEach(prj => {
      output += `* **${prj.title}** (${prj.category})\n  _${prj.tagline}_\n  Stack: ${prj.stack.join(", ")}\n\n`;
    });
    return output;
  }

  // Contact command
  cmdContact() {
    const p = this.data.profile;
    return `📞 **Contact Interface:**
  Email:     <a href="mailto:${p.email}" style="color: var(--secondary-light); text-decoration: underline;">${p.email}</a>
  Phone:     ${p.phone}
  LinkedIn:  <a href="${p.linkedin}" target="_blank" style="color: var(--secondary-light); text-decoration: underline;">linkedin.com/in/harshhirasingh</a>
  GitHub:    <a href="${p.github}" target="_blank" style="color: var(--secondary-light); text-decoration: underline;">github.com/Harshsingh2598</a>
  Location:  ${p.location}`;
  }

  // NEOFETCH Command
  cmdNeofetch() {
    const p = this.data.profile;
    const banner = `
     _/\_          <span style="color: var(--primary); font-weight: bold;">Harsh Singh</span> @ AuraOS
    / o o \\        --------------------
   (   "   )       ROLE:     ${p.title}
    \\  -  /        COLLEGE:  B.Sc. Data Science, NKT Thane
    /     \\        CERT:     Data Scientist Professional, Imarticus
   /       \\       SPORTS:   3x State & National Arm Wrestling Champion
  / |     | \\      SHELL:    AuraOS Bash v1.0
  \\ |     | /      LOCAL:    Thane, Maharashtra, India
   \\|_____|/       WEBSITE:  harshsingh2598.github.io
    `;
    return banner;
  }

  // ARM WRESTLING MINI GAME
  startWrestleGame() {
    this.wrestleState.active = true;
    this.wrestleState.score = 0;
    this.wrestleState.timer = 5; // 5 seconds duration
    
    // Setup message
    let setupMsg = `🤖 **CHALLENGE INITIATED!** 🤖
You are facing Harsh Singh—the **3x Maharashtra State and National Arm Wrestling Champion**!

Your arm is locked. You must build up massive force to push his hand down!
-----------------------------------------------------------------
**HOW TO PLAY:** 
Type **'PULL'** and press Enter as fast as you can.
You have **5 SECONDS** before your grip slips!

Type **'PULL'** now to begin! (Time starts on your first pull)`;
    
    return setupMsg;
  }

  handleWrestleInput(input) {
    if (input !== "PULL") {
      return `[!] CORRUPT GRIP: You must type **'PULL'**! (Time remaining: ${this.wrestleState.timer}s)`;
    }

    // Start timer on first pull
    if (this.wrestleState.score === 0) {
      this.wrestleState.interval = setInterval(() => {
        this.wrestleState.timer--;
        if (this.wrestleState.timer <= 0) {
          this.endWrestleGame();
        }
      }, 1000);
    }

    this.wrestleState.score++;
    
    // Provide live gauge metrics
    const gap = 10; // Clicks required to beat champion
    const playerPos = this.wrestleState.score;
    const bar = "█".repeat(playerPos) + "─" + "░".repeat(Math.max(0, gap - playerPos));
    
    return `[PULL FORCE]: [${bar}] (${this.wrestleState.score}/${gap}) - Time left: ${this.wrestleState.timer}s!`;
  }

  endWrestleGame() {
    clearInterval(this.wrestleState.interval);
    this.wrestleState.active = false;
    
    const finalScore = this.wrestleState.score;
    const required = 10;
    
    let terminal = document.querySelector(".terminal-output");
    let resultLine = document.createElement("div");
    resultLine.className = "terminal-log-line";
    
    if (finalScore >= required) {
      resultLine.innerHTML = `
<span style="color: var(--secondary); font-weight: bold;">🏆 MATCH OVER: YOU WON! 🏆</span>
Amazing speed! You registered ${finalScore} pulls and successfully pinned Harsh's arm!
*Harsh shakes your hand: "Incredible speed. You've got championship focus!"*
`;
    } else {
      resultLine.innerHTML = `
<span style="color: #ff0055; font-weight: bold;">❌ MATCH OVER: HARSH WINS! ❌</span>
Time expired! You registered ${finalScore} pulls. 
Harsh (National Champion) pinned your arm with a lightning-fast hook!
*Harsh grins: "Not bad! But arm wrestling requires years of tendon training. Try again!"*
`;
    }
    
    // Append to DOM manually in UI terminal log
    const termBody = document.getElementById("terminal-logs");
    if (termBody) {
      termBody.appendChild(resultLine);
      const termWrap = document.getElementById("terminal-body-scroll");
      if (termWrap) termWrap.scrollTop = termWrap.scrollHeight;
    }
  }
}
