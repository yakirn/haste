const fs = require('fs');
const path = require('path');
const { read } = require('../src');

describe.only('haste-service-fs', () => {
  describe('read', () => {
    const resolve = (...pathParts) => path.join(__dirname, 'fixtures', ...pathParts);
    const filename = resolve('file.txt');
    const nestedFilename = resolve('nested', 'folder', 'structure', 'nested.txt');

    it('should read from a filename', async () => {
      const expected = {
        filename,
        content: fs.readFileSync(filename, 'utf8'),
        cwd: process.cwd(),
      };

      const result = await read({
        pattern: filename
      });

      expect(result).toEqual([expected]);
    });

    it('should read from a glob pattern', async () => {
      const pattern = resolve('**.*');

      const expected = {
        filename,
        content: fs.readFileSync(filename, 'utf8'),
        cwd: process.cwd(),
      };

      const result = await read({ pattern });

      expect(result).toEqual([expected]);
    });

    it('should not read directories', async () => {
      const pattern = resolve('nested', '**');

      const expected = {
        filename: nestedFilename,
        content: fs.readFileSync(nestedFilename, 'utf8'),
        cwd: process.cwd(),
      };

      const result = await read({ pattern });

      expect(result).toEqual([expected]);
    });

    it('should support passing a current working directory', async () => {
      const pattern = '**.*';
      const cwd = path.join(__dirname, 'fixtures');

      const expected = {
        filename: 'file.txt',
        content: fs.readFileSync(filename, 'utf8'),
        cwd,
      };

      const result = await read({ pattern, options: { cwd } });

      expect(result).toEqual([expected]);
    });
  });
});