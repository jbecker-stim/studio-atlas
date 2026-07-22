// ======================================
// STUDIO ATLAS
// render.js
// Moteur de rendu
// ======================================

import { layers, COLORS } from "./main.js";
import { selectStep } from "./selection.js";

// ======================================
// Entrée principale
// ======================================

export function drawAtlas(state) {

    clearScene();

    drawPhases(state);

    drawRiver(state);

    drawIslands(state);

    drawLabels(state);

}

// ======================================
// Nettoyage
// ======================================

function clearScene() {

    Object.values(layers).forEach(layer => {

        layer.selectAll("*").remove();

    });

}

// ======================================
// Rivière
// ======================================

function drawRiver(state) {

    const line = d3.line()

        .curve(d3.curveBasis)

        .x(d => d.x)

        .y(d => d.y);

    layers.river

        .append("path")

        .datum(state.workflow)

        .attr("d", line)

        .attr("fill", "none")

        .attr("stroke", COLORS.river)

        .attr("stroke-width", 4)

        .attr("opacity", .45);

}

// ======================================
// Phases
// ======================================

function drawPhases(state) {

    const phases = d3.group(

        state.workflow,

        d => d.phase

    );

    phases.forEach((steps, phaseName) => {

        const first = steps[0];

        const last = steps[steps.length - 1];

        const padding = 90;

        const x = first.x - padding;

        const y = state.marginY - 110;

        const w =

            (last.x - first.x)

            + padding * 2;

        const h = 220;

        const group =

            layers.phases

                .append("g");

        group

            .append("rect")

            .attr("x", x)

            .attr("y", y)

            .attr("width", w)

            .attr("height", h)

            .attr("rx", 36)

            .attr("fill", COLORS.phaseFill)

            .attr("stroke", COLORS.phaseStroke);

        group

            .append("text")

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

function drawIslands(state) {

    const islands =

        layers.islands

            .selectAll(".island")

            .data(state.workflow)

            .enter()

            .append("g")

            .attr("class", "island")

            .attr(

                "transform",

                d => `translate(${d.x},${d.y})`

            )

            .style("cursor","pointer")

            .on("click",(event,d)=>{

                selectStep(d);

            });

    // halo

    islands

        .append("circle")

        .attr("r",34)

        .attr("fill",COLORS.halo)

        .attr("opacity",0.18);

    // hexagone

    islands

        .append("path")

        .attr("d",hexagon(18))

        .attr("fill",COLORS.island)

        .attr("stroke",COLORS.river)

        .attr("stroke-width",1.5);

}

// ======================================
// Labels
// ======================================

function drawLabels(state){

    layers.labels

        .selectAll("text")

        .data(state.workflow)

        .enter()

        .append("text")

        .attr("x",d=>d.x)

        .attr("y",d=>d.y+42)

        .attr("text-anchor","middle")

        .attr("fill",COLORS.label)

        .attr("font-size",13)

        .attr("font-weight",500)

        .text(d=>d.name);

}

// ======================================
// Hexagone
// ======================================

function hexagon(radius){

    const pts=[];

    for(let i=0;i<6;i++){

        const a=i*Math.PI/3-Math.PI/6;

        pts.push([

            Math.cos(a)*radius,

            Math.sin(a)*radius

        ]);

    }

    return d3.line()(pts)+"Z";

}
