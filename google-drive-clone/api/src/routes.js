import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { FileHelper } from "./fileHelper.js";
import { logger } from "./logger.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const defaultDownloadsFolder = resolve(__dirname, "../", "downloads");
class Routes {
  io;

  constructor(downloadsFolder = defaultDownloadsFolder) {
    this.downloadsFolder = downloadsFolder;
    this.fileHelper = FileHelper;
  }

  setSocketInstance(io) {
    this.io = io;
  }

  async defaultRoute(request, response) {
    response.end("defaultRoute");
  }

  async options(request, response) {
    response.writeHead(204);
    response.end();
  }

  async post(request, response) {
    logger.info("post");
    response.end();
  }

  async get(request, response) {
    const files = await this.fileHelper.getFilesStatus(this.downloadsFolder);
    response.writeHead(200);
    response.end(JSON.stringify(files));
  }

  handler(request, response) {
    // set cors
    response.setHeader("Access-Control-Allow-Origin", "*");

    // this.post || this.get || this.options || this.defaultRoute
    const chosen = this[request.method.toLowerCase()] || this.defaultRoute;

    /*
     * modifies the 'this' from 'handler' to the 'this' of the 'Routes' class,
     * getting all its methods and passing the arguments through the array
     */
    return chosen.apply(this, [request, response]);
  }
}

export { Routes };
