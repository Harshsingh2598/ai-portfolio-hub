# 🌌 AuraPort: AI-Powered Intelligent Portfolio

A premium, retro-futuristic space-cyberpunk portfolio dashboard designed to showcase projects, skills, and timeline details dynamically. It features an embedded **AI Portfolio Assistant** that simulates a natural conversational replica of Harsh Singh.

👉 **Live Demo Hub / Local Preview**: `http://localhost:3000` (or double-click `index.html` to load)

---

## ⚡ Key Features

*   **👾 Cyberpunk Glassmorphic Canvas**: Built using high-performance CSS3 variables, `@keyframes` neon glow pulses, and responsive CSS grids for an immersive retro-futuristic dark theme.
*   **🤖 Conversational AI Assistant replica**:
    *   **Offline Mode**: Client-side query matching that answers questions regarding Harsh's skills, credentials, hobbies, and projects (e.g., *"What is NexusAST?"*, *"How can I contact you?"*).
    *   **LLM Live Mode**: Integrates Google Gemini API using local storage API key persistence, turning the assistant panel into a fully context-aware conversational agent.
*   **📁 Project Details Hub**: Includes search bars, tag filters, and modal overlays displaying highlights and tech stacks for **8 featured projects** (like **NexusAST**, **SolarMind AI**, **OmniAgent**, and **SmartCity Command Center**).
*   **📊 Dynamic Skills Matrix**: Categorized and animated proficiency meters that animate on viewport intersection.
*   **🎛️ Dynamic Config System (`portfolio-data.js`)**: Content is fully separated from layout code. Simply modify the JS object in this file to update the entire website and the AI database!

---

## 🛠️ File Structure

```
├── index.html          # HTML5 layout, modals, chat sidebar structures
├── style.css           # Custom stylesheets (glassmorphic filters, neon systems)
├── portfolio-data.js   # Content source configuration (Skills, Bio, Projects, Socials)
├── ai-agent.js         # Double-mode AI agent query matching & Gemini API integration
├── app.js              # DOM loading, event binds, search filters, modal toggles
└── README.md           # Project summary and documentation
```

---

## 💻 Customization & Setup

### 1. Edit Your Details
Open [portfolio-data.js](file:///portfolio-data.js) and customize the `window.portfolioData` object to update:
- Personal details (name, tagline, bio, contact credentials).
- Custom HSL theme variables (hue accents).
- List of skills categorized with proficiency ratings.
- Projects list including titles, tech stacks, summaries, and bullet highlights.
- Timeline items (jobs, certification, college credentials).
- Personal achievements and accolades.

### 2. Run Locally
Double-click `index.html` in your file explorer, or start a local server:
```bash
# Using Python
python -m http.server 3000

# Using Node (npm)
npx serve
```
Open **`http://localhost:3000`** in your browser.

---

## 🚀 One-Click Deployments

### Deploying to GitHub Pages
1. Create a new repository on GitHub named `ai-portfolio-hub`.
2. Link your local repository and push:
   ```bash
   git remote add origin https://github.com/<your-username>/ai-portfolio-hub.git
   git push -u origin main
   ```
3. In your GitHub repository settings, navigate to **Pages**, select the `main` branch as the source, and click **Save**. Your site will be online in seconds!

### Deploying to Vercel
1. Install the Vercel CLI: `npm install -g vercel`
2. Run `vercel` in the project root folder. Follow the prompt instructions to deploy.
