import { spawnSync } from "node:child_process";
import { mkdtemp, readdir, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { delimiter, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(import.meta.url);
const tests = (await readdir(join(root, "tests"))).filter((file) => file.endsWith(".test.ts")).sort();
if (tests.length === 0) throw new Error("No tests/*.test.ts files found.");

const output = await mkdtemp(join(tmpdir(), "pokedex-tests-"));
function run(args, env = process.env) {
  const result = spawnSync(process.execPath, args, { cwd: root, env, stdio: "inherit" });
  if (result.error) throw result.error;
  return result.status ?? 1;
}

try {
  process.exitCode = run([
    require.resolve("typescript/bin/tsc"),
    "--module", "commonjs", "--moduleResolution", "node", "--target", "ES2020",
    "--esModuleInterop", "--skipLibCheck", "--rootDir", root, "--outDir", output,
    ...tests.map((file) => join(root, "tests", file)),
  ]);
  if (process.exitCode === 0) {
    process.exitCode = run([
      "--test", ...tests.map((file) => join(output, "tests", file.replace(/\.ts$/, ".js"))),
    ], {
      ...process.env,
      // Compiled modules live outside the project but still need its dependencies.
      NODE_PATH: [join(root, "node_modules"), process.env.NODE_PATH].filter(Boolean).join(delimiter),
    });
  }
} finally {
  await rm(output, { recursive: true, force: true });
}
