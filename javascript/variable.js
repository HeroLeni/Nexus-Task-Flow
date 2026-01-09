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

    //Validacion de que el nombre de la tarea no sea vacio
    if (name == null || name.trim().length === 0) {
        alert(`⚠️ La tarea no puede estar sin nombre. Por favor elige un nombre adecuado.`);
        return; // Detiene la ejecución aquí si es duplicado
    }
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
        <button type="button" class="action-btn compelte"><i class="fa-solid fa-check"></i></button>
        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        <button onclick="modificarTarea(${task.id})", this><i class="fa-regular fa-pen-to-square"></i></i></button>
    `;

    // Evento click para eliminar la task
    li.querySelector(".delete-btn").addEventListener("click", () => {
        li.remove();
    });
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

    // --- PASO D: Actualizar DOM (Visual) ---
    const spanTexto = document.getElementById(`task-text-${idParaModificar}`);
    
    // 1. Cambiamos el texto
    spanTexto.innerHTML = `<strong>${nuevoNombre.trim()}</strong>`;
}

taskList.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;

    const id = Number(li.dataset.id);

    // ✔ Completar
    if (e.target.closest(".complete")) {
        completarTarea(id, li);
    }    

});

function completarTarea(id, li) {
    const spanTexto = li.querySelector(".task-text");
    if (!spanTexto) return;

    const estaCompletada = confirm(
        `¿La tarea está FINALIZADA?\n\nAceptar = ✅\nCancelar = ⏳`
    );

    // Actualizar array
    work = work.map(t =>
        t.id === id ? { ...t, completada: estaCompletada } : t
    );

    // Cambiar UI
    spanTexto.classList.toggle("tarea-completada", estaCompletada);

    
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
