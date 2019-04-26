import { Pepe } from "./pepe.js";

/**
 * @callback Action
 * @param {Pepe} pepe
 * @param {string} flags
 *
 * @typedef Command
 * @property {string} name Name of the command, used for shortcuts. Should match the regex `/[-\w+]/`.
 * @property {string} info Documentation for the command.
 * @property {Action} do Action the command should do.
 * @property {Action} undo Function reversing the action.
 */

/**
 * Basic stack management – pop and push.
 * @type {Command[]}
 */
export const basic = [
    {
        name: "pop",
        info: "Remove the last item of the stack.",
        do: (pepe, _flags) => {
            pepe.stack.pop();
        },
        undo: (pepe, _flags) => {
            pepe.stack.add(pepe.stack.restore());
        }
    },
    {
        name: "push",
        info: "Push 0 onto the stack",
        do: (pepe, _flags) => {
            pepe.stack.add(0);
        },
        undo: (pepe, _flags) => {
            pepe.stack.pop();
        }
    }
];

/**
 *
 */
