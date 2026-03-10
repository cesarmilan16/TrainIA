import dotenv from "dotenv";
dotenv.config();

import "./db/init.js";
import app from "./app.js";

if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

function validateEnv() {
  const errors = [];

  const port = Number(process.env.PORT ?? 3000);
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    errors.push("PORT debe ser un entero entre 1 y 65535");
  }

  if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_API_KEY.trim()) {
    errors.push("Falta OPENAI_API_KEY en variables de entorno");
  }

  if (errors.length) {
    console.error("Configuración inválida:");
    for (const e of errors) console.error(`- ${e}`);
    process.exit(1);
  }

  return port;
}

const PORT = validateEnv();

// Servidor
app.listen(PORT, () => {
    console.log(`El servidor se esta escuchando por: http://localhost:${PORT}`);
});
