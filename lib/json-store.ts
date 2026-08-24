import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

function filePath(name: string) {
  return path.join(process.cwd(), "data", name);
}

export async function readJson<T>(name: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(filePath(name), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    await writeJson(name, fallback);
    return fallback;
  }
}

export async function writeJson<T>(name: string, data: T) {
  await mkdir(path.dirname(filePath(name)), { recursive: true });
  await writeFile(filePath(name), JSON.stringify(data, null, 2), "utf8");
}
