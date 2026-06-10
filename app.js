// --- ASL Intelligence OS | Professional 3D Graph ---

function generateGraphData() {
    const N = 2000; 
    const nodes = [];
    const links = [];
    const numClusters = 6;

    for (let i = 0; i < numClusters; i++) {
        nodes.push({ id: i, val: 3, color: '#ffffff' });
    }

    for (let i = numClusters; i < N; i++) {
        nodes.push({ id: i, val: 1, color: '#666666' });
        
        // Connect strongly to centers, creating a massive dense network
        if (Math.random() > 0.15) {
            links.push({ source: i, target: Math.floor(Math.random() * numClusters) });
        } else {
            links.push({ source: i, target: Math.floor(Math.random() * (N - numClusters)) + numClusters });
        }
    }
    return { nodes, links };
}

const gData = generateGraphData();

const Graph = ForceGraph3D()(document.getElementById('3d-graph'))
    .graphData(gData)
    .nodeColor('color')
    .nodeRelSize(1.5)          // extremely tiny, refined dots
    .nodeResolution(8)         
    .linkColor(() => 'rgba(255, 255, 255, 0.05)') // Almost invisible lines
    .linkWidth(0.1)
    .backgroundColor('#000000') // True black
    .showNavInfo(false)
    .enableNodeDrag(true);

// Cinematic Ultra-Slow Pan
let angle = 0;
let isExploring = false;

const cameraInterval = setInterval(() => {
    if (!isExploring) {
        Graph.cameraPosition({
            x: 1200 * Math.sin(angle),
            y: 100,
            z: 1200 * Math.cos(angle)
        });
        angle += Math.PI / 10000; // Much slower, majestic
    }
}, 20);

// Interactive UI Elements
document.addEventListener("DOMContentLoaded", () => {
    const exploreBtn = document.querySelector('.btn-primary.large');
    const uiLayer = document.querySelector('.ui-layer');

    if (exploreBtn) {
        exploreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            isExploring = true;
            
            // Fade out UI for cinematic effect
            uiLayer.style.transition = "opacity 1.5s ease-in-out";
            uiLayer.style.opacity = "0";

            // Rapidly zoom into the center of the graph
            Graph.cameraPosition(
                { x: 0, y: 0, z: 150 }, // Target position
                { x: 0, y: 0, z: 0 },   // Look-at position
                3000                    // Transition duration (ms)
            );

            // Bring UI back after 4 seconds
            setTimeout(() => {
                uiLayer.style.opacity = "1";
                isExploring = false;
            }, 4000);
        });
    }
});
