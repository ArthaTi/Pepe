"use strict";

import { Pepe } from "./pepe.js";
import { Test, Type, openTest } from "./tests.js";
import "./syntax.js";

//
//  Execution
//

/** @var {Pepe} pepe Active Pepe instance. */
let pepe;

/** Time when the execution started. */
let time;

/**
 * Run or stop Pepe.
 */
function toggle() {

    let starting = $(document.body)
        .toggleClass("running")
        .hasClass("running");

    // Toggle text
    $("#run").text(starting ? "Stop" : "Run");

    // Get the elements
    let $output = $("#output");
    let $editor = $("#editor");

    // If starting
    if (starting) {

        // Clear the output
        $output.text("");

        // Get the code
        let code = $editor.text();

        // Create the Pepe object
        pepe = new Pepe(code);

        // Measure time
        time = performance.now();

        // Refresh the test data
        openTest.refresh();

        // Run Pepe
        pepe.run(openTest.inputs, out => $output.append(
            document.createTextNode(out)
        ));

        // Done – Toggle Pepe off
        toggle();

    } else if (pepe) {

        // Stop pepe
        pepe.stop();

        // Calculate the time it took to execute
        let diff = performance.now() - time;

        // Add info
        $output.append(
            $("<span>")
                .addClass("info")
                .text("Execution finished in " + diff + "ms.\n")
        );
    }
}

/**
 * Add a new input argument
 * @param {string} [text] Value of the argument.
 */
export function addArgument(text) {
    $("#inputs :last-child").before(
        $("<textarea>")
            .attr("placeholder", "Argument " + ($("#inputs > textarea").length + 1))
            .addClass("input")
            .val(text)
    );
}

$(() => {

    //
    //  Events
    //

    let testNum = 1;

    // Create debugger
    let debug = new Test("Execution", false);
    debug.type = Type.DEBUG;

    // Open it
    debug.view();

    // Bind run
    $("#run").click(toggle);

    // Open unit
    $("#open-unit").click(event => {
        $("#execution").hide();
        $("#unit-tests").show();
    });

    // Bind special test openers
    $("#open-interactive").click(() => debug.view());
    $("#open-last").click(() => openTest.view());

    // Bind adding new arguments
    $("#add-input").click(() => addArgument());

    // Bind creating new tests
    $("#new-test").click(() => new Test("New test "+(testNum++)));

    // When test title is double clicked
    $("#execution-title").dblclick(event => {

        // Otherwise, rename the current test
        openTest.rename();

    });

    // Bind keyboard shortcuts
    $(document).keydown(event => {

        // Pressed ctrl+enter
        if (event.ctrlKey && (event.keyCode == 10 || event.keyCode == 13)) {

            $("#run").click();

        }
    });

    // Show a welcome message
    $("#output").html(`
        Welcome to the online Pepe editor and debugger!

        Write your code in the textarea on the left and run it with the "Run" button below.
        Supply arguments to your program using the "Arguments" fields above.
        You can place breakpoints by typing <span class="breakpoint">!!</span> in the editor.

        You can learn what each button does by hovering over it.
    `.replace(/ {2,}/g, "").trim());

});
