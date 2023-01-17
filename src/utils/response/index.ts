import {Response} from 'express';

const response = (
  res: Response,
  statusCode: number,
  message: string,
  data: unknown,
  errors?: unknown
) =>
  res.status(statusCode).json({
    code: statusCode,
    status: statusCode < 400 ? 'success' : 'failed',
    message: message.replace(
      // eslint-disable-next-line no-control-regex
      /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
      ''
    ),
    data,
    errors,
  });

export default response;
