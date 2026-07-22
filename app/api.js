// ======================================
// STUDIO ATLAS
// api.js
// Chargement des données
// ======================================

export async function loadAtlas() {

    const [
        workflow,
        interactions
    ] = await Promise.all([

        fetchWorkflow(),

        fetchInteractions()

    ]);

    return {

        workflow,

        interactions

    };

}

// ======================================
// Workflow
// ======================================

async function fetchWorkflow() {

    const response = await fetch("/api/workflow");

    if (!response.ok) {

        throw new Error("Impossible de charger le workflow.");

    }

    const data = await response.json();

    data.sort((a, b) => a.order - b.order);

    return data;

}

// ======================================
// Interactions
// ======================================

async function fetchInteractions() {

    const response = await fetch("/api/interactions");

    if (!response.ok) {

        throw new Error("Impossible de charger les interactions.");

    }

    return await response.json();

}

// ======================================
// Helpers
// ======================================

export function workflowById(workflow) {

    const map = new Map();

    workflow.forEach(step => {

        map.set(step.id, step);

    });

    return map;

}

export function interactionsForStep(interactions, stepId) {

    return interactions.filter(

        interaction => interaction.stepId === stepId

    );

}
