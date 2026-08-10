import { join } from "node:path";
import { repositories } from "../config/repos.mjs";
import { run } from "./utils.mjs";

for (const repository of repositories) {
  const cwd = join(process.cwd(), ".workspace", repository.name);
  console.log(`\n--- ${repository.name} ---`);
  await run("git", ["status", "--short", "--branch"], { cwd });
}
