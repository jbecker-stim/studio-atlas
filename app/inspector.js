// ======================================
// STUDIO ATLAS
// inspector.js
// Sprint 4
// ======================================

import { state } from "./main.js";
import { getInteractionsForStep } from "./interactions.js";

// ======================================
// Mise à jour de l'inspector
// ======================================

export function updateInspector(step){

    updateHeader(step);

    updateBreadcrumb(step);

    updateStatistics(step);

}

// ======================================
// En-tête
// ======================================

function updateHeader(step){

    setText(

        "inspector-title",

        step.name

    );

    setText(

        "phase-value",

        step.phase || "—"

    );

    setText(

        "order-value",

        step.order

    );

    const current =

        state.workflow.findIndex(

            s=>s.id===step.id

        )+1;

    setText(

        "step-counter",

        `${current} / ${state.workflow.length}`

    );

}

// ======================================
// Breadcrumb
// ======================================

function updateBreadcrumb(step){

    const container =

        document.getElementById(

            "breadcrumb"

        );

    if(!container) return;

    const index =

        state.workflow.findIndex(

            s=>s.id===step.id

        );

    container.innerHTML =

        state.workflow

        .slice(0,index+1)

        .map(s=>s.phase)

        .join(" → ");

}

// ======================================
// Statistiques
// ======================================

function updateStatistics(step){

    const interactions =

        getInteractionsForStep(step.id);

    setText(

        "stat-total",

        interactions.length

    );

    const incoming =

        interactions.filter(

            i=>i.receiver

        ).length;

    const outgoing =

        interactions.filter(

            i=>i.sender

        ).length;

    const critical =

        interactions.filter(

            i=>i.critical===true

        ).length;

    setText(

        "stat-in",

        incoming

    );

    setText(

        "stat-out",

        outgoing

    );

    setText(

        "stat-critical",

        critical

    );

}

// ======================================
// Interaction
// ======================================

export function updateInteractionInspector(interaction){

    const panel =

        document.getElementById(

            "interaction-details"

        );

    if(!panel) return;

    panel.innerHTML = `

        <div class="interaction-panel">

            <h3>

                ${interaction.code ?? ""}

            </h3>

            <div class="field">

                <div class="label">

                    Interaction

                </div>

                <div>

                    ${interaction.name ?? "—"}

                </div>

            </div>

            <div class="field">

                <div class="label">

                    Type

                </div>

                <div>

                    ${interaction.type ?? "—"}

                </div>

            </div>

            <div class="field">

                <div class="label">

                    Émetteur

                </div>

                <div>

                    ${interaction.sender ?? "—"}

                </div>

            </div>

            <div class="field">

                <div class="label">

                    Destinataire

                </div>

                <div>

                    ${interaction.receiver ?? "—"}

                </div>

            </div>

            <div class="field">

                <div class="label">

                    Objet

                </div>

                <div>

                    ${interaction.object ?? "—"}

                </div>

            </div>

            <div class="field">

                <div class="label">

                    Déclencheur

                </div>

                <div>

                    ${interaction.trigger ?? "—"}

                </div>

            </div>

            <div class="field">

                <div class="label">

                    Livrable

                </div>

                <div>

                    ${interaction.deliverable ?? "—"}

                </div>

            </div>

            <div class="field">

                <div class="label">

                    Risque

                </div>

                <div>

                    ${interaction.risk ?? "—"}

                </div>

            </div>

            <div class="field">

                <div class="label">

                    Notes

                </div>

                <div>

                    ${interaction.notes ?? "—"}

                </div>

            </div>

        </div>

    `;

}

// ======================================
// Reset
// ======================================

export function clearInspector(){

    setText(

        "inspector-title",

        "Sélectionnez une étape"

    );

    setText(

        "phase-value",

        "—"

    );

    setText(

        "order-value",

        "—"

    );

    setText(

        "step-counter",

        "—"

    );

    const breadcrumb =

        document.getElementById(

            "breadcrumb"

        );

    if(breadcrumb)

        breadcrumb.innerHTML="";

    [

        "stat-total",

        "stat-in",

        "stat-out",

        "stat-critical"

    ].forEach(id=>{

        setText(id,"0");

    });

    const list =

        document.getElementById(

            "interaction-list"

        );

    if(list)

        list.innerHTML="";

    const details =

        document.getElementById(

            "interaction-details"

        );

    if(details)

        details.innerHTML="";

}

// ======================================
// Helper
// ======================================

function setText(id,value){

    const element =

        document.getElementById(id);

    if(element)

        element.textContent=value;

}
