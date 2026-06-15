// AuraPort - Portfolio Data Configuration
// Edit this file to update your portfolio details. It will automatically update the website and AI assistant.

window.portfolioData = {
  profile: {
    name: "Harsh Singh",
    title: "AI / ML Developer & Data Scientist",
    subtitle: "NLP & Deep Learning Engineer | Generative AI Specialist",
    tagline: "Building intelligent systems powered by AI, data, and automation.",
    bio: "Data Science graduate with a Post-Graduate Certification in Data Science and Analytics from Imarticus Learning. Experienced in developing end-to-end Machine Learning workflows, Deep Learning models (ANN, CNN, RNN), Natural Language Processing systems, and AI-powered agents (LLMs, LangChain, RAG, ChromaDB). Co-authored a published research paper and co-developed advanced applications like relational code RAG codebases and grid telemetry dashboards. Outside of tech, I am a three-time Maharashtra State Champion and National Level Champion in Arm Wrestling, applying the same discipline, focus, and drive to engineering intelligent systems.",
    email: "harshsingh359800@gmail.com",
    phone: "+91 8424940083",
    linkedin: "https://linkedin.com/in/harshhirasingh",
    github: "https://github.com/Harshsingh2598",
    location: "Thane, Maharashtra, India",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=500&h=500&q=80", // Standard professional placeholder
    resumeUrl: "#" // Link to resume if needed
  },
  
  // Custom HSL theme variables
  theme: {
    hue: 260, // Purple-centered hue
    saturation: "85%",
    primaryGlow: "hsla(260, 85%, 60%, 0.15)",
    secondaryGlow: "hsla(180, 85%, 50%, 0.15)"
  },

  skills: [
    {
      category: "Generative AI & LLMs",
      icon: "fa-brain",
      items: [
        { name: "Large Language Models (LLMs)", level: 90 },
        { name: "Retrieval-Augmented Generation (RAG)", level: 92 },
        { name: "LangChain & LangGraph Agents", level: 88 },
        { name: "Vector Databases (FAISS, ChromaDB)", level: 85 },
        { name: "Prompt Engineering", level: 95 }
      ]
    },
    {
      category: "Machine Learning & Stats",
      icon: "fa-calculator",
      items: [
        { name: "Supervised & Unsupervised ML", level: 90 },
        { name: "Deep Learning (ANN, CNN, RNN)", level: 85 },
        { name: "PyTorch & TensorFlow", level: 82 },
        { name: "Statistical Hypothesis Testing", level: 88 },
        { name: "Exploratory Data Analysis (EDA)", level: 92 }
      ]
    },
    {
      category: "Programming & Databases",
      icon: "fa-code",
      items: [
        { name: "Python", level: 92 },
        { name: "SQL (Window Functions, Joins)", level: 90 },
        { name: "Java / C++ / R", level: 75 },
        { name: "FastAPI / Streamlit / HTML / CSS / JS", level: 88 }
      ]
    },
    {
      category: "Data Visualization & Automation",
      icon: "fa-chart-pie",
      items: [
        { name: "Power BI (DAX & Power Query)", level: 90 },
        { name: "Tableau", level: 85 },
        { name: "UiPath Automation", level: 80 },
        { name: "Microsoft Power Automate", level: 78 }
      ]
    }
  ],

  projects: [
    {
      id: "nexusast",
      title: "NexusAST: Relational & Semantic Code RAG",
      tagline: "Structure-Aware Code Navigation & Chat Agent",
      summary: "A Code-Aware Retrieval-Augmented Generation (RAG) system that parses codebases into Hierarchical Abstract Syntax Trees (AST) and maps relationship flows in a visual physics graph.",
      description: "Unlike traditional RAG systems that chunk code blindly by character boundaries, NexusAST parses target Python folders using Python's built-in `ast` module. It extracts classes, methods, argument signatures, docstrings, and control flow call links, persisting metadata in SQLite and semantic chunks in ChromaDB. The system utilizes a LangGraph ReAct agent coordinating search tools to resolve code dependencies before answering natural language queries. It also features a stunning physics-based call-graph frontend dashboard with glowing node particle flows.",
      stack: ["Python", "FastAPI", "SQLite", "ChromaDB", "LangGraph", "Vite", "React", "D3.js / Canvas"],
      category: "Generative AI",
      github: "https://github.com/Harshsingh2598/NexusAST",
      live: "",
      highlights: [
        "Hierarchical AST parsing preserving semantic scope boundaries.",
        "SQLite relational database mapping call flows (caller-callee outlines).",
        "LangGraph ReAct agent orchestrating code search tools.",
        "Interactive canvas call-graph showing physics-based glowing nodes and particle flows."
      ]
    },
    {
      id: "solarmind-ai",
      title: "SolarMind AI: Grid Dashboard",
      tagline: "Retro-Futuristic Solar Yield Forecaster & Telemetry Grid",
      summary: "A premium, cyberpunk-themed solar power forecasting and grid monitoring platform featuring real-time AI simulations, charts, and voice recognition.",
      description: "SolarMind AI is a high-performance web dashboard displaying simulated real-time power generation, panel health diagnostics, and carbon offsets. It embeds a client-side Random Forest regression engine allowing users to adjust sliders (Solar Irradiance, Temperature, Cloud Cover) and immediately predict yield. Data is visualized through neon-gradient Chart.js plots. It includes native Web Speech API integration for spoken voice commands, alert synths, and html2canvas PDF exports.",
      stack: ["HTML5", "Vanilla CSS3", "Vanilla JavaScript", "Chart.js", "Web Speech API", "Canvas API", "Node.js"],
      category: "Machine Learning",
      github: "https://github.com/Harshsingh2598/solarmind-ai",
      live: "",
      highlights: [
        "Zero-framework vanilla implementation for instant responsiveness.",
        "Real-time regression forecast engine integrated with sliders.",
        "Advanced Chart.js visualizers with custom neon glow filters.",
        "Voice commands with spoken synthesis responses (Web Speech API)."
      ]
    },
    {
      id: "omniagent",
      title: "OmniAgent: Customer Operations Hub",
      tagline: "Multi-Tenant Agent Network & Security Audit console",
      summary: "A multi-tenant customer operations agent workspace with dynamic Role-Based Access Control (RBAC), database playgrounds, and audit logs.",
      description: "OmniAgent provides a command console for customer operations agents. It implements strict multi-tenant tenant isolation and RBAC console permissions (Agent vs Admin). Features include live interactive chat session workflows, database playgrounds, dynamic analytics counters, and custom SVG line drawings connecting agent pipelines. Admins can view complete system audit logs detailing exact database queries and tenant changes.",
      stack: ["JavaScript (ES6)", "FastAPI", "SQLite", "SVG Canvas", "CSS Grid", "HTML5"],
      category: "Automation",
      github: "",
      live: "",
      highlights: [
        "Strict client-side multi-tenant configuration simulations.",
        "Interactive SVG connectors drawing relational nodes and pipelines dynamically.",
        "Complete admin audit trail logging dashboard.",
        "Security-scoped dashboard modules adapting based on role role mappings."
      ]
    },
    {
      id: "smartcity",
      title: "SmartCity AI Command Center",
      tagline: "Metro-Shield Traffic & Pollution Simulator Dashboard",
      summary: "A modern React & TypeScript dashboard mimicking a centralized smart city control center, displaying simulated traffic, pollution, and energy stats.",
      description: "This command center simulates smart city telemetry feeds. It features a Stitch-like directory tool shelf, custom page routes for independent city networks (Traffic flow, Pollution density, Energy grids, Emergency alerts), and an interactive bottom floating prompt bar where users can query virtual AI agents. Visually polished with high-contrast layouts, emergency flashers, and responsive charts.",
      stack: ["React", "TypeScript", "Vite", "React Router", "ApexCharts", "CSS Variables"],
      category: "Data Visualization",
      github: "",
      live: "",
      highlights: [
        "Structured React & TypeScript component layout.",
        "Integrated multi-page router simulating distinct monitoring nodes.",
        "Emergency command trigger module simulating critical system alerts.",
        "Floating command bar prompt console."
      ]
    },
    {
      id: "drrt-calculator",
      title: "DRRT Securities Loss Calculator",
      tagline: "Chronological FIFO Securities Litigation Loss Estimator",
      summary: "An automated financial calculator that processes class action transactions and estimates client losses based on judicial Plans of Allocation.",
      description: "Developed as part of a technical AI developer assessment, this backend pipeline ingests client trade sheets and calculates recognized losses for Kraft Heinz and Twitter settlements. It implements the First-In, First-Out (FIFO) chronological matching logic, calculates 90-day lookback averages, applies inflation declines, and generates detailed Excel/PDF audit reports summarizing client recognized losses.",
      stack: ["Python", "Pandas", "NumPy", "OpenPyXL", "Markdown Reports"],
      category: "Machine Learning",
      github: "",
      live: "",
      highlights: [
        "FIFO transaction matcher sorting beginning holdings, class buys, and sales.",
        "Automated lookback period average caps according to litigation parameters.",
        "Aggregates calculations across dozens of funds and clients accurately.",
        "Generates clean Markdown audit summaries and transaction breakdowns."
      ]
    },
    {
      id: "crop-rec",
      title: "Crop Recommendation System",
      tagline: "Machine Learning Agricultural Predictor",
      summary: "An intelligent crop classifier using Random Forest to recommend suitable crops based on soil nutrients and climatic features.",
      description: "A machine learning system designed to optimize agricultural output. It reads parameters such as Nitrogen (N), Phosphorus (P), Potassium (K), Temperature, Humidity, pH, and Rainfall. After testing multiple classifiers (Logistic Regression, KNN, Naive Bayes, SVM), a Random Forest model was selected and fine-tuned (using GridSearchCV) to achieve high predictive accuracy. Deployed as a web app using Streamlit.",
      stack: ["Python", "Scikit-Learn", "Pandas", "NumPy", "Streamlit", "Matplotlib"],
      category: "Machine Learning",
      github: "https://github.com/Harshsingh2598",
      live: "",
      highlights: [
        "Compared 5+ ML algorithms on tabular soil datasets.",
        "Achieved over 98% prediction accuracy on test splits.",
        "Streamlit web interface for simple real-time farm diagnostics.",
        "Interactive correlation heatmaps and feature importance visualizations."
      ]
    },
    {
      id: "ai-fitness",
      title: "AI Fitness Assistant",
      tagline: "Personalized Workout & Diet Recommendation System",
      summary: "An AI platform providing customized workout and nutrition plans, progress trackers, and caloric analytics.",
      description: "Built to digitize trainer expertise, this system calculates BMR, TDEE, and macro targets based on user metrics (weight, height, age, activity level, fitness goals). It recommends workout regimes and diet templates using custom logic, visualizing progress on interactive charts.",
      stack: ["Python", "Pandas", "Streamlit", "Matplotlib", "Seaborn"],
      category: "Automation",
      github: "",
      live: "",
      highlights: [
        "Calorie and macronutrient target estimators based on exercise goals.",
        "Auto-generated workout schedules for beginners and advanced lifters.",
        "Visual telemetry logs showing bodyweight trends and calorie intake.",
        "Streamlit UI with clean visual cards and PDF plan export."
      ]
    },
    {
      id: "sales-dashboard",
      title: "Super Sales Power BI Dashboard",
      tagline: "Interactive Business Intelligence KPI Tracker",
      summary: "A business intelligence dashboard showcasing interactive sales performance, profitability margins, and customer analytics.",
      description: "An end-to-end BI project starting from raw transaction cleaning in Power Query, building dimensional schemas, and scripting advanced DAX measures (YTD, YoY, profit margins). Features dynamic slicers, drill-down tables, and KPI cards to support executive decisions.",
      stack: ["Power BI", "DAX", "Power Query", "Excel", "Data Modeling"],
      category: "Data Visualization",
      github: "",
      live: "",
      highlights: [
        "Created calculated fields and measures using advanced DAX.",
        "Designed star-schema relationships between customers, sales, and products.",
        "Drill-down maps visualizing sales revenue by geographical regions.",
        "Automated monthly dashboard refresh pipelines."
      ]
    }
  ],

  timeline: [
    {
      date: "2023 – 2024",
      title: "Certified Data Scientist Professional",
      institution: "Imarticus Learning, Thane",
      details: "Completed intensive post-graduate certification covering advanced Data Science with Python, Machine Learning models, SQL database administration, Tableau, and Power BI dashboards. Practiced statistical analysis and hypothesis tests."
    },
    {
      date: "2022 – 2025",
      title: "Bachelor of Science — Data Science",
      institution: "NKT College, Thane",
      details: "B.Sc. Data Science degree, graduating with a CGPA of 6.0. Studied foundational algorithms, programming frameworks, and data pipeline designs. Co-authored a published research paper on neural network approaches with a professor."
    },
    {
      date: "2022",
      title: "Higher Secondary Certificate (XII)",
      institution: "Satish Pradhan Dnyanasadhana College, Thane",
      details: "Completed board examinations scoring 55% in the science stream."
    },
    {
      date: "2020",
      title: "Secondary School Certificate (X)",
      institution: "Smt. Sulochanadevi Singhania School, Thane",
      details: "Completed ICSE board education scoring 65%."
    }
  ],

  achievements: [
    {
      title: "National Arm Wrestling Champion",
      icon: "fa-trophy",
      description: "Three-time Maharashtra State Champion and National Level Champion in Arm Wrestling. Achieved championship rank representing Maharashtra, demonstrating extreme physical discipline and competitive drive."
    },
    {
      title: "Published Research Co-Author",
      icon: "fa-file-alt",
      description: "Co-authored a research paper with a college professor during B.Sc. studies, focused on artificial intelligence methodologies and data analysis, successfully published in an academic journal."
    },
    {
      title: "Gym Trainer & Mentor",
      icon: "fa-dumbbell",
      description: "Worked as a Gym Trainer for several years, mentoring individuals on biomechanics, target nutrition plans, and habit discipline, combining physical health with leadership skills."
    },
    {
      title: "State Level Cricket & Kabaddi",
      icon: "fa-medal",
      description: "Represented school and college teams in state/district level sports tournaments, securing certificates in Cricket and Kabaddi. Frequently compered school-level cultural events."
    }
  ]
};
