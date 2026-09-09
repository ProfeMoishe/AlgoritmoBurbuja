const container = document.getElementById('array-container');
const statusBadge = document.getElementById('status-badge');
const btnGenerate = document.getElementById('btn-generate');
const btnSort = document.getElementById('btn-sort');
const btnPause = document.getElementById('btn-pause');
const btnSound = document.getElementById('btn-sound');
const speedSlider = document.getElementById('speed');

let isPaused = false;
let isSorting = false;
let soundEnabled = true;
let array = [];

// Web Audio API para sintetizar sonidos sin archivos externos
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(val, isSwap = false) {
    if (!soundEnabled) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    // Tono dependiente del valor (frecuencia entre 200Hz y 800Hz)
    osc.frequency.value = 180 + (val * 7);
    osc.type = isSwap ? 'triangle' : 'sine';

    gain.gain.setValueAtTime(isSwap ? 0.15 : 0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (isSwap ? 0.2 : 0.1));

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + (isSwap ? 0.2 : 0.1));
}

function getElementCount() {
    return window.innerWidth < 480 ? 8 : 12;
}

function generateArray() {
    container.innerHTML = '';
    array = [];
    const count = getElementCount();
    
    for (let i = 0; i < count; i++) {
        const val = Math.floor(Math.random() * 80) + 10;
        array.push(val);
        
        const wrapper = document.createElement('div');
        wrapper.classList.add('bar-wrapper');

        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${val * 2.2}px`;
        bar.innerText = val;
        
        wrapper.appendChild(bar);
        container.appendChild(wrapper);
    }
    statusBadge.innerText = 'Nuevo vector generado';
}

async function sleep() {
    while (isPaused) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    const delay = 1010 - parseInt(speedSlider.value); 
    await new Promise(resolve => setTimeout(resolve, delay));
}

async function bubbleSort() {
    if (isSorting) return;
    isSorting = true;
    
    let wrappers = document.querySelectorAll('.bar-wrapper');
    let bars = document.querySelectorAll('.bar');
    let n = array.length;

    for (let i = 0; i < n; i++) {
        let intercambio = false;
        
        for (let j = 0; j < n - i - 1; j++) {
            // Comparación
            bars[j].style.backgroundColor = 'var(--bar-compare)';
            bars[j + 1].style.backgroundColor = 'var(--bar-compare)';
            statusBadge.innerText = `Comparando: ${array[j]} > ${array[j + 1]}?`;
            
            playTone(array[j]);
            await sleep();

            if (array[j] > array[j + 1]) {
                // Indicador visual de intercambio con flechas
                wrappers[j].classList.add('swap-left');
                wrappers[j + 1].classList.add('swap-right');
                bars[j].style.backgroundColor = 'var(--bar-swap)';
                bars[j + 1].style.backgroundColor = 'var(--bar-swap)';
                statusBadge.innerText = `¡Intercambiando! ⇄ (${array[j]} es mayor que ${array[j + 1]})`;

                playTone(array[j], true);

                // Swap lógico
                let temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;

                await sleep();

                // Swap visual DOM
                bars[j].style.height = `${array[j] * 2.2}px`;
                bars[j].innerText = array[j];
                bars[j + 1].style.height = `${array[j + 1] * 2.2}px`;
                bars[j + 1].innerText = array[j + 1];

                intercambio = true;
                
                // Remover flechas
                wrappers[j].classList.remove('swap-left');
                wrappers[j + 1].classList.remove('swap-right');
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
    
    statusBadge.innerText = '¡Vector totalmente ordenado! 🎉';
    isSorting = false;
}

// Eventos
btnGenerate.addEventListener('click', () => { if (!isSorting) generateArray(); });
btnSort.addEventListener('click', bubbleSort);

btnPause.addEventListener('click', () => {
    isPaused = !isPaused;
    btnPause.innerText = isPaused ? 'Reanudar' : 'Pausar';
    statusBadge.innerText = isPaused ? 'Animación Pausada' : 'En ejecución...';
});

btnSound.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    btnSound.innerText = soundEnabled ? '🔊 Sonido: ON' : '🔇 Sonido: OFF';
});

window.addEventListener('resize', () => { if (!isSorting) generateArray(); });

generateArray();
