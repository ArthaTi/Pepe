import { Pepe } from "./pepe.js";

let tests = [
    {
        "name": "Interactive run",
        "inputs": [],
        "last": [],
        "output": "",
    }
];
let open_test = 0;

$(() => {

    /** @var {Pepe} pepe */
    let pepe;

    /** Time when the execution started */
    let time;

    const toggle = function () {

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
    };

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
                .text("Unit test " + n)
                .click(() => viewTest(tests.length - 1))
                .append(

                    // With some actions at the end
                    $("<button>")
                        .addClass("action")
                        .text("Rename"),
                    $("<button>")
                        .addClass("action")
                        .text("Delete")

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

        // Save the current test
        tests[open_test].output = $("#output").children();
        tests[open_test].inputs = $("#inputs textarea").map((i, v) => $(v).val());

        // Ignore the rest if the test is already open
        if (index === open_test) return;

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

        // Set as the current test
        open_test = index;

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

    $("#run").click(toggle);

    // Open unit
    $("#open-unit").click(event => {
        $("#execution").hide();
        $("#unit-tests").show();
    });

    // Bind special test openers
    $("#open-interactive").click(() => viewTest(0));
    $("#open-last").click(() => viewTest(open_test));

    $("#add-input").click(() => addArgument());

    // "New test" clicked
    $("#new-test").click(createTest);

    $(document).keydown(event => {

        // Pressed ctrl+enter
        if (event.ctrlKey && (event.keyCode == 10 || event.keyCode == 13)) {

            $("#run").click();

        }
    });

});
