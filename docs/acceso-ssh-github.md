# Acceso SSH a GitHub

Esta guía configura el acceso SSH necesario para clonar y subir cambios a los
repositorios de FOCO sin introducir la contraseña en cada operación.

Desde `foco.dev`, `npm run config` automatiza los pasos locales: reutiliza la
clave Ed25519 existente o crea una nueva, muestra la clave pública y prueba la
conexión. La incorporación de la clave en GitHub sigue requiriendo confirmación
manual desde [SSH and GPG keys](https://github.com/settings/keys).

## 1. Comprobar si ya existe una clave

En una terminal ejecuta:

```bash
ls ~/.ssh
```

Si aparecen archivos como `id_ed25519` e `id_ed25519.pub`, puedes reutilizar
esa clave y continuar en el apartado 3.

## 2. Crear una clave SSH

Ejecuta:

```bash
ssh-keygen -t ed25519 -C "tu-correo-de-github@example.com"
```

Presiona Enter para aceptar la ubicación sugerida. Se recomienda agregar una
frase de seguridad cuando la solicite.

En Windows, este comando puede ejecutarse desde Git Bash o PowerShell si Git
está instalado.

## 3. Copiar la clave pública

Linux:

```bash
cat ~/.ssh/id_ed25519.pub
```

macOS:

```bash
pbcopy < ~/.ssh/id_ed25519.pub
```

Windows PowerShell:

```powershell
Get-Content ~/.ssh/id_ed25519.pub | Set-Clipboard
```

Si usaste `cat`, copia manualmente todo el texto que comienza con `ssh-ed25519`.
Nunca compartas el archivo `id_ed25519` sin la extensión `.pub`.

## 4. Agregar la clave en GitHub

1. Ingresa a [GitHub](https://github.com).
2. Abre tu foto de perfil y entra en **Settings**.
3. Selecciona **SSH and GPG keys**.
4. Haz clic en **New SSH key**.
5. En **Title**, escribe algo reconocible, por ejemplo `Laptop personal`.
6. En **Key**, pega el contenido de `id_ed25519.pub`.
7. Haz clic en **Add SSH key**.

## 5. Probar la conexión

```bash
ssh -T git@github.com
```

La primera vez, confirma escribiendo `yes`. Una respuesta similar a esta
confirma que el acceso funciona:

```text
Hi TU_USUARIO! You've successfully authenticated, but GitHub does not provide shell access.
```

## 6. Verificar el repositorio de FOCO

Desde `foco.dev` ejecuta:

```bash
git remote -v
git ls-remote git@github.com:ImaaValenzuela/foco.dev.git
```

Si el segundo comando muestra referencias del repositorio, el acceso está
configurado correctamente.

## Problemas frecuentes

- **Permission denied (publickey):** la clave no fue agregada a GitHub o se
  está usando otra cuenta.
- **Repository not found:** tu cuenta no tiene permisos sobre el repositorio.
- **No such file or directory:** Git o la carpeta `.ssh` no están disponibles
  en la terminal actual.

No subas nunca `id_ed25519` a GitHub. Solo debe compartirse la clave pública
`id_ed25519.pub`.
