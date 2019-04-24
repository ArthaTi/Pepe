"use strict";

import { addArgument } from "./main.js";
import { Save } from "./save.js";

/**
 * Unit test type.
 * @enum
 */
export const Type = {

    /** A normal test case. */
    TEST: 0,

    /** Debugger – exclude from unit testing. */
    DEBUG: 1,

};

/**
 * Currently open test. Test is considered open if it's visible in the output or the unit test menu was opened while
 * the test was open.
 *
 * @type {Test}
 */
export let openTest;

/**
 * A unit test.
 */
export class Test {

    /**
     * Create a new unit test.
     * @param {string | object} obj Name of the test; or existing test object to add the prototype to.
     * @param {boolean} [add] Whether the test should be added to test list, defaults to true.
     */
    constructor(obj, add) {

        /** True if loading from existing object */
        let loading = typeof obj !== "string";

        /**
         * Type of this test.
         * @type {Type}
         */
        this.type = loading ? obj.type : Type.TEST;

        /**
         * Name of the test
         * @type {string}
         */
        this.name = loading ? obj.name : obj;

        /**
         * Inputs given to the test
         * @type {string[]}
         */
        this.inputs = loading ? obj.inputs : [];

        /**
         * Expected output from the test.
         * @type {string}
         */
        this.expected = loading ? obj.expected : "";

        /**
         * Actual output from the last execution
         * @type {string}
         */
        this.output = loading ? obj.output : "";

        /**
         * Button which opens this test.
         * @type {?JQuery}
         */
        this.button = null;

        // If `add` is true
        if (add || add === undefined) {

            // Add this test
            this.add();

        }

        // Add to save
        Save.tests[Save.lastTest++] = this;

    }

    /**
     * Add this test to the UI list of test. **This is automatically done on construction**, unless the `add` parameter
     * was set to `false`.
     */
    add() {

        // Create a button
        this.button = $("<button>")
            .click(() => this.view())

            // Inside
            .append(

                // A text label
                $("<span>").text(this.name),

                // With some actions at the end
                $("<button>")
                    .addClass("action")
                    .text("Rename")
                    .click(event => {

                        // Rename the test
                        this.rename();

                        // Don't propagate
                        event.stopPropagation();
                    }),
                $("<button>")
                    .addClass("action")
                    .text("Remove")
                    .click(event => {

                        // Remove the button
                        this.button.remove();

                        // Don't propagate
                        event.stopPropagation();
                    })

            );

        // Add it to the UI
        $("#new-test").before(this.button);
    }

    /**
     * View this test.
     */
    view() {

        // Toggle views
        $("#execution").show();
        $("#unit-tests").hide();

        // If there was a test open
        if (openTest) {

            // Save it
            openTest.output = $("#output").children();
            openTest.inputs = $("#inputs textarea").map((_i, v) => $(v).val()).toArray();
            openTest.expected = $("#expected").val();

            // If its button had been removed
            if (this.button && !this.button.parent().length) {

                // Add a notice
                $("#output").append(
                    $("<span>")
                        .addClass("error")
                        .text(
                            "This unit test had been removed. Changes will not be saved and the test will stop being " +
                            "accessible once you open another. "
                        ).append(
                            $("<a>")
                                .text("Restore this test.")
                                .attr("href", "javascript:void(0)")
                                .click(event => {

                                    // Add to list
                                    this.add();

                                    // Remove the message
                                    $(event.currentTarget).parent().remove();

                                    $("#output").append(
                                        $("<span>")
                                            .addClass("success")
                                            .text("The test has been restored."),
                                        $("<br>")
                                    );
                                }),
                            $("<br>")
                        ),
                );

            }

            // If that test is being opened, ignore the rest
            if (this === openTest) return;
        }

        // Show the expected return options, but only on test cases (non-zero indexes)
        $("#return").toggle(this.type === Type.TEST);

        // Clear the inputs
        $("#inputs textarea").remove();

        // Add the inputs
        this.inputs.forEach(value => {

            // Add an input field for each argument
            addArgument(value);

            return true;
        });

        // If none given
        if (!this.inputs.length) {

            // Add one
            addArgument();

        }

        // Set expected return value
        $("#expected").val(this.expected);

        // Show the output
        $("#output").html(this.output);

        // Set title
        $("#execution-title").text(this.name);

        // Set as the current test
        openTest = this;
    }

    /**
     * Rename this test
     * @param {string} [name] New name for the test, if not specified, the user will be prompted.
     */
    rename(name) {

        let $test = this.button;
        let open = false;

        // If this test is open in the UI
        if (openTest === this && $("#execution:visible").length) {

            open = true;

            // Change the title instead
            $test = $("#execution-title");

        }

        // Hide the element
        $test.hide();

        // Add the rename element
        $("<input>")
            .attr("type", "text")
            .addClass("rename")
            .focusout(Test.endRenaming)
            .val(this.name)
            .keyup((event) => {
                switch (event.key) {
                    case "Enter":

                        // Rename the test
                        this.name = $(event.currentTarget).val();

                        // Change the button text
                        this.button
                            .children().eq(0)     // label
                            .text(this.name);

                        // If the test is open
                        if (open) {

                            // Change the current title
                            $("#execution-title").text(this.name);
                        }

                    // eslint-disable-next-line no-fallthrough
                    case "Escape":

                        // Stop renaming
                        Test.endRenaming();
                }
            })
            .insertAfter($test)
            .focus()
            .click()  /* select() doesn't work without this */
            .select();
    }

    /**
     * End renaming the test.
     */
    static endRenaming() {
        let $rename = $(".rename");
        let $name = $rename.prev();

        // Remove the rename input fields
        $rename.remove();

        // Show the names
        $name.show();
    }

}
