import express from "express";
import cookieParser from 'cookie-parser'
import path from "path";
import http from "http";
import https from "https";
import fs from "fs";
import { fileURLToPath } from "url";
import routes from "./routes";

const router = express.Router()

routes(router)

const app = express();

app.use(cookieParser())

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static("public"));
app.use("/css", express.static(`${__dirname}/public/css`));
app.use("/images", express.static(`${__dirname}/public/images`));
app.use("/js", express.static(`${__dirname}/public/js`));

app.set("views", "./src/views");
app.set("view engine", "ejs");

app.use("/", router);

let server;
let link;

const createServerConfig = {
  http: () => {
    server = http.createServer(app);
    server.listen(5000);
    link = "http://localhost:5000";
  },
  // run https if you need MetaMask (crypto wallet) enabled
  https: () => {
    server = https.createServer(
      {
        key: fs.readFileSync("./ssl/client-key.pem"),
        cert: fs.readFileSync("./ssl/client-cert.pem"),
      },
      app
    );
    server.listen(443);
    link = "https://localhost";
  },
};

createServerConfig.https();

server.on("error", (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
    default:
      throw error;
  }
});

server.on("listening", () => {
  const addr = server.address();
  const port = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;

  console.info(`App listening on port ${port} ${link}`);
});
