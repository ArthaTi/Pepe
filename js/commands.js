var cmds = []

/**
	Load list of commands
*/
function cmd_init() {
	$.get("./commands.md", function(data){
		data.replace(/- `([eE]+)`\s*-\s*\[/g, function(m, cmd){
			cmds.push(cmd);
		})
	})
}

/**
	Check if the command exists in the latest version of Pepe
*/
function cmd_exists(e) {
	
	// Remove [Rr] and invalid characters, only E's matter
	e = e.replace(/[^eE]/g, "");
	
	// Commands below 4 length are all available
	if (e.length < 4) return true;
	
	// Characters are all available
	if (e.length == 9) return true;
	
	// If it's on the list, it's available
	return (cmds.indexOf(e) != -1);
	
}