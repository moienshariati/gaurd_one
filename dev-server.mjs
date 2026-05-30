import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || process.argv[2] || 4173);

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jsx": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png"
};

function resolvePath(url) {
  const pathname = decodeURIComponent(new URL(url, `http://localhost:${port}`).pathname);
  const target = pathname === "/" ? "/index.html" : pathname;
  const file = resolve(join(root, normalize(target)));
  return file.startsWith(root) ? file : null;
}

createServer((req, res) => {
  let file = resolvePath(req.url || "/");
  if (!file || !existsSync(file) || statSync(file).isDirectory()) {
    file = join(root, "index.html");
  }

  res.writeHead(200, {
    "Content-Type": types[extname(file)] || "application/octet-stream",
    "X-Content-Type-Options": "nosniff"
  });
  createReadStream(file).pipe(res);
}).listen(port, () => {
  console.log(`ViperOne preview running at http://localhost:${port}`);
});
