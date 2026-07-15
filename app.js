// ======================================
// STUDIO ATLAS — V1
// Bloc A : Initialisation
// ======================================

// ---------- Canvas ----------

const svg = d3.select("#atlas");

const width = window.innerWidth;
const height = window.innerHeight;

svg
  .attr("viewBox", `0 0 ${width} ${height}`)
  .attr("preserveAspectRatio", "xMidYMid meet");

// ---------- Groupe principal ----------

const scene = svg.append("g").attr("class", "scene");

// ---------- Zoom ----------

const zoom = d3.zoom()
  .scaleExtent([0.6, 3])
  .on("zoom", (event) => {
    scene.attr("transform", event.transform);
  });

svg.call(zoom);

// ---------- Constantes graphiques ----------

const MARGIN_X = 180;
const MARGIN_Y = height / 2;

const COLORS = {
  river: "#4B7BFF",
  island: "#FFFFFF",
  label: "#D8D8D8",
  phase: "#1A1A1A"
};

// ---------- Groupes de dessin ----------

const phaseLayer = scene.append("g").attr("id", "phases");

const riverLayer = scene.append("g").attr("id", "river");

const islandLayer = scene.append("g").attr("id", "islands");

const labelLayer = scene.append("g").attr("id", "labels");

// ---------- Chargement des données ----------

async function loadWorkflow() {

  const response = await fetch("/api/workflow");

  const workflow = await response.json();

  workflow.sort((a, b) => a.order - b.order);

  prepareData(workflow);

}

loadWorkflow();

// ---------- Préparation ----------

function prepareData(data) {

  // position horizontale

  const scale = d3.scaleLinear()
    .domain([0, data.length - 1])
    .range([MARGIN_X, width - MARGIN_X]);

  data.forEach((step, index) => {
step.x = scale(index);

// Léger flottement vertical
step.y = MARGIN_Y + (Math.random() - 0.5) * 36;

  });

  // groupes de phases

  const phases = d3.group(data, d => d.phase);
console.log(data);
console.log(phases);
  drawAtlas(data, phases);

}

// ---------- Fonction principale ----------

function drawAtlas(data, phases) {

  // sera complétée au Bloc B

}
// ======================================
// BLOC B
// Dessin des phases et de la rivière
// ======================================

function drawAtlas(data, phases) {

    drawPhases(phases);

    drawRiver(data);

    drawIslands(data);

}

function drawRiver(data) {

    const line = d3.line()
.curve(d3.curveBasis)
        .x(d => d.x)
        .y(d => d.y);

    riverLayer
        .append("path")
        .datum(data)
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", COLORS.river)
        .attr("stroke-width", 4)
        .attr("opacity", .45);

}

function drawPhases(phases) {

    let index = 0;

    phases.forEach((steps, phaseName) => {

        const first = steps[0];
        const last = steps[steps.length - 1];

        const padding = 90;

        const x = first.x - padding;

        const w = (last.x - first.x) + padding * 2;

        const y = MARGIN_Y - 110;

        const h = 220;

        const group = phaseLayer.append("g");

        group.append("rect")
            .attr("x", x)
            .attr("y", y)
            .attr("width", w)
            .attr("height", h)
            .attr("rx", 40)
            .attr("fill", "#181818")
            .attr("stroke", "#252525")
            .attr("stroke-width", 1);

        group.append("text")
            .attr("x", x + 24)
            .attr("y", y + 34)
            .attr("fill", "#777")
            .attr("font-size", 13)
            .attr("font-weight", 600)
            .text(phaseName);

        index++;

    });

}
// ======================================
// BLOC C
// Îlots
// ======================================

function hexagonPath(radius) {

    const pts = [];

    for (let i = 0; i < 6; i++) {

        const angle = (Math.PI / 3) * i - Math.PI / 6;

        pts.push([
            Math.cos(angle) * radius,
            Math.sin(angle) * radius
        ]);

    }

    return d3.line()(pts) + "Z";

}

function drawIslands(data) {

    const islands = islandLayer
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    // Halo

    islands
        .append("circle")
        .attr("r", 34)
        .attr("fill", "#4B7BFF")
        .attr("opacity", 0.18);

    // Hexagone

    islands
        .append("path")
        .attr("d", hexagonPath(18))
        .attr("fill", "#F5F5F5")
        .attr("stroke", "#6A8DFF")
        .attr("stroke-width", 1.5);

    // Label

    labelLayer
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => d.x)
        .attr("y", d => d.y + 42)
        .attr("text-anchor", "middle")
        .attr("fill", "#CFCFCF")
       .attr("font-size", 13)
.attr("font-weight", 500)
        .text(d => d.name);

}
