import QRCode from "qrcode";
import path from "node:path";
import { fileURLToPath } from "node:url";

const url = process.env.ORDER_URL || "http://localhost:3000/order";
const outPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "qr.png",
);

await QRCode.toFile(outPath, url, { width: 512, margin: 2 });
console.log(`QR code for ${url} written to ${outPath}`);
