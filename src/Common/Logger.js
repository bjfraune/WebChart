export class Logger {
    constructor(
        owner
    ) {
        this.owner = owner;
    }

    log(caller, message) {
        console.log(`${this.owner} - ${caller}: ${message}`);
    }
}