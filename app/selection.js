// ======================================
// STUDIO ATLAS
// selection.js
// Gestion de la sélection
// ======================================

import { state, layers } from "./main.js";
import { focusStep } from "./camera.js";
import { updateInspector } from "./inspector.js";
import {
    getInteractionsForStep,
    updateInteractions,
    clearInteractionGraph,
    drawInteractionGraph
} from "./interactions.js";

export function searchStep(query){

    query = query.toLowerCase();

    layers.islands

        .selectAll(".island")

        .style("opacity", d=>{

            if(query==="") return 1;

            return d.name
                .toLowerCase()
                .includes(query)
                ?1
                :.15;

        });

    layers.labels

        .selectAll("text")

        .style("opacity", d=>{

            if(query==="") return 1;

            return d.name
                .toLowerCase()
                .includes(query)
                ?1
                :.15;

        });

}
// ======================================
// Sélection d'une étape
// ======================================

export function selectStep(step) {

    state.selectedStep = step;

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

                : 0.20;

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

                : 0.35;

        });

    layers.islands

        .selectAll(".island path")

        .transition()

        .duration(250)

        .attr("transform", d => {

            if (

                state.selectedStep &&

                d.id === state.selectedStep.id

            )

                return "scale(1.30)";

            return "scale(1)";

        });

    layers.islands

        .selectAll(".island circle")

        .transition()

        .duration(250)

        .attr("r", d => {

            if (

                state.selectedStep &&

                d.id === state.selectedStep.id

            )

                return 42;

            return 34;

        });

}

// ======================================
// Désélection
// ======================================

export function clearSelection() {

    state.selectedStep = null;

    state.selectedInteraction = null;

    layers.islands

        .selectAll(".island")

        .transition()

        .duration(200)

        .style("opacity",1);

    layers.labels

        .selectAll("text")

        .transition()

        .duration(200)

        .style("opacity",1);

    layers.islands

        .selectAll(".island path")

        .transition()

        .duration(200)

        .attr("transform","scale(1)");

    layers.islands

        .selectAll(".island circle")

        .transition()

        .duration(200)

        .attr("r",34);

    clearInteractionGraph();

}

// ======================================
// Navigation clavier
// ======================================

window.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        clearSelection();

    }

});
