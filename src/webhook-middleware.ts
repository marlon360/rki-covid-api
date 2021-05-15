import { IResponseMeta } from './responses/meta'
import { Request } from 'express'

const webhookMiddleware = (data: IResponseMeta, req: Request) => {
    const route_name = req.path;
    const last_update = data.meta.lastUpdate.getTime();

    // After returning the request, check if we have new data on the relevant endpoint
    setImmediate(() => {
        console.log(route_name + ": " + last_update);
    });
    
};


export default webhookMiddleware;