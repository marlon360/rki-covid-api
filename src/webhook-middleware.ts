import { IResponseMeta } from './responses/meta'
import { Request } from 'express'
import { promisify } from 'util'
import { webhooks } from './configuration/webhooks'
import axios from "axios";

const redis = require("redis");
const client = redis.createClient();

// Make a Promise based Set for redis
const setAsync = promisify(client.set).bind(client);

function callhooks (of: string) {
    webhooks.hooks.forEach(element => {
        if (element.on === of) {
            axios.get(element.call).catch((error) => {
                console.log("Since " + element.on + " hook was triggered, we tried to call " + element.call +
                " but received " + error);   
            });
        }
    });
}

const webhookMiddleware = (data: IResponseMeta, req: Request) => {
    const route_name = req.path;
    const last_update = data.meta.lastUpdate.getTime();

    // After returning the request, check if we have new data on the relevant endpoint
    setImmediate(async () => {
        try {
            const res = await setAsync ("webhook:" + route_name, last_update, "GET");
            // Expire the last update in 2 days. Since in 2 days there is new data available for sure
            client.expire("webhook:" + route_name, 60*60*24*2);
            // res now contains the last update which was processed by the hook
            if (res < last_update) {
                // file got updated, let's call all the hooks
                callhooks(route_name);
            }
        } catch (error) {
            console.log("Webhook Module has redis issue: " + error);
        }
    });
    
};


export default webhookMiddleware;
