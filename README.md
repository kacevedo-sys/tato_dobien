# 🧠 Simulador de Gestión de Procesos en Memoria (TypeScript)
Este proyecto simula la gestión de procesos en un sistema operativo con una memoria RAM limitada de 1 GB. Está desarrollado en TypeScript y se ejecuta por consola, permitiendo la creación, ejecución y seguimiento de procesos que consumen memoria, imitando el comportamiento de un planificador de procesos con gestión dinámica de memoria.

---

## Características

-  Creación dinámica de procesos con nombre y tamaño de memoria.
-  Ejecución concurrente de procesos mientras haya memoria disponible.
-  Cola de espera para procesos que no pueden iniciar por falta de memoria.
-  Avance por fases con visualización gráfica del progreso.
-  Liberación automática de memoria al finalizar cada proceso.
-  Visualización de memoria total, usada y disponible.
-  Menú interactivo por consola.

---

## Tecnologías utilizadas

- **Lenguaje:** TypeScript
- **Ejecución:** Node.js
- **Gestión de dependencias:** npm
- **Estilo visual:** Uso de caracteres ASCII para progresos y estados

---

## Estructura del proyecto

├── src/

│ ├── index.ts # Punto de entrada con menú principal

│ ├── Process.ts # Clase que representa un proceso

│ ├── ProcessManager.ts# Controlador de la ejecución y cola de procesos

├── package.json

├── tsconfig.json

└── README.md


---

## ⚙️ Instalación y ejecución

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/simulador-procesos.git
cd simulador-procesos
```

# Instalar Dependencias

npm install

## Compila el código TypeScript

npx tsc

## Ejecuta el simulador

node dist/index.js


## 📸 Capturas del programa

=== Simulador de Procesos en Memoria ===
1. Agregar nuevo proceso
2. Ejecutar procesos
3. Ver estado de memoria
4. Salir
Seleccione una opción:

## Progreso de Procesos

🚀 Ejecutando 2 procesos...
[START] Ejecutando Kevin (PID: 1)

[START] Ejecutando Carlos (PID: 2)

📊 [Kevin] (5%)  |█-------------------| Fase 1/20

📊 [Carlos] (20%)|████----------------| Fase 1/5

...

✅ Todos los procesos han finalizado.
