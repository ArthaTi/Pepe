import { Pepe } from "./pepe.js";

let tests = [
    {
        "name": "Execution",
        "inputs": [],
        "last": [],
        "output": "",
    }
];

/**
 * Currently open test. Test is considered open if it's visible in the output or the unit test menu was opened while
 * the test was open.
 *
 * Negative values indicate that no test is open, zero indicates standard debug is open, positive values indicate
 * a test is open.
 */
let open_test = 0;

$(() => {

    /** @var {Pepe} pepe */
    let pepe;

    /** Time when the execution started */
    let time;

    function toggle() {

        let starting = $(document.body)
            .toggleClass("running")
            .hasClass("running");

        // Toggle text
        $("#run").text(starting ? "Stop" : "Run");

        // Get the elements
        let output = $("#output");
        let editor = $("#editor");

        // If starting
        if (starting) {

            // Clear the output
            output.text("");

            // Get the code
            let code = editor.prop("innerText") || editor.prop("editor");

            // Create the Pepe object
            pepe = new Pepe(code);

            // Measure time
            time = performance.now();

            // Run Pepe
            pepe.run([], () => {

                // When done, mark as completed
                toggle();
            });

        } else if (pepe) {

            // Stop pepe
            pepe.stop();

            // Calculate the time it took to execute
            let diff = performance.now() - time;

            // Add info
            output.append(
                $("\n<span>")
                    .addClass("info")
                    .text("Execution finished in " + diff + "ms.")
            );
        }
    }

    /**
     * Create a test
     */
    function createTest() {

        /** Test number */
        let n = tests.length;

        // Add to tests
        tests.push({
            "name": "Unit test " + n,
            "inputs": [],
            "last": [],
            "output": "",
        });

        // Add a new item
        $("#new-test").before(

            // It's a button
            $("<button>")
                .click(event => viewTest($(event.currentTarget).index()))
                .append(

                    // A text label
                    $("<span>").text("Unit test " + n),

                    // With some actions at the end
                    $("<button>")
                        .addClass("action")
                        .text("Rename")
                        .click(event => {

                            // Rename the test
                            renameTest(n);

                            // Don't propagate
                            event.stopPropagation();
                        }),
                    $("<button>")
                        .addClass("action")
                        .text("Delete")
                        .click(event => {

                            // Get the parent button
                            let $target = $(event.currentTarget).parent();

                            // Remove the test it refers to.
                            tests.splice($target.index(), 1);

                            // Remove the button
                            $target.remove();

                            // Force test reload
                            open_test = -1;

                            // Don't propagate
                            event.stopPropagation();
                        })

                )
        );
    }

    /**
     * Open a test
     */
    function viewTest(index) {

        // Toggle views
        $("#execution").show();
        $("#unit-tests").hide();

        // If there was a test open
        if (open_test >= 0) {

            // Save the current test
            tests[open_test].output = $("#output").children();
            tests[open_test].inputs = $("#inputs textarea").map((_i, v) => $(v).val());

            // Ignore the rest if trying to open already opened test
            if (index === open_test) return;
        }

        // Show the expected return options, but only on test cases (non-zero indexes)
        $("#return").toggle(!!index);

        // Clear the inputs
        $("#inputs textarea").remove();

        let any = false;

        // Generate the inputs
        $.each(tests[index].inputs, (index, value) => {

            // Add an input field for each argument
            addArgument(value);

            any = true;
        });

        // No inputs given
        if (!any) {

            // Add one
            addArgument();

        }

        // Show the output
        $("#output").html(tests[index].output);

        // Set title
        $("#execution-title").text(tests[index].name);

        // Set as the current test
        open_test = index;

    }

    /**
     * Show rename GUI
     * @param {number} test Number of test to rename
     */
    function renameTest(test, el) {

        // Get the jQuery element
        let $test = $(el);

        // None given
        if (!$test.length) {

            // Get the test from list
            $test = $("#test-list > button").eq(test);
        }

        // Hide the element
        $test.hide();

        // Add the rename element
        $("<input>")
            .attr("type", "text")
            .addClass("rename")
            .focusout(endRenaming)
            .val(tests[test].name)
            .keyup((event) => {
                switch (event.key) {
                    case "Enter":

                        console.log("End:", test, $test);

                        // Rename the test
                        tests[test].name = $(event.currentTarget).val();

                        // Change the button text
                        $("#test-list")
                            .children().eq(test)  // nth test
                            .children().eq(0)     // label
                            .text(tests[test].name);

                        // If the test is open
                        if (open_test === test) {

                            // Change the current title
                            $("#execution-title").text(tests[test].name);
                        }

                    // eslint-disable-next-line no-fallthrough
                    case "Escape":

                        // Stop renaming
                        endRenaming();
                }
            })
            .insertAfter($test)
            .focus()
            .click()  /* select() doesn't work without this */
            .select();

    }

    /**
     * Quit renaming tests
     */
    function endRenaming() {
        let $rename = $(".rename");
        let $name = $rename.prev();

        // Remove the renames
        $rename.remove();

        // Show the names
        $name.show();

    }

    /**
     * Add a new argument
     * @param {string} [text] Value of the argument.
     */
    function addArgument(text) {
        $("#inputs :last-child").before(
            $("<textarea>")
                .attr("placeholder", "Argument " + ($("#inputs > textarea").length + 1))
                .addClass("input")
                .val(text)
        );
    }

    //
    //  Events
    //

    // Bind run
    $("#run").click(toggle);

    // Open unit
    $("#open-unit").click(event => {
        $("#execution").hide();
        $("#unit-tests").show();
    });

    // Bind special test openers
    $("#open-interactive").click(() => viewTest(0));
    $("#open-last").click(() => viewTest(open_test));

    // Bind adding new arguments
    $("#add-input").click(() => addArgument());

    // Bind creating new tests
    $("#new-test").click(createTest);

    // When test title is double clicked
    $("#execution-title").dblclick(event => {

        // Ignore if no test is open
        if (!open_test) return;

        // Otherwise, rename the current test
        renameTest(open_test, "#execution-title");
    });

    // Bind keyboard shortcuts
    $(document).keydown(event => {

        // Pressed ctrl+enter
        if (event.ctrlKey && (event.keyCode == 10 || event.keyCode == 13)) {

            $("#run").click();

        }
    });

});
