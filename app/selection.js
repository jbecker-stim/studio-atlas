// ======================================
// STUDIO ATLAS
// selection.js
// Sprint 4
// ======================================

import { state, layers } from "./main.js";
import { focusStep, resetCamera } from "./camera.js";
import {
    updateInspector,
    clearInspector
} from "./inspector.js";
import {
    getInteractionsForStep,
    updateInteractions,
    clearInteractionGraph,
    drawInteractionGraph
} from "./interactions.js";

// ======================================
// Historique
// ======================================

const history = [];

let historyIndex = -1;

// ======================================
// Sélection
// ======================================

export function selectStep(step, addHistory = true) {

    if (!step) return;

    state.selectedStep = step;

    if (addHistory) {

        history.splice(historyIndex + 1);

        history.push(step);

        historyIndex = history.length - 1;

    }

    focusStep(step);

    updateSelection();

    updateInspector(step);

    const related = getInteractionsForStep(step.id);

    updateInteractions(related);

    clearInteractionGraph();

    drawInteractionGraph(step, related);

}

// ======================================
// Mise à jour visuelle
// ======================================

export function updateSelection() {

    layers.islands

        .selectAll(".island")

        .transition()

        .duration(250)

        .style("opacity", d => {

            if (!state.selectedStep)

                return 1;

            return d.id === state.selectedStep.id

                ? 1

                : .20;

        });

    layers.labels

        .selectAll("text")

        .transition()

        .duration(250)

        .style("opacity", d => {

            if (!state.selectedStep)

                return 1;

            return d.id === state.selectedStep.id

                ? 1

                : .25;

        });

    layers.islands

        .selectAll(".island path")

        .transition()

        .duration(250)

        .attr("transform", d =>

            state.selectedStep &&
            d.id === state.selectedStep.id

                ? "scale(1.30)"

                : "scale(1)"

        );

    layers.islands

        .selectAll(".island circle")

        .transition()

        .duration(250)

        .attr("r", d =>

            state.selectedStep &&
            d.id === state.selectedStep.id

                ? 42

                : 34

        );

}

// ======================================
// Désélection
// ======================================

export function clearSelection() {

    state.selectedStep = null;

    state.selectedInteraction = null;

    clearInteractionGraph();

    clearInspector();

    resetCamera();

    layers.islands

        .selectAll(".island")

        .transition()

        .duration(200)

        .style("opacity", 1);

    layers.labels

        .selectAll("text")

        .transition()

        .duration(200)

        .style("opacity", 1);

    layers.islands

        .selectAll(".island path")

        .transition()

        .duration(200)

        .attr("transform", "scale(1)");

    layers.islands

        .selectAll(".island circle")

        .transition()

        .duration(200)

        .attr("r", 34);

}

// ======================================
// Recherche
// ======================================

export function searchStep(query) {

    query = query.trim().toLowerCase();

    if (query === "") {

        updateSelection();

        return;

    }

    const results = state.workflow.filter(step =>

        step.name.toLowerCase().includes(query)

    );

    layers.islands

        .selectAll(".island")

        .style("opacity", d =>

            results.some(r => r.id === d.id)

                ? 1

                : .10

        );

    layers.labels

        .selectAll("text")

        .style("opacity", d =>

            results.some(r => r.id === d.id)

                ? 1

                : .10

        );

    if (results.length > 0) {

        focusStep(results[0]);

    }

}

// ======================================
// Navigation
// ======================================

export function nextStep() {

    if (!state.selectedStep) return;

    const index = state.workflow.findIndex(

        s => s.id === state.selectedStep.id

    );

    if (index < state.workflow.length - 1) {

        selectStep(

            state.workflow[index + 1]

        );

    }

}

export function previousStep() {

    if (!state.selectedStep) return;

    const index = state.workflow.findIndex(

        s => s.id === state.selectedStep.id

    );

    if (index > 0) {

        selectStep(

            state.workflow[index - 1]

        );

    }

}

// ======================================
// Historique
// ======================================

export function backHistory() {

    if (historyIndex <= 0)

        return;

    historyIndex--;

    selectStep(

        history[historyIndex],

        false

    );

}

export function forwardHistory() {

    if (historyIndex >= history.length - 1)

        return;

    historyIndex++;

    selectStep(

        history[historyIndex],

        false

    );

}

// ======================================
// Clavier
// ======================================

window.addEventListener("keydown", e => {

    switch (e.key) {

        case "Escape":

            clearSelection();

            break;

        case "ArrowRight":

            nextStep();

            break;

        case "ArrowLeft":

            previousStep();

            break;

    }

    if (e.metaKey && e.key === "ArrowLeft") {

        backHistory();

    }

    if (e.metaKey && e.key === "ArrowRight") {

        forwardHistory();

    }

});

// ======================================
// Recherche
// ======================================

window.addEventListener("DOMContentLoaded", () => {

    const input =

        document.getElementById("atlas-search");

    if (!input)

        return;

    input.addEventListener("input", e => {

        searchStep(e.target.value);

    });

});
