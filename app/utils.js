// ======================================
// STUDIO ATLAS
// utils.js
// Helpers et préparation des données
// ======================================

// ======================================
// Préparation du workflow
// ======================================

export function prepareWorkflow(state) {

    const workflow = state.workflow;

    workflow.sort((a, b) => a.order - b.order);

    const scale = d3.scaleLinear()

        .domain([0, workflow.length - 1])

        .range([

            state.marginX,

            state.width - state.marginX

        ]);

    workflow.forEach((step, index) => {

        step.x = scale(index);

        step.y =

            state.marginY +

            (Math.random() - 0.5) * 36;

    });

}

// ======================================
// Groupe par phase
// ======================================

export function groupByPhase(workflow){

    return d3.group(

        workflow,

        d => d.phase

    );

}

// ======================================
// Recherche d'une étape
// ======================================

export function stepById(workflow,id){

    return workflow.find(

        s => s.id === id

    );

}

// ======================================
// Clamp
// ======================================

export function clamp(value,min,max){

    return Math.max(

        min,

        Math.min(max,value)

    );

}

// ======================================
// Distance
// ======================================

export function distance(a,b){

    return Math.hypot(

        a.x-b.x,

        a.y-b.y

    );

}

// ======================================
// Angle
// ======================================

export function angle(a,b){

    return Math.atan2(

        b.y-a.y,

        b.x-a.x

    );

}

// ======================================
// Position sur un cercle
// ======================================

export function pointOnCircle(

    center,

    radius,

    angle

){

    return{

        x:

            center.x+

            Math.cos(angle)*radius,

        y:

            center.y+

            Math.sin(angle)*radius

    };

}

// ======================================
// UUID court
// ======================================

export function uid(){

    return Math.random()

        .toString(36)

        .substring(2,9);

}

// ======================================
// Couleur département
// ======================================

const departmentColors = new Map();

const palette = [

    "#4B7BFF",

    "#32C48D",

    "#FFB547",

    "#E86AF0",

    "#4DD0E1",

    "#F56B6B",

    "#8BC34A",

    "#FFA726",

    "#AB47BC"

];

export function departmentColor(name){

    if(!name) return "#777";

    if(!departmentColors.has(name)){

        departmentColors.set(

            name,

            palette[

                departmentColors.size %

                palette.length

            ]

        );

    }

    return departmentColors.get(name);

}

// ======================================
// Debounce
// ======================================

export function debounce(fn,delay=250){

    let timer;

    return (...args)=>{

        clearTimeout(timer);

        timer=setTimeout(

            ()=>fn(...args),

            delay

        );

    };

}

// ======================================
// Resize
// ======================================

export function installResizeHandler(state){

    window.addEventListener("resize",()=>{

        location.reload();

    });

}
