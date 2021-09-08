import fs from "fs";
import prettyBytes from "pretty-bytes";

class FileHelper {
  static async getFilesStatus(downloadsFolder) {
    const currentFiles = await fs.promises.readdir(downloadsFolder);
    const status = await Promise.all(
      currentFiles.map((file) => fs.promises.stat(`${downloadsFolder}/${file}`))
    );

    const filesStatus = [];
    for (const fileIndex in currentFiles) {
      const { birthtime, size } = status[fileIndex];

      filesStatus.push({
        size: prettyBytes(size),
        file: currentFiles[fileIndex],
        lastModified: birthtime,
        owner: process.env.USER
      });
    }

    return filesStatus;
  }
}

export { FileHelper };
