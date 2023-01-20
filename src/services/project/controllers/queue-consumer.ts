import cmd from '@/utils/cmd';
import {Job} from 'bull';
// const sleep = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));
const queueProcess = async (job: Job) => {
  // await sleep(30000);
  await cmd(
    'bash',
    '-c',
    `cd projects;npx create-strapi-app@latest ${
      job.data.name
    } --dbclient=${job.data.dbClient.toLowerCase()} --dbhost=${
      job.data.dbHost
    } --dbport=${job.data.dbPort} --dbname=${job.data.dbName} --dbusername=${
      job.data.dbUsername
    } --dbpassword=${job.data.dbPassword} --dbssl=${
      job.data.sslCon === true ? 'yes' : 'no'
    } --no-run;`
  );

  return Promise.resolve(`job ${job.id} complete!`);
};

const runningProjectProcess = async (job: Job) => {
  await cmd('bash', '-c', 'cd ./projects/my-blog; npm run develop');

  return Promise.resolve(`job ${job.id} complete!`);
};

export default {queueProcess, runningProjectProcess};
