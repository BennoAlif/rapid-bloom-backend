import {Prisma, PrismaClient} from '@prisma/client';
import httpCodes from '@/utils/response/httpCodes';
import {ProjectModel} from '@/utils/types';
import {Request, Response} from 'express';
import response from '@/utils/response';
import logger from '@/utils/logger';
import projectQueue from './queue';
import {z} from 'zod';

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
        'validation error',
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
    const result = await projectQueue.queue.getJobs(['completed', 'active']);
    return response(res, httpCodes.OK, 'Success getting all projects', [
      ...projects,
      ...result,
    ]);
  } catch (error: any) {
    logger.error(error.message);
    return response(res, httpCodes.INTERNAL_SERVER_ERROR, error.message, null);
  }
};

const queue = async (req: Request, res: Response) => {
  try {
    await projectQueue.createNewProject(req.body);
    return response(res, httpCodes.OK, 'New project created', null);
  } catch (error: any) {
    logger.error(error.message);
    return response(res, httpCodes.INTERNAL_SERVER_ERROR, error.message, null);
  }
};

const getAllQueue = async (req: Request, res: Response) => {
  try {
    const result = await projectQueue.queue.getJobs(['completed', 'active']);
    console.log(result);
    return response(res, httpCodes.OK, 'New project created', result);
  } catch (error: any) {
    logger.error(error.message);
    return response(res, httpCodes.INTERNAL_SERVER_ERROR, error.message, null);
  }
};

export default {create, findAll, queue, getAllQueue};
