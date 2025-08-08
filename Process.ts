export class Process {
  pid: number;
  name: string;
  memoryRequired: number;
  totalPhases: number;
  currentPhase: number = 0;
  startTime?: number;

  constructor(pid: number, name: string | null, memoryRequired: number, totalPhases: number) {
    this.pid = pid;
    this.name = name || `Proceso-${pid}`;
    this.memoryRequired = memoryRequired;
    this.totalPhases = totalPhases;
  }

  isCompleted(): boolean {
    return this.currentPhase >= this.totalPhases;
  }
}