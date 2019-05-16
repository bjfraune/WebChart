export class Logger {
    constructor(
        owner
    ) {
        this.owner = owner;
    }

    log = (caller, message) => {
        console.log(`${this.owner} - ${caller}: ${message}`);
    }

    logObject = (caller, obj) => {
        let keys = Object.keys(obj);

        let objView = "{"
        if (keys.length >= 1) {
            let i;
            for (i = 0; i < keys.length - 1; i++) {
                objView += `${keys[i]}: ${obj[keys[i]]}, `;
            }
            objView += `${keys[i]}: ${obj[keys[i]]}`;
        }
        objView += "}";

        console.log(`${this.owner} - ${caller}: ${objView}`);
    }
}