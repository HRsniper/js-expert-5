import { describe, expect, jest, test } from "@jest/globals";
import fs from "fs";
import { FileHelper } from "../../src/fileHelper.js";
// import { Routes } from "./../../src/routes.js";

describe("#FileHelper tests suite", () => {
  describe("#getFileStatus", () => {
    test("ensure that it must return status files in the correct format", async () => {
      const statMock = {
        dev: 2796603775,
        mode: 33206,
        nlink: 1,
        uid: 0,
        gid: 0,
        rdev: 0,
        blksize: 4096,
        ino: 844424930497854,
        size: 33386,
        blocks: 72,
        atimeMs: 1631468963708.7715,
        mtimeMs: 1631147674761.1978,
        ctimeMs: 1631147674780.1992,
        birthtimeMs: 1631468885624.4978,
        atime: "2021-09-12T17:49:23.709Z",
        mtime: "2021-09-09T00:34:34.761Z",
        ctime: "2021-09-09T00:34:34.780Z",
        birthtime: "2021-09-12T17:48:05.624Z"
      };

      const mockUser = "mock_owner";
      process.env.USER = mockUser;
      const filename = "file.png";

      jest.spyOn(fs.promises, fs.promises.readdir.name).mockResolvedValue([filename]);
      jest.spyOn(fs.promises, fs.promises.stat.name).mockResolvedValue(statMock);

      const result = await FileHelper.getFilesStatus("/tmp");

      const expectedResult = [
        {
          size: "33.4 kB",
          lastModified: statMock.birthtime,
          owner: mockUser,
          file: filename
        }
      ];

      expect(fs.promises.stat).toHaveBeenCalledWith(`/tmp/${filename}`);
      expect(result).toMatchObject(expectedResult);
    });
  });
});
