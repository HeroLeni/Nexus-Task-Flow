// 1. DEFINICIÓN (La "Base de Datos")
let work = [];

const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');

// --- CREATE (Añadir con validación de duplicados) ---
taskForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('task-name').value;
    const date = document.getElementById('task-date').value;
    const description = document.getElementById('task-description').value;
    const priority = document.getElementById('task-priority').value;

    //Validacion 1: El nombre de la tarea no debe estar vacio
    if (name == null || name.trim().length === 0) {
        alert(`⚠️ La tarea no puede estar sin nombre. Por favor elige un nombre adecuado.`);
        return; // Detiene la ejecución aquí si es duplicado
    }
    // VALIDACIÓN 2: Verificar si ya existe una tarea con ese nombre
    const existeTarea = work.find(t => t.name.toLowerCase() === name.toLowerCase());

    //Validacion 3: La descripción no debe estar vacia
    if (description == null || description.trim().length === 0) {
        alert(`⚠️ La tarea no puede estar sin descripción. Por favor ingrese una descripción adecuada.`);
        return; // Detiene la ejecución aquí si la descripción está vacia
    }
    if (existeTarea) {
        alert(`⚠️ La tarea "${name}" ya está registrada. Por favor elige otro nombre.`);
        return; // Detiene la ejecución aquí si es duplicado
    }
    //VALIDACIÓN 4: La fecha debe ser válida
    //Se convierte la fecha ingresada a un objeto Date
    const fechaIngresada = new Date(date);
    
    // Obtenemos la fecha actual sin hora (solo día/mes/año)
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Ponemos la hora en 00:00:00 para comparar solo fechas
    
    // Calculamos la fecha máxima permitida (2 años desde hoy)
    const fechaMaxima = new Date();
    fechaMaxima.setFullYear(fechaMaxima.getFullYear() + 2);
    
    // Verificamos si la fecha es anterior a hoy
    if (fechaIngresada < hoy) {
        alert(`⚠️ No puedes asignar una fecha pasada. Por favor selecciona una fecha de hoy en adelante.`);
        return; // Detiene la ejecución si la fecha es del pasado
    }
    
    // Verificamos si la fecha es mayor a 2 años en el futuro
    if (fechaIngresada > fechaMaxima) {
        alert(`⚠️ La fecha no puede ser mayor a 2 años en el futuro. Por favor selecciona una fecha razonable.`);
        return; // Detiene la ejecución si la fecha es muy lejana
    }

    // Generamos un ID único
    const newId = Date.now();

    // Creamos el objeto
    const task = {
        id: newId,
        name: name,
        date: date,
        description: description,
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
        <span style="cursor:pointer;" title="${task.description}" id="task-text-${task.id}"><strong>${task.name}</strong></span>
        <span>Fecha: ${task.date}</span>
        <span class="badge ${task.priority.toLowerCase()}">${task.priority}</span>

        <select class="form-select" style="width:20%">
            <option value="Pendiente"> Pendiente </option>
            <option value="Process"> En proceso </option>
            <option value="Finished"> Completada </option>
        </select>
        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        <button onclick="modificarTarea(${task.id})", this><i class="fa-regular fa-pen-to-square"></i></i></button>
    `;
    // Evento click para eliminar la task
    li.querySelector(".delete-btn").addEventListener("click", () => {
        const confirmar = confirm("¿Estás seguro de eliminar esta tarea?");
        if (!confirmar) return;

        // 1. Eliminar del array 'work'
        work = work.filter(t => t.id !== task.id);

        // 2. Eliminar del DOM
        li.remove();

        // Log para debug
        console.log(`Tarea "${task.name}" eliminada. Tareas restantes:`, work);
    });
    taskList.appendChild(li);
}

//UPDATE (MODIFICAR TAREA EXISTENTE)
function modificarTarea(idParaModificar) {
    // Buscamos la tarea en el array por su ID
    const tarea = work.find(t => t.id === idParaModificar);
    
    // Si no existe, salimos de la función
    if (!tarea) return;

    // Solicitamos el nuevo nombre al usuario
    const nuevoNombre = prompt("📝 Editar nombre de la tarea:", tarea.name);
    
    // Validación: Si cancela o deja el campo vacío, no hacemos nada
    if (nuevoNombre === null || nuevoNombre.trim() === "") return;

    // Validación: Verificar que el nuevo nombre no esté duplicado
    // (solo si es diferente al nombre actual)
    if (nuevoNombre.trim().toLowerCase() !== tarea.name.toLowerCase()) {
        const nombreDuplicado = work.find(t => 
            t.name.toLowerCase() === nuevoNombre.trim().toLowerCase()
        );
        
        if (nombreDuplicado) {
            alert(`⚠️ Ya existe una tarea con el nombre "${nuevoNombre}". Por favor elige otro nombre.`);
            return;
        }
    }

    // Actualizamos el nombre en el array
    tarea.name = nuevoNombre.trim();

    // Actualizamos el DOM (visual)
    const spanTexto = document.getElementById(`task-text-${idParaModificar}`);
    if (spanTexto) {
        spanTexto.innerHTML = `<strong>${nuevoNombre.trim()}</strong>`;
    }
    
    console.log("Tarea modificada:", tarea);
}

// --- READ (Buscar) - Función de ejemplo ---
function buscarTarea(idBuscado) {
    const searchWork = work.find(t => t.id === idBuscado);
    console.log("Tarea encontrada:", searchWork);
}
