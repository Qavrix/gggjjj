
export interface GithubContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: 'file' | 'dir';
}

export interface BotInfo {
  name: string;
  path: string;
}

export interface VersionInfo {
  name: string;
  path: string;
}

export interface ReportInfo {
  name: string;
  path: string;
  downloadUrl: string;
}
