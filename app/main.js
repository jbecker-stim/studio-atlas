// ======================================
// STUDIO ATLAS
// main.js
// Point d'entrée de l'application
// ======================================

import { loadAtlas } from "./api.js";
import { prepareWorkflow } from "./utils.js";
import { drawAtlas } from "./render.js";

// ======================================
// Etat global
// ======================================

export const state = {

    workflow: [],

    interactions: [],

    selectedStep: null,

    selectedInteraction: null,

    currentTransform: d3.zoomIdentity,

    width: window.innerWidth,

    height: window.innerHeight,

    marginX: 180,

    marginY: window.innerHeight / 2

};

// ======================================
// Canvas
// ======================================

export const svg = d3.select("#atlas");

svg

    .attr(
        "viewBox",
        `0 0 ${state.width} ${state.height}`
    )

    .attr(
        "preserveAspectRatio",
        "xMidYMid meet"
    );

// ======================================
// Scene
// ======================================

export const scene = svg

    .append("g")

    .attr("class", "scene");

// ======================================
// Layers
// ======================================

export const layers = {

    phases: scene
        .append("g")
        .attr("id", "phases"),

    river: scene
        .append("g")
        .attr("id", "river"),

    islands: scene
        .append("g")
        .attr("id", "islands"),

    labels: scene
        .append("g")
        .attr("id", "labels"),

    interactions: scene
        .append("g")
        .attr("id", "interaction-layer")

};

// ======================================
// Couleurs
// ======================================

export const COLORS = {

    river: "#4B7BFF",

    halo: "#4B7BFF",

    island: "#F5F5F5",

    label: "#D8D8D8",

    phaseFill: "#181818",

    phaseStroke: "#252525"

};

// ======================================
// Initialisation
// ======================================

async function init() {

    try {

        const atlas = await loadAtlas();

        state.workflow = atlas.workflow;

        state.interactions = atlas.interactions;

        prepareWorkflow(state);

        drawAtlas(state);

        console.log("Studio Atlas ready");

    }

    catch(err){

        console.error(err);

    }

}

init();
