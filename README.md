# FOCO Dev

Repositorio coordinador del entorno de desarrollo de FOCO.

Este repositorio **no contiene el codigo de las aplicaciones**. Los proyectos
siguen viviendo en repositorios independientes, con sus propias ramas, PRs,
revisiones y despliegues. `foco.dev` solo automatiza la preparacion y ejecucion
local del conjunto.

## Repositorios coordinados

| Proyecto local | Responsabilidad | Repositorio |
| --- | --- | --- |
| `foco.backend` | API y logica de servidor | `ImaaValenzuela/foco.backend` |
| `foco.frontend` | Aplicacion web | `ImaaValenzuela/foco.frontend` |
| `foco.landing` | Landing comercial | `ImaaValenzuela/mente.landing` |
| `foco.app` | Aplicacion movil Expo | `ImaaValenzuela/foco.app` |
| `foco.admin` | Panel administrativo | `ImaaValenzuela/mente.admin` |

Las URLs y ramas se configuran en [`config/repos.mjs`](./config/repos.mjs).

## Requisitos

- Git con acceso SSH a GitHub.
- Node.js LTS y npm.
- Expo Go si se trabaja con la aplicacion movil.
- Acceso a los servicios requeridos por el backend, como Supabase.

Si todavía no tienes configurado GitHub por SSH, sigue la [guía de acceso SSH
a GitHub](./docs/acceso-ssh-github.md#1-comprobar-si-ya-existe-una-clave).

## Primera instalacion

Clonar solamente este repositorio:

```bash
git clone git@github.com:ImaaValenzuela/foco.dev.git
cd foco.dev
npm install
npm run setup
```

`npm run setup` crea `.workspace/`, clona cada repositorio y ejecuta `npm install`
en cada proyecto. La carpeta `.workspace/` esta ignorada por Git y no debe
subirse al repositorio coordinador.

Cada proyecto puede requerir variables de entorno. Copiar sus archivos de
ejemplo dentro del proyecto correspondiente:

```bash
cp .workspace/foco.backend/.env.example .workspace/foco.backend/.env
cp .workspace/foco.app/.env.example .workspace/foco.app/.env.local
```

Completar los valores reales sin subirlos a GitHub.

## Comandos principales

```bash
npm run dev       # Levanta todos los proyectos configurados
npm run update    # Hace pull e instala dependencias en todos
npm run status    # Muestra la rama y cambios de cada repositorio
```

También se puede levantar un solo proyecto:

```bash
npm run dev:backend
npm run dev:frontend
npm run dev:landing
npm run dev:app
npm run dev:admin
```

Si un proyecto no tiene un script compatible, hay que corregir su propio
`package.json` o quitarlo temporalmente del comando global `dev`.

## Flujo de trabajo

El codigo siempre se modifica dentro del repositorio responsable, nunca en la
raiz de `foco.dev`.

Ejemplo para backend:

```bash
cd .workspace/foco.backend
git checkout main
git pull --ff-only origin main
git checkout -b feature/login
# realizar cambios
git add .
git commit -m "feat(auth): agregar login"
git push -u origin feature/login
```

La PR se crea **solo en `foco.backend`**. Luego de la aprobacion y el merge:

```bash
cd ../..
```

No se crea una segunda PR en `foco.dev` por cambios de backend, frontend,
landing, mobile o admin.

## Cuando modificar `foco.dev`

Este repositorio recibe PRs solamente cuando cambia la coordinacion del
entorno, por ejemplo:

- Se agrega o elimina un repositorio.
- Cambia una URL o la rama base.
- Se agrega un comando global.
- Cambian puertos o requisitos locales.
- Se incorporan servicios compartidos, Docker o scripts de inicializacion.

## Trabajo que cruza varios repositorios

Una funcionalidad que afecta varias aplicaciones usa una issue comun y una PR
por repositorio. Por ejemplo:

```text
Issue #42: implementar login
PR foco.backend #18
PR foco.frontend #27
PR foco.app #11
```

Cada PR debe referenciar la issue y explicar dependencias o el orden de merge.

## Reglas importantes

- No ejecutar `git add .` desde la raiz para intentar guardar cambios de las
  aplicaciones.
- No modificar manualmente carpetas fuera de `.workspace/` esperando que se
  actualicen en el entorno del equipo.
- No subir `.env`, `.env.local` ni `node_modules`.
- No hacer commits de codigo de una aplicacion en `foco.dev`.
- Si se agrega un repositorio, actualizar `config/repos.mjs`, el README y los
  scripts necesarios mediante una PR en este repositorio.
