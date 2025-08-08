// Clase que representa un proceso del sistema
export class Process {
  pid: number; // Identificador único del proceso
  name: string; // Nombre descriptivo del proceso
  memoryRequired: number; // Cantidad de memoria (en MB) que el proceso necesita para ejecutarse
  totalPhases: number; // Número total de fases que el proceso debe ejecutar
  currentPhase: number = 0; // Fase actual del proceso (inicia en 0)
  startTime?: number; // Tiempo en el que inicia el proceso (opcional)

  /**
   * Constructor del proceso
   * @param pid Identificador único del proceso
   * @param name Nombre asignado o generado automáticamente
   * @param memoryRequired Memoria necesaria en MB
   * @param totalPhases Número total de fases que durará el proceso
   */
  constructor(pid: number, name: string | null, memoryRequired: number, totalPhases: number) {
    this.pid = pid;
    this.name = name || `Proceso-${pid}`; // Si no se proporciona nombre, se genera uno por defecto
    this.memoryRequired = memoryRequired;
    this.totalPhases = totalPhases;
  }

  /**
   * Verifica si el proceso ya completó todas sus fases
   * @returns true si el proceso finalizó, false si aún está en ejecución
   */

  isCompleted(): boolean {
    return this.currentPhase >= this.totalPhases;
  }
}
