// AuraOS - Physics-based Node Graph Canvas (canvas-graph.js)

class NodeGraph {
  constructor(canvasId, portfolioData, onNodeDoubleClick) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.data = portfolioData;
    this.onNodeDoubleClick = onNodeDoubleClick;

    this.nodes = [];
    this.links = [];
    this.particles = [];
    
    this.mouse = { x: 0, y: 0, isDown: false, hovered: null, dragged: null };
    
    this.initGraph();
    this.resize();
    this.bindEvents();
    this.startLoop();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height || 450;
    
    // Reposition root node to center
    const root = this.nodes.find(n => n.id === "root");
    if (root) {
      root.x = this.canvas.width / 2;
      root.y = this.canvas.height / 2;
      root.fx = root.x;
      root.fy = root.y;
    }
  }

  initGraph() {
    // 1. Create Root Node
    this.nodes.push({
      id: "root",
      label: this.data.profile.name,
      type: "root",
      x: 300, y: 220,
      vx: 0, vy: 0,
      r: 45,
      color: "hsl(260, 85%, 65%)",
      glowColor: "rgba(144, 94, 255, 0.4)"
    });

    // 2. Create Skill Categories
    const categories = [
      { id: "genai", label: "Generative AI", hue: 260 },
      { id: "ml", label: "Machine Learning", hue: 180 },
      { id: "viz", label: "Data Viz", hue: 280 },
      { id: "auto", label: "Automation", hue: 200 }
    ];

    categories.forEach((cat, idx) => {
      const angle = (idx / categories.length) * Math.PI * 2;
      const dist = 120;
      const x = 300 + Math.cos(angle) * dist;
      const y = 220 + Math.sin(angle) * dist;

      this.nodes.push({
        id: cat.id,
        label: cat.label,
        type: "category",
        x: x, y: y,
        vx: 0, vy: 0,
        r: 32,
        color: `hsl(${cat.hue}, 85%, 55%)`,
        glowColor: `hsla(${cat.hue}, 85%, 55%, 0.3)`
      });

      // Link to root
      this.links.push({ source: "root", target: cat.id, length: 130 });
    });

    // 3. Create Project Nodes
    this.data.projects.forEach((prj, idx) => {
      let parentCatId = "ml";
      let hue = 180;
      
      if (prj.category === "Generative AI") { parentCatId = "genai"; hue = 260; }
      else if (prj.category === "Data Visualization") { parentCatId = "viz"; hue = 280; }
      else if (prj.category === "Automation") { parentCatId = "auto"; hue = 200; }

      const angle = Math.random() * Math.PI * 2;
      const dist = 220;
      const x = 300 + Math.cos(angle) * dist;
      const y = 220 + Math.sin(angle) * dist;

      this.nodes.push({
        id: prj.id,
        label: prj.title.split(":")[0], // Short name
        type: "project",
        x: x, y: y,
        vx: 0, vy: 0,
        r: 24,
        color: "#16132d",
        borderColor: `hsl(${hue}, 85%, 55%)`,
        glowColor: `hsla(${hue}, 85%, 55%, 0.25)`
      });

      // Link to category parent
      this.links.push({ source: parentCatId, target: prj.id, length: 100 });
    });

    // Add some random floating background particles
    for (let i = 0; i < 40; i++) {
      this.particles.push({
        x: Math.random() * 800,
        y: Math.random() * 500,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1
      });
    }
  }

  // Bind mouse interactions
  bindEvents() {
    window.addEventListener("resize", () => this.resize());

    const getMousePos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    this.canvas.addEventListener("mousemove", (e) => {
      const pos = getMousePos(e);
      this.mouse.x = pos.x;
      this.mouse.y = pos.y;

      if (this.mouse.dragged) {
        this.mouse.dragged.x = pos.x;
        this.mouse.dragged.y = pos.y;
        this.mouse.dragged.fx = pos.x;
        this.mouse.dragged.fy = pos.y;
        return;
      }

      // Find hover node
      let found = null;
      for (let node of this.nodes) {
        const dist = Math.hypot(node.x - pos.x, node.y - pos.y);
        if (dist < node.r + 5) {
          found = node;
          break;
        }
      }
      this.mouse.hovered = found;
      this.canvas.style.cursor = found ? "pointer" : "default";
    });

    this.canvas.addEventListener("mousedown", () => {
      this.mouse.isDown = true;
      if (this.mouse.hovered) {
        this.mouse.dragged = this.mouse.hovered;
        // Fix root or category nodes
        if (this.mouse.dragged.type === "root") {
          this.mouse.dragged.fx = this.mouse.dragged.x;
          this.mouse.dragged.fy = this.mouse.dragged.y;
        }
      }
    });

    this.canvas.addEventListener("mouseup", () => {
      this.mouse.isDown = false;
      if (this.mouse.dragged) {
        if (this.mouse.dragged.type !== "root") {
          delete this.mouse.dragged.fx;
          delete this.mouse.dragged.fy;
        }
        this.mouse.dragged = null;
      }
    });

    this.canvas.addEventListener("dblclick", () => {
      if (this.mouse.hovered && this.mouse.hovered.type === "project") {
        this.onNodeDoubleClick(this.mouse.hovered.id);
      }
    });
  }

  // Core physics iteration loop
  update() {
    const k = 0.04; // Spring stiffness
    const repulseStrength = 1800; // Repulsion constant
    const damping = 0.88; // Friction factor

    // 1. Repulsion between all nodes (Electrostatic force)
    for (let i = 0; i < this.nodes.length; i++) {
      const n1 = this.nodes[i];
      for (let j = i + 1; j < this.nodes.length; j++) {
        const n2 = this.nodes[j];
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dist = Math.hypot(dx, dy) || 1;
        
        // Force drops off with distance
        const force = repulseStrength / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (!n1.fx) { n1.vx -= fx; n1.vy -= fy; }
        if (!n2.fx) { n2.vx += fx; n2.vy += fy; }
      }
    }

    // 2. Attraction along link connection springs (Hooke's Law)
    this.links.forEach(link => {
      const sourceNode = this.nodes.find(n => n.id === link.source);
      const targetNode = this.nodes.find(n => n.id === link.target);
      if (!sourceNode || !targetNode) return;

      const dx = targetNode.x - sourceNode.x;
      const dy = targetNode.y - sourceNode.y;
      const dist = Math.hypot(dx, dy) || 1;
      
      const stretch = dist - link.length;
      const forceX = dx * k * stretch / dist;
      const forceY = dy * k * stretch / dist;

      if (!sourceNode.fx) { sourceNode.vx += forceX; sourceNode.vy += forceY; }
      if (!targetNode.fx) { targetNode.vx -= forceX; targetNode.vy -= forceY; }
    });

    // 3. Keep root node centered
    const root = this.nodes.find(n => n.id === "root");
    if (root) {
      root.x = this.canvas.width / 2;
      root.y = this.canvas.height / 2;
      root.fx = root.x;
      root.fy = root.y;
    }

    // 4. Apply velocities & boundary boxes
    this.nodes.forEach(node => {
      if (node.fx !== undefined) {
        node.x = node.fx;
        node.y = node.fy;
        node.vx = 0;
        node.vy = 0;
        return;
      }

      node.vx *= damping;
      node.vy *= damping;
      node.x += node.vx;
      node.y += node.vy;

      // Keep within canvas limits
      const buffer = node.r + 10;
      if (node.x < buffer) { node.x = buffer; node.vx *= -0.5; }
      if (node.x > this.canvas.width - buffer) { node.x = this.canvas.width - buffer; node.vx *= -0.5; }
      if (node.y < buffer) { node.y = buffer; node.vy *= -0.5; }
      if (node.y > this.canvas.height - buffer) { node.y = this.canvas.height - buffer; node.vy *= -0.5; }
    });

    // 5. Update Background Particles
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;
    });

    // 6. Spawn and update link flow particles
    if (Math.random() < 0.08) {
      const link = this.links[Math.floor(Math.random() * this.links.length)];
      this.flowParticle(link.source, link.target);
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      if (p.progress !== undefined) {
        p.progress += 0.015; // flow velocity
        if (p.progress >= 1) {
          this.particles.splice(i, 1);
        }
      }
    }
  }

  // Trigger glowing node pulses
  flowParticle(sourceId, targetId) {
    const s = this.nodes.find(n => n.id === sourceId);
    const t = this.nodes.find(n => n.id === targetId);
    if (!s || !t) return;

    this.particles.push({
      source: s,
      target: t,
      progress: 0,
      color: t.borderColor || t.color
    });
  }

  // Core render loop
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Draw grid backdrop lines (Cyberpunk radar layout)
    this.ctx.strokeStyle = "rgba(144, 94, 255, 0.02)";
    this.ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < this.canvas.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.canvas.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }

    // 2. Draw Background floating stars
    this.particles.forEach(p => {
      if (p.progress === undefined) {
        this.ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });

    // 3. Draw Links (Spring wires)
    this.ctx.lineWidth = 1.5;
    this.links.forEach(link => {
      const s = this.nodes.find(n => n.id === link.source);
      const t = this.nodes.find(n => n.id === link.target);
      if (!s || !t) return;

      const grad = this.ctx.createLinearGradient(s.x, s.y, t.x, t.y);
      grad.addColorStop(0, "rgba(144, 94, 255, 0.2)");
      grad.addColorStop(1, "rgba(0, 242, 254, 0.25)");

      this.ctx.strokeStyle = grad;
      this.ctx.beginPath();
      this.ctx.moveTo(s.x, s.y);
      this.ctx.lineTo(t.x, t.y);
      this.ctx.stroke();
    });

    // 4. Draw flow particles travelling down springs
    this.particles.forEach(p => {
      if (p.progress !== undefined) {
        const dx = p.target.x - p.source.x;
        const dy = p.target.y - p.source.y;
        const x = p.source.x + dx * p.progress;
        const y = p.source.y + dy * p.progress;

        this.ctx.fillStyle = p.color || "var(--secondary)";
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = p.color || "var(--secondary)";
        this.ctx.beginPath();
        this.ctx.arc(x, y, 3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0; // reset
      }
    });

    // 5. Draw Nodes
    this.nodes.forEach(node => {
      const isHovered = this.mouse.hovered === node;
      const isDragged = this.mouse.dragged === node;

      // Draw Node Outer Glow Ring
      if (isHovered || isDragged || node.type === "root") {
        this.ctx.shadowBlur = isHovered ? 20 : 12;
        this.ctx.shadowColor = node.glowColor;
      }

      this.ctx.fillStyle = node.color;
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      this.ctx.fill();

      // Outer border outline
      this.ctx.shadowBlur = 0; // reset
      this.ctx.strokeStyle = node.borderColor || "rgba(255, 255, 255, 0.08)";
      this.ctx.lineWidth = node.type === "root" ? 3 : 2;
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      this.ctx.stroke();

      // Node Label Text
      this.ctx.fillStyle = isHovered ? "#fff" : "var(--text-main)";
      this.ctx.font = `bold ${node.type === 'root' ? 14 : 11}px var(--font-heading)`;
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";

      // Multi-line wrap labels if they are too long
      const text = node.label;
      if (text.includes(" ") && node.r > 30) {
        const words = text.split(" ");
        this.ctx.fillText(words[0], node.x, node.y - 7);
        this.ctx.fillText(words[1], node.x, node.y + 7);
      } else {
        this.ctx.fillText(text, node.x, node.y);
      }

      // Project hint text
      if (node.type === "project" && isHovered) {
        this.ctx.fillStyle = "var(--secondary-light)";
        this.ctx.font = "italic 9px var(--font-body)";
        this.ctx.fillText("Double Click", node.x, node.y + 12);
      }
    });
  }

  // Animation recursion loops
  startLoop() {
    const loop = () => {
      this.update();
      this.draw();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}
