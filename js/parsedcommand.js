/**
 * A common command.
 */
export const COMMAND = 0;

/**
 * A program flag.
 */
export const FLAG = 1;

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
        this.type = COMMAND;

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
     * Compare two commands.
     * @param {ParsedCommand} other
     */
    equals(other) {

        return this.stack === other.stack
            && this.command === other.command;

    }

}

export default ParsedCommand;
