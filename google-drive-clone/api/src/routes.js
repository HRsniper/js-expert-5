import { dirname, resolve } from "path";
import { pipeline } from "stream/promises";
import { fileURLToPath, parse } from "url";
import { FileHelper } from "./fileHelper.js";
import { logger } from "./logger.js";
import { UploadHandler } from "./uploadHandler.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const defaultDownloadsFolder = resolve(__dirname, "../", "downloads");

class Routes {
  constructor(downloadsFolder = defaultDownloadsFolder) {
    this.downloadsFolder = downloadsFolder;
    this.fileHelper = FileHelper;
    this.io = {};
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
    const { headers } = request;

    const {
      query: { socketId }
    } = parse(request.url, true);

    const uploadHandler = new UploadHandler({
      socketId,
      io: this.io,
      downloadsFolder: this.downloadsFolder
    });

    const onFinish = (response) => {
      return () => {
        response.writeHead(200);
        const data = JSON.stringify({ result: "Files uploaded with success!" });
        response.end(data);
      };
    };

    const busboyInstance = uploadHandler.registerEvents(headers, onFinish(response));

    await pipeline(request, busboyInstance);

    logger.info("Request finished with success!");
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
