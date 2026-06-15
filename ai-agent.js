// AuraPort - AI Portfolio Assistant Agent (ai-agent.js)

class AIAgent {
  constructor(portfolioData) {
    this.data = portfolioData;
    this.apiKey = localStorage.getItem("gemini_portfolio_api_key") || "";
    this.chatHistory = []; // Tracks messages for LLM mode
    this.isTyping = false;
  }

  // Check if LLM Mode is active
  isLLMActive() {
    return this.apiKey && this.apiKey.trim().length > 0;
  }

  // Get the system prompt context summarizing Harsh's resume
  getSystemPrompt() {
    const p = this.data.profile;
    const skillsList = this.data.skills.map(c => `- ${c.category}: ${c.items.map(i => i.name).join(", ")}`).join("\n");
    const projectList = this.data.projects.map(prj => `
* ${prj.title} (${prj.tagline})
  - Stack: ${prj.stack.join(", ")}
  - Summary: ${prj.summary}
  - Highlights: ${prj.highlights.map(h => `    + ${h}`).join("\n")}
`).join("\n");

    const timelineList = this.data.timeline.map(t => `- ${t.date}: ${t.title} at ${t.institution} (${t.details})`).join("\n");
    const achievementsList = this.data.achievements.map(a => `- ${a.title}: ${a.description}`).join("\n");

    return `You are the virtual AI Replica of Harsh Singh. Your purpose is to answer questions from visitors (recruiters, clients, or developers) about Harsh's resume, technical skills, projects, achievements, and contact details.

Answer questions in a friendly, professional, confident, and engaging tone. Adopt Harsh's persona ("I am Harsh...", "My project...", "I co-authored..."). Always highlight his technical strength in AI/ML alongside his discipline, which is proved by his national level achievements in Arm Wrestling. Keep answers relatively concise and format them with markdown (bold, bullets, tables).

Here is Harsh's official portfolio data:
---
PROFILE:
Name: ${p.name}
Role: ${p.title}
Subtitle: ${p.subtitle}
Tagline: ${p.tagline}
Biography: ${p.bio}
Email: ${p.email}
Phone: ${p.phone}
LinkedIn: ${p.linkedin}
GitHub: ${p.github}
Location: ${p.location}

SKILLS:
${skillsList}

FEATURED PROJECTS:
${projectList}

EDUCATION & TIMELINE:
${timelineList}

ACHIEVEMENTS & ATHLETICS:
${achievementsList}
---
Ensure you ONLY answer questions using the above facts. If asked about something outside this context, politely guide the conversation back to Harsh's skills, projects, arm wrestling achievements, or booking a call/contacting him. Do not hallucinate credentials.`;
  }

  // Set the Gemini API Key
  setApiKey(key) {
    this.apiKey = key;
    if (key) {
      localStorage.setItem("gemini_portfolio_api_key", key);
    } else {
      localStorage.removeItem("gemini_portfolio_api_key");
    }
  }

  // Respond using Offline Smart Matching Engine (Client-side keyword matching)
  respondOffline(query) {
    const q = query.toLowerCase();
    const p = this.data.profile;
    
    // Greeting
    if (q.match(/\b(hi|hello|hey|greetings|wassup|yo)\b/)) {
      return `Hello! I am Harsh's AI Agent. I can tell you about my AI/ML projects (like **NexusAST** or **SolarMind AI**), my data science skills, or my sports background. What would you like to know?`;
    }
    
    // Arm Wrestling / Hobbies / Gym
    if (q.includes("arm") || q.includes("wrestling") || q.includes("gym") || q.includes("trainer") || q.includes("champion") || q.includes("sports") || q.includes("hobby") || q.includes("kabaddi") || q.includes("cricket")) {
      const armWrestling = this.data.achievements.find(a => a.title.includes("Arm Wrestling"))?.description || "";
      const gym = this.data.achievements.find(a => a.title.includes("Gym"))?.description || "";
      return `💪 **Sports & Hobbies Background:**
      
* **Arm Wrestling:** I am a **Three-time Maharashtra State Champion** and a **National Level Champion** in Arm Wrestling! This sport has taught me extreme discipline, persistence, and focus.
* **Gym Trainer:** I worked as a fitness gym trainer, mentoring individuals in strength training, biomechanics, and diet targets.
* **Other Sports:** I hold state/district certificates in Cricket and Kabaddi, and I've compered cultural events.
* **Hobbies:** In my free time, I enjoy playing Cricket, Arm Wrestling practice, and exploring fitness.`;
    }

    // Projects overview
    if (q.includes("project") || q.includes("portfolio") || q.includes("work") || q.includes("build") || q.includes("developed")) {
      // Check for specific projects first
      if (q.includes("nexus") || q.includes("ast") || q.includes("rag")) {
        return this.getProjectResponse("nexusast");
      }
      if (q.includes("solar") || q.includes("mind") || q.includes("forecast") || q.includes("yield")) {
        return this.getProjectResponse("solarmind-ai");
      }
      if (q.includes("omni") || q.includes("customer") || q.includes("tenant") || q.includes("rbac")) {
        return this.getProjectResponse("omniagent");
      }
      if (q.includes("city") || q.includes("metro") || q.includes("traffic") || q.includes("shield")) {
        return this.getProjectResponse("smartcity");
      }
      if (q.includes("loss") || q.includes("drrt") || q.includes("calculator") || q.includes("securities")) {
        return this.getProjectResponse("drrt-calculator");
      }
      if (q.includes("crop") || q.includes("recommend") || q.includes("agriculture")) {
        return this.getProjectResponse("crop-rec");
      }
      if (q.includes("fitness") || q.includes("assistant") || q.includes("nutrition")) {
        return this.getProjectResponse("ai-fitness");
      }
      if (q.includes("sales") || q.includes("dashboard") || q.includes("power bi") || q.includes("dax")) {
        return this.getProjectResponse("sales-dashboard");
      }

      // Return list of all projects
      let resp = `I have built several core projects in **Generative AI**, **Machine Learning**, **BI Visualization**, and **Automation**. Here are some key ones:
      
`;
      this.data.projects.forEach(prj => {
        resp += `* **${prj.title}** (${prj.category}): ${prj.summary}\n`;
      });
      resp += `\nType the name of any project (e.g. *NexusAST*, *SolarMind*) to see detailed stack and features!`;
      return resp;
    }

    // Specific projects queried directly
    if (q.includes("nexusast") || q.includes("nexus")) {
      return this.getProjectResponse("nexusast");
    }
    if (q.includes("solarmind") || q.includes("solar")) {
      return this.getProjectResponse("solarmind-ai");
    }
    if (q.includes("omniagent") || q.includes("omni")) {
      return this.getProjectResponse("omniagent");
    }
    if (q.includes("smartcity") || q.includes("smart city") || q.includes("command center")) {
      return this.getProjectResponse("smartcity");
    }
    if (q.includes("drrt") || q.includes("loss calculator")) {
      return this.getProjectResponse("drrt-calculator");
    }
    if (q.includes("crop")) {
      return this.getProjectResponse("crop-rec");
    }
    if (q.includes("fitness")) {
      return this.getProjectResponse("ai-fitness");
    }
    if (q.includes("sales") || q.includes("power bi") || q.includes("dax")) {
      return this.getProjectResponse("sales-dashboard");
    }

    // Skills
    if (q.includes("skill") || q.includes("technologies") || q.includes("know") || q.includes("languages") || q.includes("python") || q.includes("sql") || q.includes("framework")) {
      let resp = `💻 **My Technical Skills Grid:**\n\n`;
      this.data.skills.forEach(cat => {
        resp += `**${cat.category}:**\n`;
        cat.items.forEach(item => {
          resp += `- ${item.name} (${item.level}% proficiency)\n`;
        });
        resp += `\n`;
      });
      return resp;
    }

    // Contact details
    if (q.includes("contact") || q.includes("email") || q.includes("phone") || q.includes("hire") || q.includes("call") || q.includes("message") || q.includes("linkedin") || q.includes("github")) {
      return `📞 **How to reach Harsh Singh:**
      
* **Email:** [${p.email}](mailto:${p.email})
* **Phone:** ${p.phone}
* **LinkedIn:** [linkedin.com/in/harshhirasingh](${p.linkedin})
* **GitHub:** [github.com/Harshsingh2598](${p.github})
* **Location:** ${p.location}
      
Feel free to use the contact form on this website to drop a message, or write directly to my email!`;
    }

    // Education / College / Degree / University
    if (q.includes("education") || q.includes("college") || q.includes("degree") || q.includes("study") || q.includes("academic") || q.includes("imarticus") || q.includes("nkt") || q.includes("bsc") || q.includes("school")) {
      let resp = `🎓 **Education & Academic Background:**\n\n`;
      this.data.timeline.forEach(item => {
        resp += `* **${item.title}** | *${item.institution}* (${item.date})\n  ${item.details}\n\n`;
      });
      return resp;
    }

    // Research paper
    if (q.includes("research") || q.includes("paper") || q.includes("publish") || q.includes("co-author") || q.includes("journal")) {
      const paper = this.data.achievements.find(a => a.title.includes("Research"))?.description || "";
      return `📄 **Published Research Paper:**
      
During my B.Sc. studies at NKT College, I co-authored a research paper with my college professor. It covers artificial neural networks and data analysis, and has been successfully published in an academic journal. 

This academic foundation fuels my current work in LLMs, prompt engineering, and deep learning structures!`;
    }

    // Fallback search response
    return `I detected your question might be about Harsh's profile, but I didn't find specific matches. 
    
Harsh is an **AI Engineer & Data Scientist** specializing in LLM applications, RAG pipelines (NexusAST), solar telemetry forecasting (SolarMind AI), multi-tenant agent nodes (OmniAgent), and Power BI business intelligence.
    
**Quick Details:**
- **Skills:** Python, SQL, Generative AI, RAG, LangChain, PyTorch, Power BI.
- **Academics:** B.Sc. Data Science & PG Certificate from Imarticus.
- **Athletics:** 3x Maharashtra State & National Arm Wrestling Champion!
- **Email:** [${p.email}](mailto:${p.email}) | **Phone:** ${p.phone}

*Tip: Try entering your Gemini API Key in the settings panel (gear icon at the top right) to activate true conversational intelligence!*`;
  }

  // Helper to format a single project's offline detail card
  getProjectResponse(id) {
    const prj = this.data.projects.find(p => p.id === id);
    if (!prj) return `Project not found.`;
    
    return `📁 **Project Showcase: ${prj.title}**
*${prj.tagline}*
_${prj.summary}_

**Project Details:**
${prj.description}

**Tech Stack:**
${prj.stack.map(s => `\`${s}\``).join(" | ")}

**Key Highlights:**
${prj.highlights.map(h => `* ${h}`).join("\n")}

${prj.github ? `[View GitHub Repo](${prj.github})` : ""} ${prj.live ? `| [Live Demo](${prj.live})` : ""}`;
  }

  // Respond using LLM Live Mode (Gemini API)
  async respondLLM(query) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
    
    // Add current user message to tracking
    this.chatHistory.push({
      role: "user",
      parts: [{ text: query }]
    });

    // Build payload including system context
    const systemPrompt = this.getSystemPrompt();
    
    // Format full messages stream
    const contents = [
      {
        role: "user",
        parts: [{ text: `${systemPrompt}\n\nUser Question: Hello!` }]
      },
      {
        role: "model",
        parts: [{ text: `Hello! I am Harsh's AI Agent clone. I'm ready to answer any questions about my technical skills, data science background, projects like NexusAST, or my national arm wrestling championship. What would you like to discuss?` }]
      }
    ];

    // Append history
    this.chatHistory.forEach(msg => contents.push(msg));

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 800
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API Error: Status ${response.status}`);
      }

      const data = await response.json();
      const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I encountered an issue processing my model output.";
      
      // Add response to tracking
      this.chatHistory.push({
        role: "model",
        parts: [{ text: botReply }]
      });

      // Keep history bounded to last 10 turns
      if (this.chatHistory.length > 20) {
        this.chatHistory = this.chatHistory.slice(this.chatHistory.length - 20);
      }

      return botReply;
    } catch (error) {
      console.error("Gemini API Request Failed: ", error);
      return `❌ **LLM Connection Error:** I couldn't reach the Gemini API. Please check your internet connection or verify that your API Key is valid in the settings panel. 
      
*Falling back to local offline mode response:*
\n\n` + this.respondOffline(query);
    }
  }

  // Core answer route
  async ask(query) {
    if (this.isLLMActive()) {
      return await this.respondLLM(query);
    } else {
      // Simulate delay for a natural feel
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.respondOffline(query));
        }, 600);
      });
    }
  }
}
