import { queueConfig } from "./queue.config";
import Redis from 'ioredis';
import { BullRootModuleOptions } from "@nestjs/bullmq";



export const queueAdapters: Record<string, any> ={};
export const  subscriberMaps :Record <string, any>={};
export const queueMaps: Record <string, any> = {};


export const getConnectionObject = () =>{
   const connection = new Redis(queueConfig.connection as any);
   return {
    connection,
    prefix : undefined
   }
}


export const getWorkerConfig = () =>{
    const connObj = getConnectionObject();
    const opts :BullRootModuleOptions ={
        connection: connObj.connection
    }

    return{
        opts,
        isWorker: true,
        isCronWorker: false,
    }
}

export const bullEmitterOptions = {
  removeOnComplete: true,
};