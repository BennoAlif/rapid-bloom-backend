import Queue from 'bull';
import consumer from './queue-consumer';
import {PrismaClient, Project} from '@prisma/client';

const prisma = new PrismaClient();

const queue = new Queue('projects');

const runnerQueue = new Queue('runner');

queue.process(consumer.queueProcess);
queue.on('completed', async job => {
  const id = Number(job.id);
  await prisma.project.update({
    where: {id},
    data: {
      status: 'ACTIVE',
    },
  });
});
const createNewProject = async (project: Project) => {
  await queue.add(project, {
    attempts: 2,
    jobId: project.id,
  });
};

const runProject = async (project: Project) => {
  await runnerQueue.add(project, {
    attempts: 2,
    jobId: project.id,
  });
};

runnerQueue.process(consumer.runningProjectProcess);

export default {queue, createNewProject, runProject};
