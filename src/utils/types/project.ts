import * as z from "zod"
import * as imports from "../../../prisma/null"
import { DbClient, Status } from "@prisma/client"

export const ProjectModel = z.object({
  id: z.number().int(),
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
  createdAt: z.date(),
  updatedAt: z.date(),
})
