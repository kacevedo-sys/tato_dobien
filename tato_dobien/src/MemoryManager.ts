import { Process } from "./Process";

export class MemoryManager {
  totalMemory: number;
  usedMemory: number = 0;
  runningProcesses: Process[] = [];
  queue: Process[] = [];

  constructor(totalMemory: number = 1024) {
    this.totalMemory = totalMemory;
  }

    addProcess(process: Process) {
  if (this.usedMemory + process.memoryRequired <= this.totalMemory) {
    this.usedMemory += process.memoryRequired;
    process.startTime = Date.now();
    this.runningProcesses.push(process);

    console.log(`[START] Ejecutando ${process.name} (PID: ${process.pid})`);

    const interval = setInterval(() => {
      process.currentPhase++;
      this.showProgress(process);

      if (process.isCompleted()) {
        clearInterval(interval);
        this.finishProcess(process);
      }
    }, 1000); // 1 segundo por fase
  } else {
    console.log(`[INFO] Memoria insuficiente para ${process.name}, encolando...`);
    this.queue.push(process);
  }
}



  finishProcess(process: Process) {
  const now = Date.now();
  const start = process.startTime ?? now;
  const elapsed = ((now - start) / 1000).toFixed(2);

  console.log(`✅ Finalizó ${process.name} (PID: ${process.pid})`);
  console.log(`⏱ Tiempo total: ${elapsed}s\n`);

  this.runningProcesses = this.runningProcesses.filter(p => p.pid !== process.pid);
  this.usedMemory -= process.memoryRequired;
  this.checkQueue();
}



  checkQueue() {
    for (let i = 0; i < this.queue.length; i++) {
      const p = this.queue[i];
      if (this.usedMemory + p.memoryRequired <= this.totalMemory) {
        this.queue.splice(i, 1);
        this.addProcess(p);
        i--;
      }
    }
  }

  memoryStatus() {
    console.log(`\n🔍 Estado de Memoria:`);
    console.log(`Memoria Total: ${this.totalMemory} MB`);
    console.log(`Memoria Usada: ${this.usedMemory} MB`);
    console.log(`Memoria Libre: ${this.totalMemory - this.usedMemory} MB`);
    console.log(`Procesos en ejecución: ${this.runningProcesses.map(p => p.name).join(', ')}`);
    console.log(`En cola: ${this.queue.map(p => p.name).join(', ')}\n`);
  }

  showProgress(process: Process) {
  const percent = Math.floor((process.currentPhase / process.totalPhases) * 100);
  const barLength = 20;
  const filled = Math.floor((percent / 100) * barLength);
  const bar = "█".repeat(filled) + "-".repeat(barLength - filled);

  console.log(`📊 [${process.name}] (${percent}%) |${bar}| Fase ${process.currentPhase}/${process.totalPhases}`);
}
  
}
