// ======================================
// STUDIO ATLAS
// camera.js
// Gestion de la caméra
// ======================================

import { svg, state } from "./main.js";

// ======================================
// Zoom D3
// ======================================

export const zoom = d3.zoom()

    .scaleExtent([0.5, 4])

    .on("zoom", event => {

        state.currentTransform = event.transform;

        d3.select(".scene")

            .attr(

                "transform",

                state.currentTransform

            );

    });

// ======================================
// Initialisation
// ======================================

export function initializeCamera() {

    svg.call(zoom);

}

// ======================================
// Focus sur une étape
// ======================================

export function focusStep(step) {

    const scale =

        state.currentTransform.k || 1;

    const tx =

        state.width / 2

        - step.x * scale;

    const ty =

        state.height / 2

        - step.y * scale;

    svg

        .transition()

        .duration(700)

        .ease(d3.easeCubicOut)

        .call(

            zoom.transform,

            d3.zoomIdentity

                .translate(tx, ty)

                .scale(scale)

        );

}

// ======================================
// Vue complète
// ======================================

export function resetCamera() {

    svg

        .transition()

        .duration(700)

        .call(

            zoom.transform,

            d3.zoomIdentity

        );

}

// ======================================
// Zoom programmatique
// ======================================

export function zoomTo(scale) {

    svg

        .transition()

        .duration(500)

        .call(

            zoom.scaleTo,

            scale

        );

}
