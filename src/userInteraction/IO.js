import readline from 'readline';

export class IO {
    #reader

    constructor() {
        this.#reader = readline.createInterface(
            process.stdin,
            process.stdout
        );
    }

    getKey = async (message) => {
        this.#reader = readline.createInterface(
            process.stdin,
            process.stdout
        );

        return new Promise((res, rej) => {
            this.#reader.question(message + "\r\n", (input) => {
                this.#reader.close()
                res(input);
            });
        })

    }

    print = (value) => console.log(value);
}