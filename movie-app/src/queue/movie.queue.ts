import { Injectable } from "@nestjs/common";
import { BaseQueue } from "./base.queue";

@Injectable()
export class MovieQueue extends BaseQueue {
    constructor() {
        super('movie-queue');
    }

    async addMovieJob(movieData: any) {
        console.log("Hello")
        return this.publish(movieData, 'process-movie');
    }
}

