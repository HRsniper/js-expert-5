function whichPlatformBar() {
  try {
    const platform = process.platform;

    const currentDirectory = process.cwd();
    const partition = currentDirectory.substr(0, 2);

    if (platform === "win32") {
      return { bar: "\\", partition };
    }

    return { bar: "/", partition };
  } catch (error) {
    console.error(error);
    throw new Error("Unknown platform");
  }
}

export { whichPlatformBar };
