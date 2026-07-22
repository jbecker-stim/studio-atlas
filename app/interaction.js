// ======================================
// STUDIO ATLAS
// interactions.js
// ======================================

import { state, layers } from "./main.js";
import { updateInteractionInspector } from "./inspector.js";

let graphLayer = null;

// ======================================
// Recherche
// ======================================

export function getInteractionsForStep(stepId){

    return state.interactions.filter(

        i => i.stepId === stepId

    );

}

// ======================================
// Liste latérale
// ======================================

export function updateInteractions(list){

    const container =
        document.getElementById("interaction-list");

    if(!container) return;

    container.innerHTML="";

    if(list.length===0){

        container.innerHTML=

            `<div class="empty">
                Aucune interaction
            </div>`;

        return;

    }

    list.forEach(interaction=>{

        const card=document.createElement("div");

        card.className="interaction-card";

        card.innerHTML=`

            <div class="interaction-code">

                ${interaction.code ?? ""}

            </div>

            <div>

                ${interaction.name ?? ""}

            </div>

            <div class="interaction-type">

                ${interaction.type ?? ""}

            </div>

        `;

        card.onclick=()=>{

            state.selectedInteraction=interaction;

            updateInteractionInspector(interaction);

            highlightInteraction(interaction);

        };

        container.appendChild(card);

    });

}

// ======================================
// Graphe
// ======================================

export function drawInteractionGraph(step,list){

    clearInteractionGraph();

    graphLayer=

        layers.interactions

            .append("g")

            .attr("class","interaction-graph");

    if(list.length===0) return;

    const radius=95;

    list.forEach((interaction,index)=>{

        const angle=

            (Math.PI*2/list.length)*index

            -Math.PI/2;

        const x=

            step.x+

            Math.cos(angle)*radius;

        const y=

            step.y+

            Math.sin(angle)*radius;

        // arc

        graphLayer

            .append("line")

            .attr("class","interaction-line")

            .attr("x1",step.x)

            .attr("y1",step.y)

            .attr("x2",x)

            .attr("y2",y)

            .attr("stroke","#4B7BFF")

            .attr("stroke-width",1.2)

            .attr("opacity",0)

            .transition()

            .duration(400)

            .attr("opacity",0.5);

        // département

        graphLayer

            .append("circle")

            .attr("class","department-node")

            .attr("cx",x)

            .attr("cy",y)

            .attr("r",0)

            .attr("fill","#1F1F1F")

            .attr("stroke","#4B7BFF")

            .attr("stroke-width",2)

            .transition()

            .duration(350)

            .attr("r",14);

        // libellé

        graphLayer

            .append("text")

            .attr("x",x)

            .attr("y",y+28)

            .attr("text-anchor","middle")

            .attr("fill","#DDD")

            .attr("font-size",11)

            .style("opacity",0)

            .text(

                interaction.receiver ||

                interaction.sender ||

                "?"

            )

            .transition()

            .delay(250)

            .style("opacity",1);

    });

}

// ======================================
// Highlight
// ======================================

function highlightInteraction(interaction){

    graphLayer

        ?.selectAll(".interaction-line")

        .attr("stroke","#4B7BFF")

        .attr("stroke-width",1.2);

}

// ======================================
// Nettoyage
// ======================================

export function clearInteractionGraph(){

    if(graphLayer){

        graphLayer.remove();

        graphLayer=null;

    }

}
