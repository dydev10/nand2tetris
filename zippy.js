import fs from 'fs';
import archiver from 'archiver';

const COURSE_DIR = 'course';
const directoryFiles = fs.readdirSync(`./${COURSE_DIR}`);

const zipProjectFolder = (project) => {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });
    const outputZip = fs.createWriteStream(`./${COURSE_DIR}/${project}.zip`);
    const projectFiles = fs.readdirSync(`./${COURSE_DIR}/${project}`);
    archive.on('close', () => {
      console.log('Zip files created for:', project, projectFiles);
      resolve();
    });
    archive.on('error', () => {
      console.log('Error when zipping project:', project);
      reject();
    });
    archive.pipe(outputZip);
    archive.directory(`./${COURSE_DIR}/${project}/`, false);
    archive.finalize();
  });
};

const createZip = async () => {
  await Promise.all(directoryFiles.map((filename) => {
    const fileStats = fs.statSync(`./${COURSE_DIR}/${filename}`);
    if (fileStats.isDirectory()) {
      return zipProjectFolder(filename);
    } else return null;
  }));
}

createZip().then(() => {
  console.log('|---= ZIPPED ----|');
  return;
});
