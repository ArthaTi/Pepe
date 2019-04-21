import { Pepe } from "./pepe.js";

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

            console.log(pepe.parsed);

            // Measure time
            time = performance.now();

            // Run Pepe
            pepe.run(() => {

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
    $("#run").click(toggle);

    $(document).keydown(event => {

        // Pressed ctrl+enter
        if (event.ctrlKey && (event.keyCode == 10 || event.keyCode == 13)) {

            $("#run").click();

        }
    });

});
