import fs from 'fs';
import archiver from 'archiver';

const TEST_DIR = 'course';
const directoryFiles = fs.readdirSync(`./${TEST_DIR}`);

const zipProjectFolder = (project) => {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });
    const outputZip = fs.createWriteStream(`./${TEST_DIR}/${project}.zip`);
    const projectFiles = fs.readdirSync(`./${TEST_DIR}/${project}`);
    archive.on('close', () => {
      console.log('Zip files created for:', project, projectFiles);
      resolve();
    });
    archive.on('error', () => {
      console.log('Error when zipping project:', project);
      reject();
    });
    archive.pipe(outputZip);
    archive.directory(`./${TEST_DIR}/${project}/`, false);
    archive.finalize();
  });
};

const createZip = async () => {
  await Promise.all(directoryFiles.map((filename) => {
    const fileStats = fs.statSync(`./${TEST_DIR}/${filename}`);
    if (fileStats.isDirectory()) {
      return zipProjectFolder(filename);
    } else return null;
  }));
}

createZip().then(() => {
  console.log('|---= ZIPPED ----|');
  return;
});
