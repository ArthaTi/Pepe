"use strict";

import ParsedCommand from "./parsedcommand.js";
import Stack from "./stack.js";
import * as Packs from "./packs.js";

/**
 * @typedef {import("./packs.js").Command} Command
 */

/**
 * @callback TakeOutput
 * @param {string} output String to be outputted.
 */

/**
 * The Pepe interpreter.
 */
export class Pepe {

    /**
     * Instance the Pepe interpreter.
     * @param {string} [code] The Pepe code to run.
     * @param {Command[][]} [packs] Packs to load.
     */
    constructor(code, packs) {

        /**
         * Packs in use.
         * @type {Command[][]}
         */
        this.packs = packs !== undefined ? packs
            : [
                Packs.basic
            ];

        /**
         * @var {string} code Pepe code.
         */
        this.code = code !== undefined ? code : "";

        /**
         * @var {int} step Current execution step.
         */
        this.step = 0;

        /**
         * @var parsed The Pepe code, parsed.
         */
        this.parsed = Pepe.parse(code);

        /**
         * All available stacks.
         * @type {Object<string, Stack>}
         */
        this.stacks = {};

        /**
         * Given arguments
         * @type {string[]}
         */
        this.args = [];

        /**
         * Function sending output.
         * @type {?TakeOutput}
         */
        this.output = null;

        /**
         * Currently active stack.
         */
        this.stack = null;

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
     * Run or restart the Pepe code.
     * @param {string[]} args Arguments to pass to the app
     * @param {TakeOutput} output Function to call when program sends output.
     */
    run(args, output) {

        // Initialize the stacks
        this.stacks = {
            r: new Stack(),
            R: new Stack(),
        };

        // Get the input
        this.args = args !== undefined ? args : [];

        // Get the output function
        this.output = output;

        /** Current command pointer */
        let i = 0;

        // Start the execution
        while (i < this.parsed.length) {

            /** Current command */
            let cmd = this.parsed[i++];

            // Set active stack
            this.stack = this.stacks[cmd.stack];

            /** The command as a number */
            let bin = "";

            // Convert command to a number
            for (let ltr of cmd.command) {

                // Convert "E" to 1, "e" to 0.
                if (ltr === "E") bin += "1";
                if (ltr === "e") bin += "0";

            }

            // Perform the command
            this.packs[cmd.command.length - 1][parseInt(bin, 2)].do(this);

        }
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
