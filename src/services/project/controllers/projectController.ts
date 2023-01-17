import logger from '@/utils/logger';
import httpCodes from '@/utils/response/httpCodes';
import {PrismaClient} from '@prisma/client';
import {Request, Response} from 'express';
import response from '@/utils/response';
import {ProjectModel} from '@/utils/types';
import {z} from 'zod';
import Queue from 'bull';

const prisma = new PrismaClient();

const create = async (req: Request, res: Response) => {
  try {
    const projectInput = ProjectModel.parse(req.body);

    const newProject = await prisma.project.create({
      data: projectInput,
    });

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

    return response(res, httpCodes.INTERNAL_SERVER_ERROR, error.message, null);
  }
};

const findAll = async (req: Request, res: Response) => {
  try {
    const JobsQueue = new Queue('queue-name');
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

export default {create, findAll};
