const arrayContainer = document.getElementById('array-container');
const btnGenerate = document.getElementById('btn-generate');
const btnSort = document.getElementById('btn-sort');

let array = [];
const ARRAY_SIZE = 15;
const DELAY = 300;

// Generar vector aleatorio
function generateArray() {
    array = [];
    arrayContainer.innerHTML = '';
    
    for (let i = 0; i < ARRAY_SIZE; i++) {
        // Valores entre 10 y 100 para que se vea bien en altura
        const value = Math.floor(Math.random() * 90) + 10;
        array.push(value);
        
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${value}%`;
        bar.innerText = value;
        arrayContainer.appendChild(bar);
    }
}

// Pausa para la animación
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Algoritmo Bubble Sort visual
async function bubbleSort() {
    const bars = document.querySelectorAll('.bar');
    btnGenerate.disabled = true;
    btnSort.disabled = true;

    let n = array.length;
    let intercambio;
    
    for (let i = 0; i < n; i++) {
        intercambio = false;
        
        for (let j = 0; j < n - i - 1; j++) {
            // Resaltar barras siendo comparadas
            bars[j].style.backgroundColor = 'var(--bar-active)';
            bars[j + 1].style.backgroundColor = 'var(--bar-active)';
            
            await sleep(DELAY);
            
            if (array[j] > array[j + 1]) {
                // Intercambiar valores en el array
                let temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
                
                // Intercambiar visualmente (alturas y texto)
                bars[j].style.height = `${array[j]}%`;
                bars[j].innerText = array[j];
                
                bars[j + 1].style.height = `${array[j + 1]}%`;
                bars[j + 1].innerText = array[j + 1];
                
                intercambio = true;
            }
            
            // Volver al color original
            bars[j].style.backgroundColor = 'var(--bar-color)';
            bars[j + 1].style.backgroundColor = 'var(--bar-color)';
        }
        
        // Marcar la última barra como ordenada
        bars[n - i - 1].style.backgroundColor = 'var(--bar-sorted)';
        
        if (!intercambio) {
            // Si no hubo intercambios, marcar el resto como ordenado
            for (let k = 0; k < n - i - 1; k++) {
                bars[k].style.backgroundColor = 'var(--bar-sorted)';
            }
            break;
        }
    }
    
    btnGenerate.disabled = false;
    btnSort.disabled = false;
}

// Event Listeners
btnGenerate.addEventListener('click', generateArray);
btnSort.addEventListener('click', bubbleSort);

// Inicializar al cargar la página
window.onload = generateArray;
