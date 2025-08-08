import { Process } from "./Process";

/**
 * Clase encargada de gestionar la memoria y ejecución de procesos.
 */
export class MemoryManager {
  totalMemory: number; // Memoria total disponible (en MB)
  usedMemory: number = 0; // Memoria actualmente utilizada
  runningProcesses: Process[] = []; // Procesos que se están ejecutando
  queue: Process[] = []; // Cola de espera de procesos por falta de memoria

  constructor(totalMemory: number = 1024) {
    this.totalMemory = totalMemory; // Valor por defecto: 1024 MB (1 GB)
  }

  /**
   * Agrega un proceso al sistema. Si hay memoria suficiente, lo ejecuta;
   * si no, lo encola.
   */
  addProcess(process: Process) {
    if (this.usedMemory + process.memoryRequired <= this.totalMemory) {
      // Asignar memoria y registrar inicio
      this.usedMemory += process.memoryRequired;
      process.startTime = Date.now();
      this.runningProcesses.push(process);

      console.log(`[START] Ejecutando ${process.name} (PID: ${process.pid})`);

      // Simula la ejecución por fases cada segundo
      const interval = setInterval(() => {
        process.currentPhase++;
        this.showProgress(process); // Muestra la barra de progreso

        if (process.isCompleted()) {
          clearInterval(interval); // Finaliza la ejecución
          this.finishProcess(process); // Libera memoria y gestiona la cola
        }
      }, 1000); // Tiempo por fase: 1 segundo
    } else {
      // Memoria insuficiente, proceso encolado
      console.log(`[INFO] Memoria insuficiente para ${process.name}, encolando...`);
      this.queue.push(process);
    }
  }

  /**
   * Finaliza un proceso, libera la memoria y verifica si se pueden ejecutar
   * procesos de la cola.
   */
  finishProcess(process: Process) {
    const now = Date.now();
    const start = process.startTime ?? now;
    const elapsed = ((now - start) / 1000).toFixed(2); // Tiempo total en segundos

    console.log(`✅ Finalizó ${process.name} (PID: ${process.pid})`);
    console.log(`⏱ Tiempo total: ${elapsed}s\n`);

    // Eliminar proceso de la lista de ejecución
    this.runningProcesses = this.runningProcesses.filter(p => p.pid !== process.pid);
    // Liberar memoria
    this.usedMemory -= process.memoryRequired;
    // Verificar si hay procesos en cola que se pueden ejecutar ahora
    this.checkQueue();
  }

  /**
   * Revisa la cola de procesos y ejecuta aquellos que ahora sí caben en memoria.
   */
  checkQueue() {
    for (let i = 0; i < this.queue.length; i++) {
      const p = this.queue[i];
      if (this.usedMemory + p.memoryRequired <= this.totalMemory) {
        this.queue.splice(i, 1); // Eliminar de la cola
        this.addProcess(p); // Intentar ejecutar
        i--; // Ajustar índice por cambio en la cola
      }
    }
  }

  /**
   * Muestra el estado actual de la memoria y procesos.
   */
  memoryStatus() {
    console.log(`\n🔍 Estado de Memoria:`);
    console.log(`Memoria Total: ${this.totalMemory} MB`);
    console.log(`Memoria Usada: ${this.usedMemory} MB`);
    console.log(`Memoria Libre: ${this.totalMemory - this.usedMemory} MB`);
    console.log(`Procesos en ejecución: ${this.runningProcesses.map(p => p.name).join(', ') || 'Ninguno'}`);
    console.log(`En cola: ${this.queue.map(p => p.name).join(', ') || 'Ninguno'}\n`);
  }

  /**
   * Muestra una barra de progreso por consola del proceso que se está ejecutando.
   * Ejemplo: 📊 [Proceso-A] (30%) |██████--------------| Fase 3/10
   */
  showProgress(process: Process) {
    const percent = Math.floor((process.currentPhase / process.totalPhases) * 100); // % completado
    const barLength = 20; // Tamaño visual de la barra
    const filled = Math.floor((percent / 100) * barLength); // Caracteres llenos
    const bar = "█".repeat(filled) + "-".repeat(barLength - filled); // Barra compuesta

    console.log(`📊 [${process.name}] (${percent}%) |${bar}| Fase ${process.currentPhase}/${process.totalPhases}`);
  }
}
