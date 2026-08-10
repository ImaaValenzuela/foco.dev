import { join } from "node:path";
import { repositories } from "../config/repos.mjs";
import { run } from "./utils.mjs";

for (const repository of repositories) {
  const cwd = join(process.cwd(), ".workspace", repository.name);
  await run("git", ["pull", "--ff-only", "origin", repository.branch], { cwd });
  await run("npm", ["install"], { cwd });
}

console.log("\nRepositorios actualizados.");
