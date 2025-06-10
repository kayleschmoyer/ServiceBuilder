import SFTPClient from 'ssh2-sftp-client';

export interface SftpConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  remoteDir: string;
}

export async function uploadViaSFTP(config: SftpConfig, fileName: string, data: Buffer): Promise<void> {
  const client = new SFTPClient();
  try {
    await client.connect({
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password
    });
    const remotePath = `${config.remoteDir.replace(/\/$/, '')}/${fileName}`;
    await client.put(data, remotePath);
  } finally {
    client.end();
  }
}
