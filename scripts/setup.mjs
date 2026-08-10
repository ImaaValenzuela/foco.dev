import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { repositories } from "../config/repos.mjs";
import { run } from "./utils.mjs";

const workspace = join(process.cwd(), ".workspace");
await mkdir(workspace, { recursive: true });

for (const repository of repositories) {
  const destination = join(workspace, repository.name);

  if (existsSync(destination)) {
    console.log(`${repository.name}: ya existe, se omite el clone.`);
    continue;
  }

  await run("git", ["clone", "--branch", repository.branch, repository.url, destination]);
  await run("npm", ["install"], { cwd: destination });
}

console.log("\nWorkspace preparado. Ejecuta `npm run dev` para levantar los proyectos.");
