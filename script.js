const container = document.getElementById('array-container');
const btnGenerate = document.getElementById('btn-generate');
const btnSort = document.getElementById('btn-sort');
const btnPause = document.getElementById('btn-pause');
const speedSlider = document.getElementById('speed');

let isPaused = false;
let isSorting = false;
let array = [];

// Adaptar la cantidad de barras según el tamaño del dispositivo
function getElementCount() {
    return window.innerWidth < 480 ? 10 : 15;
}

// Generar nuevo vector aleatorio
function generateArray() {
    container.innerHTML = '';
    array = [];
    const count = getElementCount();
    
    for (let i = 0; i < count; i++) {
        const val = Math.floor(Math.random() * 80) + 10;
        array.push(val);
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${val * 2.2}px`; // Escala optimizada para pantallas pequeñas
        bar.innerText = val;
        container.appendChild(bar);
    }
}

// Control del flujo de ejecución (Velocidad y Pausa)
async function sleep() {
    while (isPaused) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    const delay = 1010 - parseInt(speedSlider.value); 
    await new Promise(resolve => setTimeout(resolve, delay));
}

// Algoritmo de Ordenamiento
async function bubbleSort() {
    if (isSorting) return;
    isSorting = true;
    
    let bars = document.querySelectorAll('.bar');
    let n = array.length;

    for (let i = 0; i < n; i++) {
        let intercambio = false;
        
        for (let j = 0; j < n - i - 1; j++) {
            bars[j].style.backgroundColor = 'var(--bar-compare)';
            bars[j + 1].style.backgroundColor = 'var(--bar-compare)';
            
            await sleep();

            if (array[j] > array[j + 1]) {
                // Swap lógico
                let temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;

                // Actualización visual
                bars[j].style.height = `${array[j] * 2.2}px`;
                bars[j].innerText = array[j];
                bars[j + 1].style.height = `${array[j + 1] * 2.2}px`;
                bars[j + 1].innerText = array[j + 1];

                intercambio = true;
            }

            bars[j].style.backgroundColor = 'var(--bar-default)';
            bars[j + 1].style.backgroundColor = 'var(--bar-default)';
        }
        
        bars[n - i - 1].style.backgroundColor = 'var(--bar-sorted)';
        
        if (!intercambio) {
            for (let k = 0; k < n - i - 1; k++) {
                bars[k].style.backgroundColor = 'var(--bar-sorted)';
            }
            break;
        }
    }
    isSorting = false;
}

// Listeners de Eventos
btnGenerate.addEventListener('click', () => {
    if (!isSorting) generateArray();
});

btnSort.addEventListener('click', bubbleSort);

btnPause.addEventListener('click', () => {
    isPaused = !isPaused;
    btnPause.innerText = isPaused ? 'Reanudar' : 'Pausar';
    btnPause.classList.toggle('paused');
});

// Regenerar arreglo si cambian la orientación del celular
window.addEventListener('resize', () => {
    if (!isSorting) generateArray();
});

// Cargar vector al iniciar
generateArray();
