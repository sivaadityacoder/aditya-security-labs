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

// --- Backend API Connection ---
const API_BASE_URL = "https://your-ngrok-url.ngrok.app"; // Replace when ngrok is running

const osInput = document.getElementById('os-command-input');
const osResponse = document.getElementById('os-response');

if (osInput) {
    osInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter' && osInput.value.trim() !== '') {
            const query = osInput.value;
            osInput.value = '';
            osInput.disabled = true;
            osInput.placeholder = "Querying ASL Neural Engine...";
            
            osResponse.style.display = 'block';
            osResponse.innerHTML = `<span style="color:var(--text-secondary)">root@asl-engine:~# ${query}</span><br><br><span style="color:#666">Analyzing Code Graph Context...</span>`;

            try {
                const res = await fetch(`${API_BASE_URL}/api/chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: query, history: [] })
                });

                if (!res.ok) throw new Error("Connection failed");
                const data = await res.json();
                
                if (data.success) {
                    osResponse.innerHTML = `<span style="color:var(--text-secondary)">root@asl-engine:~# ${query}</span><br><br>${data.response.replace(/\\n/g, '<br>')}`;
                } else {
                    osResponse.innerHTML = `<span style="color:var(--text-secondary)">root@asl-engine:~# ${query}</span><br><br><span style="color:#ff3333">Error: ${data.error}</span>`;
                }
            } catch (err) {
                osResponse.innerHTML = `<span style="color:var(--text-secondary)">root@asl-engine:~# ${query}</span><br><br><span style="color:#ff3333">Connection Refused: Target ASL Node Offline.</span><br><br><span style="color:#888">Ensure your local Ngrok tunnel is active and the API_BASE_URL is updated.</span>`;
            }

            osInput.disabled = false;
            osInput.placeholder = "Enter query for Neural Brain...";
            osInput.focus();
        }
    });
}
