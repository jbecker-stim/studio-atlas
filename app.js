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

    step.y = MARGIN_Y;

  });

  // groupes de phases

  const phases = d3.group(data, d => d.phase);

  drawAtlas(data, phases);

}

// ---------- Fonction principale ----------

function drawAtlas(data, phases) {

  // sera complétée au Bloc B

}
