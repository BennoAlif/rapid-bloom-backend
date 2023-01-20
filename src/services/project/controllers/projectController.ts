import {Prisma, PrismaClient} from '@prisma/client';
import httpCodes from '@/utils/response/httpCodes';
import {ProjectModel} from '@/utils/types';
import {Request, Response} from 'express';
import response from '@/utils/response';
import logger from '@/utils/logger';
import projectQueue from './queue';
import {z} from 'zod';
import pm2 from 'pm2';

const prisma = new PrismaClient();

const create = async (req: Request, res: Response) => {
  try {
    const projectInput = ProjectModel.parse(req.body);

    const newProject = await prisma.project.create({
      data: projectInput,
    });
    await projectQueue.createNewProject(newProject);

    return response(res, httpCodes.CREATED, 'New project created', newProject);
  } catch (error: any) {
    logger.error(error.message);
    if (error instanceof z.ZodError) {
      return response(
        res,
        httpCodes.BAD_REQUEST,
        'Validation Error',
        null,
        error.issues
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2022: Unique constraint failed
      // Prisma error codes: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
      if (error.code === 'P2002') {
        return response(
          res,
          httpCodes.CONFLICT,
          'The project name already exists',
          null
        );
      }
    }

    return response(res, httpCodes.INTERNAL_SERVER_ERROR, error.message, null);
  }
};

const findAll = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany();

    return response(
      res,
      httpCodes.OK,
      'Success getting all projects',
      projects
    );
  } catch (error: any) {
    logger.error(error.message);
    return response(res, httpCodes.INTERNAL_SERVER_ERROR, error.message, null);
  }
};

const runProject = async (req: Request, res: Response) => {
  try {
    const {name} = req.params;
    const project = await prisma.project.findUniqueOrThrow({
      where: {name},
    });
    pm2.connect(() => {
      pm2.start(
        {
          name: project.name,
          script: 'yarn',
          args: ['develop'],
          interpreter: 'bash',
          cwd: `/home/benno/projects/${project.name}`,
        },
        err => {
          if (err) {
            console.log(err);
          }
          pm2.disconnect();
        }
      );
    });

    return response(res, httpCodes.OK, 'Project is running', project);
  } catch (error: any) {
    logger.error(error.message);
    return response(res, httpCodes.INTERNAL_SERVER_ERROR, error.message, null);
  }
};

export default {create, findAll, runProject};
