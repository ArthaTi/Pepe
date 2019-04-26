"use strict";

/**
 * Pepe stack.
 */
class Stack {

    /**
     * Create a new stack
     * @param {?number[]} array Array of numbers to load the stack from.
     */
    constructor(array) {

        // If array is given
        if (array !== undefined) {

            // Load the data from it
            this.data = array;

        } else {

            // Otherwise, provide no data.
            this.data = [];
        }

        /** Data removed from the stack */
        this.removed = [];

        /** Active stack pointer */
        this.pointer = 0;

        /**
         * @callback DefaultParam
         * @param {Stack} stack
         */

        /**
         * Default index for all changes.
         * @type {DefaultParam}
         */
        this.defaultIndex = stack => stack.data.length.index -1;

        /**
         * Whether popped items should be preserved by default.
         * @type {DefaultParam}
         */
        this.defaultPreserve = () => false;

    }

    /**
     * Add a new item to the stack.
     * @param {number} item Item to add.
     * @param {number} [index] Index to insert to.
     */
    add(item, index) {

        // Default arguments
        if (index === undefined) index = this.defaultIndex(this);

        // Insert the item
        this.data.splice(index, 0, item);

    }

    /**
     * Remove and return an item from the stack.
     * @param {number} [index] Index to pop from.
     * @param {boolean} [preserve] If true, the item won't be removed
     * @returns {number} The popped item.
     */
    pop(index, preserve) {

        // Default arguments
        if (index === undefined) index = this.defaultIndex(this);
        if (preserve === undefined) preserve = this.defaultPreserve(this);

        // Remove the item
        this.removed.push(this.data.splice(index, !!preserve)[0] || 0);

        // Return it
        return this.removed[this.removed.length - 1];

    }

    /**
     * Return last removed item.
     * @param {boolean} preserve If true, the item should not be removed from the bin.
     */
    restore(preserve) {

        // If the item has to be preserved.
        if (preserve) {

            // Return it.
            return this.removed[this.removed.length - 1];

        }

        // Otherwise, pop it and return.
        return this.removed.pop();


    }

}

export default Stack;
