// ======================================
// STUDIO ATLAS V2
// Partie 1 — Initialisation
// ======================================

// ---------- Etat global ----------

let workflow = [];
let interactions = [];

let selectedStep = null;
let selectedInteraction = null;

// ---------- Canvas ----------

const svg = d3.select("#atlas");

const width = window.innerWidth;
const height = window.innerHeight;

svg
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

// ---------- Groupe principal ----------

const scene = svg
    .append("g")
    .attr("class", "scene");

// ---------- Zoom ----------

let currentTransform = d3.zoomIdentity;

const zoom = d3.zoom()

    .scaleExtent([0.5, 4])

    .on("zoom", event => {

        currentTransform = event.transform;

        scene.attr("transform", currentTransform);

    });

svg.call(zoom);

// ---------- Constantes ----------

const MARGIN_X = 180;
const MARGIN_Y = height / 2;

const COLORS = {

    river: "#4B7BFF",

    island: "#F4F4F4",

    halo: "#4B7BFF",

    label: "#D7D7D7",

    phaseFill: "#181818",

    phaseStroke: "#252525"

};

// ---------- Layers ----------

const phaseLayer = scene
    .append("g")
    .attr("id", "phases");

const riverLayer = scene
    .append("g")
    .attr("id", "river");

const islandLayer = scene
    .append("g")
    .attr("id", "islands");

const labelLayer = scene
    .append("g")
    .attr("id", "labels");

// ======================================
// Chargement
// ======================================

async function loadAtlas() {

    try {

        const [
            workflowResponse,
            interactionsResponse
        ] = await Promise.all([

            fetch("/api/workflow"),
            fetch("/api/interactions")

        ]);

        workflow = await workflowResponse.json();

        interactions = await interactionsResponse.json();

        workflow.sort((a, b) => a.order - b.order);

        prepareData(workflow);

    }

    catch (err) {

        console.error(err);

    }

}

loadAtlas();

// ======================================
// Préparation des données
// ======================================

function prepareData(data) {

    const scale = d3.scaleLinear()

        .domain([0, data.length - 1])

        .range([MARGIN_X, width - MARGIN_X]);

    data.forEach((step, index) => {

        step.x = scale(index);

        step.y =

            MARGIN_Y +

            (Math.random() - 0.5) * 36;

    });

    const phases = d3.group(

        data,

        d => d.phase

    );

    drawAtlas(data, phases);

}

// ======================================
// Fonction principale
// ======================================

function drawAtlas(data, phases) {

    drawPhases(phases);

    drawRiver(data);

    drawIslands(data);

    drawLabels(data);

}
// ======================================
// Partie 2
// Dessin de l'Atlas
// ======================================

// ---------- Rivière ----------

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

        .attr("opacity", 0.45);

}

// ======================================
// Phases
// ======================================

function drawPhases(phases) {

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

            .attr("rx", 36)

            .attr("fill", COLORS.phaseFill)

            .attr("stroke", COLORS.phaseStroke);

        group.append("text")

            .attr("x", x + 24)

            .attr("y", y + 34)

            .attr("fill", "#777")

            .attr("font-size", 13)

            .attr("font-weight", 600)

            .text(phaseName);

    });

}

// ======================================
// Hexagones
// ======================================

function hexagonPath(radius) {

    const pts = [];

    for (let i = 0; i < 6; i++) {

        const angle = Math.PI / 3 * i - Math.PI / 6;

        pts.push([

            Math.cos(angle) * radius,

            Math.sin(angle) * radius

        ]);

    }

    return d3.line()(pts) + "Z";

}

function drawIslands(data) {

    const islands = islandLayer

        .selectAll(".island")

        .data(data)

        .enter()

        .append("g")

        .attr("class", "island")

        .attr("transform", d => `translate(${d.x},${d.y})`);

    // halo

    islands

        .append("circle")

        .attr("r", 34)

        .attr("fill", COLORS.halo)

        .attr("opacity", 0.18);

    // hexagone

    islands

        .append("path")

        .attr("d", hexagonPath(18))

        .attr("fill", COLORS.island)

        .attr("stroke", COLORS.river)

        .attr("stroke-width", 1.5);

    // clic

    islands.on("click", (event, d) => {

        selectStep(d);

    });

}

// ======================================
// Labels
// ======================================

function drawLabels(data) {

    labelLayer

        .selectAll("text")

        .data(data)

        .enter()

        .append("text")

        .attr("x", d => d.x)

        .attr("y", d => d.y + 42)

        .attr("text-anchor", "middle")

        .attr("fill", COLORS.label)

        .attr("font-size", 13)

        .attr("font-weight", 500)

        .text(d => d.name);

}

// ======================================
// Camera
// ======================================

function focusStep(step) {

    const scale = currentTransform.k || 1;

    const tx = width / 2 - step.x * scale;

    const ty = height / 2 - step.y * scale;

    svg.transition()

        .duration(700)

        .call(

            zoom.transform,

            d3.zoomIdentity

                .translate(tx, ty)

                .scale(scale)

        );

}

// ======================================
// Sélection
// ======================================

function selectStep(step) {

    selectedStep = step;

    focusStep(step);

    updateSelection();

    updateInspector(step);

    const related = getInteractionsForStep(step.id);

    updateInteractions(related);

}

function updateSelection() {

    islandLayer

        .selectAll(".island")

        .transition()

        .duration(250)

        .style("opacity", d =>

            !selectedStep

                ? 1

                : d.id === selectedStep.id

                    ? 1

                    : 0.25

        );

    islandLayer

        .selectAll(".island path")

        .transition()

        .duration(250)

        .attr("transform", d =>

            selectedStep && d.id === selectedStep.id

                ? "scale(1.25)"

                : "scale(1)"

        );

}
// ======================================
// Partie 3
// Inspecteur
// ======================================

function updateInspector(step) {

    const title = document.getElementById("inspector-title");
    const phase = document.getElementById("phase-value");
    const order = document.getElementById("order-value");

    if (title) title.textContent = step.name;
    if (phase) phase.textContent = step.phase || "—";
    if (order) order.textContent = step.order;

}

// ======================================
// Utilitaires
// ======================================

function getInteractionsForStep(stepId) {

    return interactions.filter(interaction =>

        interaction.stepId === stepId

    );

}

// ======================================
// Liste des interactions
// ======================================

function updateInteractions(list) {

    const container = document.getElementById("interaction-list");

    if (!container) return;

    container.innerHTML = "";

    if (!list.length) {

        container.innerHTML = `

            <div class="empty">

                Aucune interaction

            </div>

        `;

        const details = document.getElementById("interaction-details");

        if(details){

            details.innerHTML = "";

        }

        return;

    }

    list.forEach(interaction => {

        const card = document.createElement("div");

        card.className = "interaction-card";

        card.innerHTML = `

            <div class="interaction-code">

                ${interaction.code || ""}

            </div>

            <div class="interaction-name">

                ${interaction.name || ""}

            </div>

            <div class="interaction-type">

                ${interaction.type || ""}

            </div>

        `;

        card.onclick = () => {

            selectedInteraction = interaction;

            highlightInteraction(card);

            updateInteractionInspector(interaction);

        };

        container.appendChild(card);

    });

}

// ======================================
// Sélection interaction
// ======================================

function highlightInteraction(card){

    document

        .querySelectorAll(".interaction-card")

        .forEach(c => c.classList.remove("selected"));

    card.classList.add("selected");

}

// ======================================
// Détail interaction
// ======================================

function updateInteractionInspector(interaction){

    const panel = document.getElementById("interaction-details");

    if(!panel) return;

    panel.innerHTML = `

        <h3>${interaction.code || ""}</h3>

        <div class="field">

            <div class="label">

                Interaction

            </div>

            <div>

                ${interaction.name || "—"}

            </div>

        </div>

        <div class="field">

            <div class="label">

                Type

            </div>

            <div>

                ${interaction.type || "—"}

            </div>

        </div>

        <div class="field">

            <div class="label">

                Émetteur

            </div>

            <div>

                ${interaction.sender || "—"}

            </div>

        </div>

        <div class="field">

            <div class="label">

                Destinataire

            </div>

            <div>

                ${interaction.receiver || "—"}

            </div>

        </div>

        <div class="field">

            <div class="label">

                Objet

            </div>

            <div>

                ${interaction.object || "—"}

            </div>

        </div>

        <div class="field">

            <div class="label">

                Déclencheur

            </div>

            <div>

                ${interaction.trigger || "—"}

            </div>

        </div>

        <div class="field">

            <div class="label">

                Livrable

            </div>

            <div>

                ${interaction.deliverable || "—"}

            </div>

        </div>

        <div class="field">

            <div class="label">

                Risque

            </div>

            <div>

                ${interaction.risk || "—"}

            </div>

        </div>

        <div class="field">

            <div class="label">

                Notes

            </div>

            <div>

                ${interaction.notes || "—"}

            </div>

        </div>

    `;

}

// ======================================
// Resize
// ======================================

window.addEventListener("resize", () => {

    location.reload();

});
