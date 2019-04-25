/**
 * The Pepe interpreter.
 */
export class Pepe {

    /**
     * Instance the Pepe interpreter.
     * @param {string} code The Pepe code to run.
     */
    constructor(code) {

        /**
         * @var {string} code Pepe code.
         */
        this.code = code || "";

        /**
         * @var {int} step Current execution step.
         */
        this.step = 0;

        /**
         * @var parsed The Pepe code, parsed.
         */
        this.parsed = Pepe.parse(code);

    }

    /**
     * Update the code.
     * @param {string} code The updated code.
     * @param {int} step The new step number
     */
    update(code, step) {

        // Parse the code
        this.parsed = Pepe.parse(code);

        // Set the step
        this.step = step;
    }

    /**
     * Parse the given code.
     * @param {string} code The code to parse
     * @returns {ParsedCommand[]} The code, parsed.
     */
    static parse(code) {

        /** @var {ParsedCommand[]} result Resulting list */
        let result = [];

        // Iterate until the entire code is parsed
        while (code) {

            // Parse the current command
            let cmd = new ParsedCommand(code);

            // Add it to the result
            result.push(cmd);

            // Remove the command from the code
            code = code.substr(cmd.length);

        }

        return result;

    }

    /**
     * Run the Pepe code.
     * @param {string[]} args Arguments to pass to the app
     * @param {function} callback Function to call when the code finished execution.
     */
    run(args, callback) {

        //

        // Call the callback
        if (callback) callback();
    }

    /**
     * Stop Pepe.
     */
    stop() { }

    /**
     *
     */
    breakpoint() { }
}

/**
 * A common command.
 */
const COMMAND = 0;

/**
 * A program flag.
 */
const FLAG = 1;

/**
 * Represents a parsed executable command.
 */
export class ParsedCommand {

    /**
     * @param {string} str The command as a string
     */
    constructor(str) {

        /** 1 on the first iteration, 0 on the other. */
        let first = 2;

        /** Type of the command. */
        this.type = 0;

        /** Flag applied to the command. */
        this.flag = "";

        /** Stack this command works on. */
        this.stack = "";

        /** Command content. */
        this.command = "";

        /** Length of the command in the code. Also includes following comments. */
        this.length = 0;

        /** Whether a comment is open or not */
        let comment = false;

        // Parse the string
        for (let char of str) {

            // Decrement the first counter
            if (first) first--;

            // Increase the length
            this.length++;

            // If we are currently in a comment
            if (comment) {

                // End of line
                if (char === "\n" || char === "\r") {

                    // End the comment
                    comment = false;

                }

                // Ignore the character
                continue;

            }

            // If the character is an "E"
            if (char.toUpperCase() === "E") {

                // If it's the first character in the command
                if (first) {

                    // It's a flag
                    this.type = FLAG;

                }

                // Add to command content
                this.command += char;

                // Continue to the next character
                continue;

            }

            // If the character is an "R"
            if (char.toUpperCase() === "R") {

                // If the command has been opened
                if (this.command) {

                    // This character doesn't belong here
                    this.length--;

                    // End this command
                    break;

                }

                // Add as a flag
                this.flag += char;

                // Continue to the next character
                continue;

            }

            // It's a "#"
            if (char === "#") {

                // Mark as a comment
                comment = true;

                continue;

            }

            // Other characters, ignore them.

        }

        // If a flag is given
        if (this.flag.length) {

            // Get a single character from the end of the flag
            this.stack = this.flag.charAt(this.flag.length - 1);

            // Remove it from the flag
            this.flag = this.flag.slice(0, -1);
        }

    }

    /**
     * Compare two commands
     * @param {ParsedCommand} other
     */
    equals(other) {

        return this.stack === other.stack
            && this.command === other.command;

    }

}
