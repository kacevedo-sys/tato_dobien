// Importamos el módulo readline para leer entradas del usuario desde la consola
import readline from 'readline';

// Importamos nuestras clases definidas localmente
import { Process } from './Process'; // Clase que representa un proceso individual
import { MemoryManager } from './MemoryManager'; // Clase que gestiona la memoria RAM y los procesos

// Creamos una interfaz para entrada/salida por consola
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Instanciamos el administrador de memoria
const manager = new MemoryManager();

// Contador para asignar ID únicos a cada proceso
let processCounter = 1;

// Lista de procesos en espera de ser ejecutados
const pendingProcesses: Process[] = [];

// Muestra el menú principal en consola
function mostrarMenu() {
  console.log(`\n=== Simulador de Procesos en Memoria ===`);
  console.log(`1. Agregar nuevo proceso`);
  console.log(`2. Ejecutar procesos`);
  console.log(`3. Ver estado de memoria`);
  console.log(`4. Salir`);
  rl.question(`Seleccione una opción: `, manejarOpcion);
}

// Procesa la opción ingresada por el usuario
function manejarOpcion(opcion: string) {
  switch (opcion.trim()) {
    case '1':
      agregarProceso(); // Permite crear un nuevo proceso
      break;
    case '2':
      ejecutarProcesos(); // Ejecuta todos los procesos en espera
      break;
    case '3':
      manager.memoryStatus(); // Muestra la RAM y el estado de los procesos
      mostrarMenu();
      break;
    case '4':
      console.log("👋 Saliendo del programa.");
      rl.close(); // Finaliza la ejecución
      break;
    default:
      console.log("⚠️ Opción inválida.");
      mostrarMenu();
      break;
  }
}

// Permite al usuario agregar un nuevo proceso mediante inputs
function agregarProceso() {
  rl.question('Nombre del proceso (Enter para autogenerar): ', nombre => {
    rl.question('Memoria requerida (MB): ', memoriaStr => {
      rl.question('Cantidad de fases (cada fase = 1s): ', fasesStr => {
        const memoria = parseInt(memoriaStr);
        const fases = parseInt(fasesStr);

        // Validación básica de memoria.
        if (isNaN(memoria) || isNaN(fases)) {
          console.log('❌ Entrada inválida. Intente de nuevo.');
          mostrarMenu();
          return;
        }

        // Validar límite de RAM
        if (memoria > 1024 || memoria <= 0) {
          console.log('❌ La memoria requerida debe ser mayor a 0 y no superar 1024 MB.');
          mostrarMenu();
          return;
        }

        // Crear y agregar el proceso a pendientes
        const proceso = new Process(processCounter++, nombre || null, memoria, fases);
        pendingProcesses.push(proceso);
        console.log(`✅ Proceso agregado: ${proceso.name}`);
        mostrarMenu();
      });
    });
  });
}


// Ejecuta todos los procesos que están pendientes
function ejecutarProcesos() {
  if (pendingProcesses.length === 0) {
    console.log("⚠️ No hay procesos pendientes para ejecutar.");
    mostrarMenu();
    return;
  }

  console.log(`🚀 Ejecutando ${pendingProcesses.length} procesos...`);
  // Se agregan los procesos al administrador de memoria
  pendingProcesses.forEach(p => manager.addProcess(p));
  pendingProcesses.length = 0; // Limpiamos la lista de pendientes

  // Revisamos periódicamente si todos los procesos terminaron
  const checkInterval = setInterval(() => {
    if (manager.runningProcesses.length === 0 && manager.queue.length === 0) {
      clearInterval(checkInterval);
      console.log("✅ Todos los procesos han finalizado.");
      mostrarMenu(); // Volvemos a mostrar el menú solo al finalizar todo
    }
  }, 1500);

  // Cada cierto tiempo se imprime el estado de la memoria para ver el progreso
  const intervalo = setInterval(() => {
    manager.memoryStatus();
    if (manager.runningProcesses.length === 0 && manager.queue.length === 0) {
      clearInterval(intervalo);
      console.log("✅ Todos los procesos han finalizado.");
    }
  }, 3000);
}

// Iniciamos el programa mostrando el menú
mostrarMenu();
