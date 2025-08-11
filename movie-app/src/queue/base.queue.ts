import { Queue } from "bullmq";
import { bullEmitterOptions, getConnectionObject, queueAdapters } from "./queue.adapter";


export abstract class BaseQueue {
    private readonly queue: Queue;
    private readonly queueName: string;

    constructor(queueName: string) {
        this.queueName = queueName;
        const { connection, prefix } = getConnectionObject();
        this.queue = new Queue(this.queueName, {
            connection,
            prefix,
        });
        queueAdapters[queueName] = this;
    }

    async publish<T = any>(data: T, jobName?: string) {
        console.log("Hello 2")
        const name = jobName ?? this.queueName;
        const result = await this.queue.add(name, data, bullEmitterOptions);
        console.log("result", result)
        return result;
    }

    async close (){
        await this.queue.close();
    }


}

