const container = document.getElementById('array-container');
const btnGenerate = document.getElementById('btn-generate');
const btnSort = document.getElementById('btn-sort');
const btnPause = document.getElementById('btn-pause');
const speedSlider = document.getElementById('speed');

let isPaused = false;
let isSorting = false;
let array = [];

// Generar un nuevo vector de números aleatorios
function generateArray() {
    container.innerHTML = '';
    array = [];
    for (let i = 0; i < 15; i++) {
        const val = Math.floor(Math.random() * 80) + 10; // Valores entre 10 y 90
        array.push(val);
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${val * 3}px`;
        bar.innerText = val;
        container.appendChild(bar);
    }
}

// Función que maneja el tiempo de espera y la pausa
async function sleep() {
    // Si está pausado, revisamos cada 100ms hasta que se reanude
    while (isPaused) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    // Calculamos el delay basado en el slider (invertimos el valor para que a mayor slider, mayor velocidad)
    const delay = 1010 - speedSlider.value; 
    await new Promise(resolve => setTimeout(resolve, delay));
}

// Algoritmo de la Burbuja Visual
async function bubbleSort() {
    if (isSorting) return; // Evitar que se ejecute dos veces al mismo tiempo
    isSorting = true;
    
    let bars = document.querySelectorAll('.bar');
    let n = array.length;

    for (let i = 0; i < n; i++) {
        let intercambio = false;
        
        for (let j = 0; j < n - i - 1; j++) {
            // Cambiar color para mostrar comparación
            bars[j].style.backgroundColor = 'var(--bar-compare)';
            bars[j + 1].style.backgroundColor = 'var(--bar-compare)';
            
            await sleep(); // Pausa interactiva

            if (array[j] > array[j + 1]) {
                // Intercambio en el arreglo lógico
                let temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;

                // Intercambio visual en el DOM
                bars[j].style.height = `${array[j] * 3}px`;
                bars[j].innerText = array[j];
                bars[j + 1].style.height = `${array[j + 1] * 3}px`;
                bars[j + 1].innerText = array[j + 1];

                intercambio = true;
            }

            // Restaurar color base
            bars[j].style.backgroundColor = 'var(--bar-default)';
            bars[j + 1].style.backgroundColor = 'var(--bar-default)';
        }
        
        // El último elemento comparado ya está en su lugar (verde)
        bars[n - i - 1].style.backgroundColor = 'var(--bar-sorted)';
        
        // Optimización: si no hubo intercambios, marcar los restantes y salir
        if (!intercambio) {
            for(let k = 0; k < n - i - 1; k++){
                bars[k].style.backgroundColor = 'var(--bar-sorted)';
            }
            break;
        }
    }
    isSorting = false;
}

// Eventos de los botones
btnGenerate.addEventListener('click', () => {
    if(!isSorting) generateArray();
});

btnSort.addEventListener('click', bubbleSort);

btnPause.addEventListener('click', () => {
    isPaused = !isPaused;
    btnPause.innerText = isPaused ? 'Reanudar' : 'Pausar';
    btnPause.classList.toggle('paused'); // Cambia la clase para modificar el color del botón
});

// Inicializar el primer vector al cargar la página
generateArray();
