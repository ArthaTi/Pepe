// Syntax highlighting

$("#editor").on("input", event => {

    // Get the selection
    let sel = getSelection();
    let n = sel.anchorNode;
    let o = sel.anchorOffset;

    // Tokenize selected node
    // All edits will always be in the anchorNode, no matter the case.
    let s = tokenize(sel.anchorNode, sel.anchorOffset);

    try {

        // Set the returned selection
        sel.collapse(s[0], s[1]);

    } catch (err) {

        console.error("Failed on", s[0], "– not a node.");

    }

});

/**
 * Tokenize a part of code.
 * @param {Text} node Node from which tokenization should start.
 * @param {number} offset Anchor offset. Used to return the new anchor.
 * @return {[Node, number]} New anchor.
 */
function tokenize(node, offset) {

    /** Requested text node. This is only used to detect the edited span and so is not reliable */
    let $node = $(node);

    /** Currently iterated span */
    let $span = $node.parents("div > span");

    /** Open modes */
    let open = ["command"];

    // If $node is a span, not a text node.
    // This happens on creating new lines.
    if ($node.is("span")) {

        // The node is the span
        $span = $node;

    }

    // The $node is the editor.
    // This happens when the field is cleared.
    else if ($node.is("#editor")) {

        // Just return an anchor at the beginning.
        return [$node, 0];

    }

    // If the node isn't wrapped in a span
    else if (!$span.length) {

        // Assert $node.parent() is not a <span>
        if ($node.parent("span").length) debugger;

        // Wrap it
        $node.wrap("<span>");

        // Set the span
        $span = $node.parent();

    }

    // If the node is empty
    if (!$span.text().length) {

        // Clear the class
        $span.attr("class", "");

    }

    // If the node is ignored or is a command
    if ($span.hasClass("comment")) {

        // Add as a mode
        open.push("comment");


    } else if ($span.hasClass("ignored")) {

        // Add as a mode
        open.push("ignored");

    }

    /** Current character index */
    let i = 0;

    /** Resulting anchor */
    let anchor = [];

    // Iterate
    iter: do {

        let text = $span.text();

        // If reached target offset, set it as the anchor.
        if (offset-- === 0) setAnchor();

        // If the node ended
        if (i >= text.length) {

            // Get next sibling
            if ($span.next().length) {

                // Get the next span
                $span = $span.next();

                // Reset index
                i = 0;

            }

            // If the parent is a line <div>
            else if ($span.parent("div").not("#editor").length) {

                // Get the first child of its next sibling.
                let sp = $span.parent().next().children().eq(0);

                // If still not found, stop iterating
                if (!sp.length) break iter;

                // Found, set as next span
                $span = sp;

                // Reset index
                i = 0;

            } else {

                // Stop iterating
                break iter;

            }

        }

        let char = text.charAt(i);

        // If there is no character at this position
        if (!char) {

            // Stop iterating
            break iter;

        }

        // Ignore whitespace
        if (char === " " || char === "\t") {

            continue;

        }

        // Check the open mode
        switch (open[open.length - 1]) {

            case "comment":

                // If the line ends
                if (char === "\n" || char === "\r") {

                    // Pop the mode
                    open.pop();

                    // Add a new span
                    $span = $("<span>").insertAfter($span);
                    i = 0;

                    // End parsing
                    break iter;

                }

                break;

            case "breakpoint":

                // End the breakpoint mode – it will always be 2 characters
                open.pop();

                // Second character of the breakpoint
                if (char === "!") {

                    // Set attributes
                    $span.attr("class", "breakpoint");  // Overwrite classes
                    $span.removeAttr("spellcheck");     // Inherit spellcheck

                    // End the ignored mode
                    open.pop();

                    // End the breakpoint
                    break;

                }

                // Otherwise continue parsing as an ignored character

            // eslint-disable-next-line no-fallthrough
            case "ignored":

                // If the character was an exclamation mark
                if (char === "!") {

                    // Open breakpoint mode
                    open.push("breakpoint");

                }

                // Command character
                if (char === "E" || char === "e") {

                    // Split.
                    $span = jSplit($span, i);
                    i = 0;

                    // End the mode
                    open.pop();

                    // Continue parsing as a command

                }

                // Other special characters
                else if (
                    ["R", "r", "\n", "\r", "#"].includes(char)
                ) {

                    // End the mode
                    open.pop();

                    // Continue parsing as a command

                } else break;

            // eslint-disable-next-line no-fallthrough
            case "command":

                // Stack character
                if (char === "R" || char === "r") {

                    // Split the span
                    $span = jSplit($span, i);
                    i = 0;

                    // Set attributes
                    $span.attr("class", "open command");  // Overwrite previous classes
                    $span.removeAttr("spellcheck");       // Inherit spellcheck
                    // The "open" class is used later to highlight continuation of the command, in case if it is split
                    // in multiple spans.

                }

                // Command continuation character
                else if (char === "E" || char === "e") {

                    // Add the "command" class
                    $span.addClass("command");

                }

                // Comment
                else if (char === "#") {

                    // Open the comment mode
                    open.push("comment");

                    // Split this span
                    $span = jSplit($span, i);
                    i = 0;

                    // Set attributes
                    $span.attr("class", "comment");    // Overwrite previous classes
                    $span.attr("spellcheck", "true");  // Enable spellcheck
                }

                // End of line
                else if (char === "\n" || char === "\r") {

                    // End parsing
                    break iter;

                }

                // Anything else
                else {

                    // Split the span
                    $span = jSplit($span, i);
                    i = 0;

                    // Set attributes
                    $span.attr("class", "ignored");    // Overwrite previous classes
                    $span.removeAttr("spellcheck");    // Disable spellcheck, it might mix with command characters.

                    // Open ignored mode
                    open.push("ignored");

                    // If the character was an exclamation mark
                    if (char === "!") {

                        // Open breakpoint mode
                        open.push("breakpoint");

                    }

                }

                break;

        }

    } while (i++ || true);
    // increment the index; wait for break.

    // If the target anchor wasn't reached, set it to the current position
    if (!anchor.length) setAnchor();

    /**
     * Set target anchor
     */
    function setAnchor() {

        // Assert the anchor has not been set
        if (anchor.length) debugger;

        // Get the text node
        let textnode = $span.contents()[0];

        // It's not a text node
        if (textnode === undefined || textnode.nodeType !== 3) {

            // Use the $span instead
            textnode = $span[0];

        }

        // Set the anchor to the current position.
        anchor = [textnode, i];

    }

    return anchor;

}

/**
 * Split elements' text on given index. Attributes will NOT be preserved.
 * Split will not be performed if index is 0.
 * @param {JQuery} jq Elements to split
 * @param {number} index Index to split on.
 */
function jSplit(jq, index) {

    if (!index) return jq;

    return jq.map(function () {

        let $this = $(this);
        let content = $this.text();

        // Assert jq is a span
        if ($this.prop("tagName") !== "SPAN") debugger;

        // Split the text on the index
        content = [content.slice(0, index), content.slice(index)];

        // Update the original item
        $this.text(content[0]);

        // Add the second item
        return $("<" + $this.prop("tagName") + ">")
            .text(content[1])
            .insertAfter($this)[0];

    });

}
