import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";

const root = resolve(process.cwd(), "out");
if (!existsSync(root) || !statSync(root).isDirectory()) {
  throw new Error("Static export directory 'out/' is missing. Run npm run build first.");
}

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

const server = createServer((request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
  } catch {
    response.writeHead(400).end("Bad request");
    return;
  }

  const filePath = resolve(root, `.${pathname}`);
  if (filePath !== root && !filePath.startsWith(`${root}${sep}`)) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  const candidates = [
    filePath,
    resolve(filePath, "index.html"),
    extname(filePath) ? "" : `${filePath}.html`,
  ].filter(Boolean);
  const target = candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile());

  if (!target) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("Not found");
    return;
  }

  response.writeHead(200, {
    "content-type": contentTypes[extname(target)] ?? "application/octet-stream",
    "x-content-type-options": "nosniff",
  });
  createReadStream(target).pipe(response);
});

server.listen(4173, "127.0.0.1", () => {
  console.log("Static storefront preview ready at http://127.0.0.1:4173");
});
