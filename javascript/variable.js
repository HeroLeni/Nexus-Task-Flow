// 1. DEFINICIÓN (La "Base de Datos")
let work = []; 

const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');

// --- CREATE (Añadir con validación de duplicados) ---
taskForm.addEventListener('submit', function(e){
    e.preventDefault();

    const name = document.getElementById('task-name').value;
    const date = document.getElementById('task-date').value;
    const priority = document.getElementById('task-priority').value;

    // VALIDACIÓN: Verificar si ya existe una tarea con ese nombre
    const existeTarea = work.find(t => t.name.toLowerCase() === name.toLowerCase());
    
    if (existeTarea) {
        alert(`⚠️ La tarea "${name}" ya está registrada. Por favor elige otro nombre.`);
        return; // Detiene la ejecución aquí si es duplicado
    }

    // Generamos un ID único
    const newId = Date.now(); 

    // Creamos el objeto
    const task = { 
        id: newId, 
        name: name, 
        date: date, 
        priority: priority,
        completada: false 
    };

    // Guardamos en el Array "work"
    work.push(task); 
    
    // Y también lo mostramos en el DOM
    addTaskToDOM(task);

    console.log("Estado actual del array work:", work);

    taskForm.reset();
});

function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id); 

    li.innerHTML = `
        <span id="task-text-${task.id}"><strong>${task.name}</strong></span>
        <span>Fecha: ${task.date}</span>
        <span class="badge ${task.priority.toLowerCase()}">${task.priority}</span>
        <button onclick="modificarTarea(${task.id})">Modificar</button>
        <button onclick="eliminarTarea(${task.id}, this)">Eliminar</button>
    `;

    taskList.appendChild(li);
}

// --- MODIFY (Modificar - nueva función) ---
function modificarTarea(idParaModificar) {
    // 1. Buscar la tarea actual
    const tarea = work.find(t => t.id === idParaModificar);
    
    if (!tarea) return;

    // --- PASO A: Modificar Nombre ---
    const nuevoNombre = prompt("📝 Editar nombre de la tarea:", tarea.name);
    
    // Validación simple: Si cancela o lo deja vacío, no hacemos nada
    if (nuevoNombre === null || nuevoNombre.trim() === "") return;

    // (Opcional) Aquí iría tu validación de duplicados que hicimos antes

    // --- PASO B: Modificar Estado (Completado) ---
    // confirm() devuelve: TRUE si das Aceptar, FALSE si das Cancelar
    const estaCompletada = confirm(
        `¿La tarea "${nuevoNombre}" está FINALIZADA?\n\n` +
        `[Aceptar] = ✅ Sí, está lista\n` +
        `[Cancelar] = ⏳ No, sigue pendiente`
    );

    // --- PASO C: Actualizar Array (Lógica) ---
    work = work.map(t => {
        if (t.id === idParaModificar) {
            return { 
                ...t, 
                name: nuevoNombre.trim(), 
                completada: estaCompletada // Guardamos el true/false
            };
        }
        return t;
    });

    // --- PASO D: Actualizar DOM (Visual) ---
    const spanTexto = document.getElementById(`task-text-${idParaModificar}`);
    
    // 1. Cambiamos el texto
    spanTexto.innerHTML = `<strong>${nuevoNombre.trim()}</strong>`;

    // 2. Cambiamos el estilo según si está completada o no
    if (estaCompletada) {
        spanTexto.classList.add('tarea-completada'); // Agrega el tachado
    } else {
        spanTexto.classList.remove('tarea-completada'); // Quita el tachado
    }

    console.log("Tarea actualizada:", work);
}


// --- DELETE (Eliminar) ---
function eliminarTarea(idParaBorrar, botonElemento) {
    // Confirmación antes de borrar
    const confirmar = confirm("¿Estás seguro de eliminar esta tarea?");
    
    if (!confirmar) {
        return;
    }

    // 1. Borrar del Array (Lógica)
    work = work.filter(task => task.id !== idParaBorrar);
    
    // 2. Borrar del DOM (Visual)
    botonElemento.parentElement.remove();
    
    console.log("Elemento eliminado. Quedan:", work);
}

// --- READ (Buscar) - Función de ejemplo ---
function buscarTarea(idBuscado) {
    const searchWork = work.find(t => t.id === idBuscado);
    console.log("Tarea encontrada:", searchWork);
}
