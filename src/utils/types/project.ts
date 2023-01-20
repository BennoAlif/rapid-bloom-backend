import * as z from 'zod';
import {DbClient, Status} from '@prisma/client';

export const ProjectModel = z.object({
  name: z.string(),
  dbClient: z.nativeEnum(DbClient),
  dbName: z.string(),
  dbHost: z.string(),
  dbPort: z.string(),
  dbUsername: z.string(),
  dbPassword: z.string(),
  sslCon: z.boolean().nullish(),
  status: z.nativeEnum(Status).nullish(),
  isDeployed: z.boolean().nullish(),
});
