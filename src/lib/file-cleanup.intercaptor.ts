import { Readable } from 'stream';
import { createReadStream, unlink } from 'fs';
import { join } from 'path';

export default function deleteFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    unlink(filePath, (err) => {
      if (err) {
        reject(err);
        
      } else {
        resolve();
      }
    });
  });
}
