// ======================================
// STUDIO ATLAS
// inspector.js
// Gestion du panneau latéral
// ======================================

import { state } from "./main.js";

<input
    id="atlas-search"
    type="text"
    placeholder="Rechercher une étape..."
>

// ======================================
// Etape
// ======================================

export function updateInspector(step){

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

                ${interaction.code || ""}

            </h3>

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

    const interactions =

        document.getElementById(

            "interaction-list"

        );

    if(interactions){

        interactions.innerHTML = "";

    }

    const details =

        document.getElementById(

            "interaction-details"

        );

    if(details){

        details.innerHTML = "";

    }

}

// ======================================
// Helpers
// ======================================

function setText(id,value){

    const element =

        document.getElementById(id);

    if(element){

        element.textContent = value;

    }

}
