declare type Config = {
  name?: string;
  snapshotsDir?: string;
  ignoreAnsi?: boolean;
}

export default function snap(stdout: string, name?: string, config?: Config): Promise<void>;