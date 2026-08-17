import { existsSync } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { run } from "./utils.mjs";

const sshDirectory = join(homedir(), ".ssh");
const privateKey = join(sshDirectory, "id_ed25519");
const publicKey = `${privateKey}.pub`;

await mkdir(sshDirectory, { recursive: true });

if (!existsSync(privateKey) || !existsSync(publicKey)) {
  const readline = createInterface({ input, output });
  const configuredEmail = await run("git", ["config", "--get", "user.email"], {
    capture: true,
    allowFailure: true
  });
  const email = await readline.question(
    `Correo de GitHub${configuredEmail.stdout.trim() ? ` [${configuredEmail.stdout.trim()}]` : ""}: `
  );
  readline.close();

  const comment = email.trim() || configuredEmail.stdout.trim();
  if (!comment) {
    throw new Error("Se necesita un correo para crear la clave SSH.");
  }

  await run("ssh-keygen", ["-t", "ed25519", "-C", comment, "-f", privateKey]);
  console.log(`Clave SSH creada en ${privateKey}.`);
} else {
  console.log(`Ya existe una clave SSH en ${privateKey}; no se sobrescribira.`);
}

console.log("\nClave publica para agregar en GitHub:\n");
console.log((await readFile(publicKey, "utf8")).trim());
console.log(`\nAgregala en GitHub: https://github.com/settings/keys`);
console.log("Despues ejecuta `npm run config` nuevamente para probar la conexion.");

const connection = await run("ssh", ["-T", "git@github.com"], {
  allowFailure: true
});

if (connection.code === 0 || connection.code === 1) {
  console.log("\nLa conexion SSH respondio. Si viste 'successfully authenticated', ya puedes ejecutar `npm run setup`.");
} else {
  console.log("\nLa conexion SSH aun no esta lista. Agrega la clave publica a GitHub y vuelve a ejecutar `npm run config`.");
}
