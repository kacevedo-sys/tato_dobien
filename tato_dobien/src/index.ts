import readline from 'readline';
import { Process } from './Process';
import { MemoryManager } from './MemoryManager';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const manager = new MemoryManager();
let processCounter = 1;
const pendingProcesses: Process[] = [];

function mostrarMenu() {
  console.log(`\n=== Simulador de Procesos en Memoria ===`);
  console.log(`1. Agregar nuevo proceso`);
  console.log(`2. Ejecutar procesos`);
  console.log(`3. Ver estado de memoria`);
  console.log(`4. Salir`);
  rl.question(`Seleccione una opción: `, manejarOpcion);
}

function manejarOpcion(opcion: string) {
  switch (opcion.trim()) {
    case '1':
      agregarProceso();
      break;
    case '2':
      ejecutarProcesos();
      break;
    case '3':
      manager.memoryStatus();
      mostrarMenu();
      break;
    case '4':
      console.log("👋 Saliendo del programa.");
      rl.close();
      break;
    default:
      console.log("⚠️ Opción inválida.");
      mostrarMenu();
      break;
  }
}

function agregarProceso() {
  rl.question('Nombre del proceso (Enter para autogenerar): ', nombre => {
    rl.question('Memoria requerida (MB): ', memoriaStr => {
      rl.question('Cantidad de fases (cada fase = 1s): ', fasesStr => {
        const memoria = parseInt(memoriaStr);
        const fases = parseInt(fasesStr);

        if (isNaN(memoria) || isNaN(fases)) {
          console.log('❌ Entrada inválida. Intente de nuevo.');
          mostrarMenu();
          return;
        }

        const proceso = new Process(processCounter++, nombre || null, memoria, fases);
        pendingProcesses.push(proceso);
        console.log(`✅ Proceso agregado: ${proceso.name}`);
        mostrarMenu();
      });
    });
  });
}


function ejecutarProcesos() {
  if (pendingProcesses.length === 0) {
    console.log("⚠️ No hay procesos pendientes para ejecutar.");
    mostrarMenu();
    return;
  }

  console.log(`🚀 Ejecutando ${pendingProcesses.length} procesos...`);
  pendingProcesses.forEach(p => manager.addProcess(p));
  pendingProcesses.length = 0;

  // Verificar cada 1.5s si todos han terminado
  const checkInterval = setInterval(() => {
    if (manager.runningProcesses.length === 0 && manager.queue.length === 0) {
      clearInterval(checkInterval);
      console.log("✅ Todos los procesos han finalizado.");
      mostrarMenu(); // Mostrar menú recién aquí
    }
  }, 1500);


  // Monitoreo de estado
  const intervalo = setInterval(() => {
    manager.memoryStatus();
    if (manager.runningProcesses.length === 0 && manager.queue.length === 0) {
      clearInterval(intervalo);
      console.log("✅ Todos los procesos han finalizado.");
    }
  }, 3000);
}

mostrarMenu();
