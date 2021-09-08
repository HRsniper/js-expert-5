import { describe, expect, jest, test } from "@jest/globals";
import { Routes } from "../../src/routes.js";
import { FileHelper } from "../../src/fileHelper.js";

describe("#Routes tests suite", () => {
  const defaultParams = {
    request: {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      method: "",
      body: {}
    },
    response: {
      setHeader: jest.fn(),
      writeHead: jest.fn(),
      end: jest.fn()
    },
    values: () => Object.values(defaultParams)
  };

  describe("#setSocketInstance", () => {
    test("ensure setSocketInstance should store io instance", () => {
      const routes = new Routes();

      const ioObj = {
        to: (id) => ioObj,
        emit: (event, message) => {}
      };

      routes.setSocketInstance(ioObj);
      expect(routes.io).toStrictEqual(ioObj);
    });
  });

  describe("#defaultRoute", () => {
    test.todo("WAIT TEST");
  });

  describe("#options", () => {
    test.todo("WAIT TEST");
  });

  describe("#post", () => {
    test.todo("WAIT TEST");
  });

  describe("#get", () => {
    test("ensure that the GET method is provided it should list all downloaded files", async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams
      };

      const filesStatusMock = [
        {
          size: "33.4 kB",
          lastModified: "2021-09-12T17:48:05.624Z",
          owner: "mock_owner",
          file: "file.png"
        }
      ];
      jest.spyOn(routes.fileHelper, routes.fileHelper.getFilesStatus.name).mockResolvedValue(filesStatusMock);

      params.request.method = "GET";
      await routes.handler(...params.values());

      expect(params.response.writeHead).toHaveBeenCalledWith(200);
      expect(params.response.end).toHaveBeenCalledWith(JSON.stringify(filesStatusMock));
    });
  });

  describe("#handler", () => {
    test("ensure that the given route does not exist it should choose default route", async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams
      };
      params.request.method = "inexistent";

      await routes.handler(...params.values());
      expect(params.response.end).toHaveBeenCalledWith("defaultRoute");
    });

    test("ensure it should set any request with CORS enabled", async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams
      };
      params.request.method = "inexistent";

      await routes.handler(...params.values());
      expect(params.response.setHeader).toHaveBeenCalledWith("Access-Control-Allow-Origin", "*");
    });

    test("ensure that the OPTIONS method provided must choose the options route", async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams
      };
      params.request.method = "OPTIONS";

      await routes.handler(...params.values());
      expect(params.response.writeHead).toHaveBeenCalledWith(204);
      expect(params.response.end).toHaveBeenCalled();
    });

    test("ensure that the POST method provided must choose the post route", async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams
      };

      params.request.method = "POST";
      jest.spyOn(routes, routes.post.name).mockResolvedValue();

      await routes.handler(...params.values());
      expect(routes.post).toHaveBeenCalled();
    });

    test("ensure that the GET method provided must choose the get route", async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams
      };
      params.request.method = "GET";
      jest.spyOn(routes, routes.get.name).mockResolvedValue();

      await routes.handler(...params.values());
      expect(routes.get).toHaveBeenCalled();
    });
  });
});
