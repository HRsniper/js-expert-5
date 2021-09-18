import { afterAll, beforeAll, describe, expect, jest, test } from "@jest/globals";
import FormData from "form-data";
import fs from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { logger } from "../../src/logger.js";
import { TestUtil } from "../util/testUtil.js";
import { Routes } from "./../../src/routes.js";
// import { FileHelper } from "../../src/fileHelper.js";

describe("#Routes integration test suite", () => {
  let defaultDownloadsFolder = "";

  beforeAll(async () => {
    defaultDownloadsFolder = await fs.promises.mkdtemp(join(tmpdir(), "downloads-"));
  });

  afterAll(async () => {
    await fs.promises.rm(defaultDownloadsFolder, { recursive: true });
  });

  beforeEach(() => {
    jest.spyOn(logger, "info").mockImplementation();
  });

  describe("#getFileStatus", () => {
    const ioObj = {
      to: (id) => ioObj,
      emit: (event, message) => {}
    };

    test("ensure that you upload the file to the folder", async () => {
      const filename = "ssl-problem.png";
      const fileStream = fs.createReadStream(`./test/integration/mocks/${filename}`);
      const response = TestUtil.generateWritableStream(() => {});

      const form = new FormData();
      form.append("photo", fileStream);

      const defaultParams = {
        request: Object.assign(form, {
          headers: form.getHeaders(),
          method: "POST",
          url: "?socketId=10"
        }),

        response: Object.assign(response, {
          setHeader: jest.fn(),
          writeHead: jest.fn(),
          end: jest.fn()
        }),
        values: () => Object.values(defaultParams)
      };

      const routes = new Routes(defaultDownloadsFolder);
      routes.setSocketInstance(ioObj);
      const dirBeforeRan = await fs.promises.readdir(defaultDownloadsFolder);
      expect(dirBeforeRan).toEqual([]);
      await routes.handler(...defaultParams.values());
      const dirAfterRan = await fs.promises.readdir(defaultDownloadsFolder);
      expect(dirAfterRan).toEqual([filename]);

      expect(defaultParams.response.writeHead).toHaveBeenCalledWith(200);
      const expectedResult = JSON.stringify({ result: "Files uploaded with success!" });
      expect(defaultParams.response.end).toHaveBeenCalledWith(expectedResult);
    });
  });
});
