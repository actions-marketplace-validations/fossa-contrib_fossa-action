import * as core from "@actions/core";
import * as github from "@actions/github";
import * as tc from "@actions/tool-cache";

import { GITHUB_TOKEN } from "./constants";

const octokit = github.getOctokit(GITHUB_TOKEN);

function getPlatform() {
  switch (process.platform) {
    case "win32":
      return "windows_amd64";
    case "darwin":
      return "darwin_amd64";
    default:
      return "linux_amd64";
  }
}

async function getLatestRelease() {
  const {
    data: { assets, tag_name: version },
  } = await octokit.rest.repos.getLatestRelease({
    owner: "fossas",
    repo: "fossa-cli",
  });

  const [{ browser_download_url: browserDownloadUrl }] = assets.filter(
    (asset) => {
      const platform = getPlatform();
      return asset.browser_download_url.includes(platform);
    }
  );

  return { version, browserDownloadUrl };
}

async function extract(cliDownloadedPath: string) {
  if (process.platform === "win32") {
    const cliExtractedPath = await tc.extractZip(cliDownloadedPath);
    return cliExtractedPath;
  } else {
    const cliExtractedPath = await tc.extractTar(cliDownloadedPath);
    return cliExtractedPath;
  }
}

export async function acquireFossaCli(): Promise<void> {
  const { browserDownloadUrl, version } = await getLatestRelease();
  const platform = getPlatform();
  const cachedPath = tc.find("fossa-cli", version, platform);

  if (cachedPath === "") {
    const downloadedPath = await tc.downloadTool(browserDownloadUrl);
    const extractedPath = await extract(downloadedPath);
    const cachedPath = await tc.cacheDir(
      extractedPath,
      "fossa-cli",
      version,
      platform
    );
    core.addPath(cachedPath);
  } else {
    core.addPath(cachedPath);
  }
}
