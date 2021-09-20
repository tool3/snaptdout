declare type SnapConfig = {
  name?: string;
  snapshotsDir?: string;
  ignoreAnsi?: boolean;
  formattedOutput?: boolean;
}

declare function snap(stdout: string, name?: string, config?: SnapConfig): Promise<void>

export = snap 