function nthroot(x, n) {
	try {
		var negate = n % 2 == 1 && x < 0;
		if (negate)
			x = -x;
		var possible = Math.pow(x, 1 / n);
		n = Math.pow(possible, n);
		if (Math.abs(x - n) < 1 && (x > 0 == n > 0))
			return negate ? -possible : possible;
	} catch (e) {}
}

Array.prototype.diff = function(a, r) {
	// if r:
	//   remove non-repetative
	// else:
	//   remove repetative
	for (var k in this) {
		var i = this[k];
		if (typeof i == "function") continue;

		if (r) { // remove uniques
			if (a.indexOf(i) == -1) { // isn't in the other stack
				this.splice(k, 1);
			}
		} else { // remove duplicates
			if (a.indexOf(i) != -1) { // is in the other stack
				this.splice(k, 1);
			}
		}
	}
};

Array.prototype.shuffle = function() {
	var array = this
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}


function nstack() {
	return {
		array: [],
		pointer: 0,
		refresh: function() {
			var t = this;
			if (t.array.length <= t.pointer) {
				t.pointer = t.array.length - 1;
			} else if (t.pointer < 0) {
				t.pointer = 0;
			}
		},
		now: function() {
			var t = this;
			t.refresh();
			if (t.array.length) {
				return t.array[t.pointer];
			} else return 0;
		},
		set: function(val) {
			var t = this;
			t.refresh();
			if (t.array.length) {
				t.array[t.pointer] = val;
			} else {
				t.push(val);
			}
			return val;
		},
		next: function() {
			var t = this;
			t.pointer++;
			return t.now();
		},
		prev: function() {
			var t = this;
			t.pointer--;
			return t.now();
		},
		start: function() {
			var t = this;
			t.pointer = 0;
			return t.now();
		},
		end: function() {
			var t = this;
			t.pointer = t.array.length - 1;
			return t.now()
		},
		push: function(item) {
			var t = this;
			t.array.push(item);
			return item;
		},
		insert: function(item) {
			var t = this;
			t.refresh();
			t.array.splice(t.pointer + 1, 0, item);
			return item;
		},
		pop: function() {
			var t = this;
			var sel = t.now();
			t.array.splice(t.pointer, 1);
			return sel;
		},
	};
}

function pepe(code, inp) {
	var out = "";

	function output(text) {
		out += text;
		return text;
	}

	var debug = function() {
		console.log.apply(window, arguments);
	}
	if (arguments.length >= 3) debug = arguments[2];

	var labels = {
		goto: function(label) {
			var t = this;
			if (t.hasOwnProperty(label)) {
				return t[label];
			} else {
				return 0;
			}
		}
	};

	var stacks = {};
	var lgoto = 0;
	stacks.r = nstack();
	stacks.R = nstack();
	code = code.replace(/#.*|[^re]/ig, "");
	code = code.replace(/(r)/gi, " $1");
	code = code.split(" ");
	code = code.filter(function(i) {
		return i
	});
	loop: for (var i = 0; i < code.length; i++) {
		var cmd = code[i];
		var stack, other;
		switch (cmd.charAt(0)) {
			case "r":
				stack = stacks.r;
				other = stacks.R;
				break;
			case "R":
				stack = stacks.R;
				other = stacks.r;
				break;
		}
		var scream = cmd.substr(1);
		console.log(stack, other, scream);
		switch (scream) {
			// 1 E/e (basic)
			case "E":
				stack.push(0);
				break;
			case "e":
				stack.pop();
				break;

			// 2 E/e (flow)
			case "EE": // label
				labels[stack.now()] = i;
				break;
			case "Ee": // return
				debug(lgoto);
				if (lgoto > 0) {
					i = lgoto + 1;
				}
				continue loop;
			case "eE": // goto if ws
				lgoto = i;
				if (stack.array.length) {
					i = labels.goto(stack.now());
				}
				continue loop;
			case "ee": // goto if active item > 0
				lgoto = i;
				if (stack.now() > 0) {
					i = labels.goto(stack.now());
				}
				continue loop;

			// 3 E/e (I/O)
			case "EEE":
				if (isNaN(inp) || !inp.length) {
					for (var j = 0; j < inp.length; j++) {
						stack.push(inp.charCodeAt(j));
					}
				} else {
					stack.push(parseInt(inp, 10));
				}
				break;
			case "EEe":
				for (let j = 0; j < inp.length; j++) {
					stack.push(inp.charCodeAt(j));
				}
				break;
			case "EeE":
				if (isNan(inp)) {
					stack.push(0);
				} else {
					stack.push(Math.round(inp))
				}
				break;
			case "Eee":
				if (isNan(inp)) {
					stack.push(0);
				} else {
					stack.push(inp)
				}
				break;
			case "eEE":
				output(stack.pop());
				break;
			case "eEe":
				output(String.fromCharCode(stack.pop()));
				break;
			case "eeE":
				output("\n");
				break;
			case "eee":
				stack.array.forEach(function(i) {
					output(String.fromCharCode(i));
				});
				break;

			// 4 E/e (pointer)
			case "EEEE":
				stack.pointer = 0;
				break;
			case "EEEe":
				stack.pointer = stack.array.length - 1;
				break;
			case "EEeE":
				stack.pointer--;
				break;
			case "EEee":
				stack.pointer++;
				break;
				// empty slots...
			case "EeEE":
				stack.pointer = Math.floor(Math.random() * stack.array.length);
				break;
				// empty random slot

			// 5 E/e (active)
			case "EEEEE": // ++
				stack.set(stack.now() + 1);
				break;
			case "EEEEe": // --
				stack.set(stack.now() - 1);
				break;
			case "EEEeE": // insert dupe
				stack.insert(stack.now());
				break;
			case "EEEee": // push dupe
				stack.push(stack.now());
				break;
			case "EEeEE": // random
				stack.set(Math.floor(Math.random() * stack.now()));
				break;
				// Empty slot
			case "EEeeE": // round
				stack.set(Math.round(stack.now()));
				break;
			case "EEeee": // round to 0.5
				stack.set(Math.round(stack.now() * 2) / 2);
				break;
			case "EeEEE":
				stack.set(Math.ceil(stack.now()));
				break;
			case "EeEEe":
				stack.set(Math.floor(stack.now()));
				break;
			case "EeEeE":
				stack.set(Math.abs(stack.now()));
				break;
			case "EeEee":
				stack.set(stack.now() * -1);
				break;
			case "EeeEE":
				stack.set(Math.pow(stack.now(), 2));
				break;
			case "EeeEe":
				stack.set(Math.pow(stack.now(), 3));
				break;
			case "EeeeE":
				stack.set(Math.sqrt(stack.now()));
				break;
			case "Eeeee":
				stack.set(Math.cbrt(stack.now()));
				break;
			case "eEEEE":
				stack.set(stack.now()%2);
				break;
			case "eEEEe":
				stack.set(stack.now()%3);
				break;
				// Empty slots


			// 6 E/e (2 value)
			case "EEEEEE":
				stack.push(stack.pop() + other.pop());
				break;
			case "EEEEEe":
				stack.push(stack.pop() - other.pop());
				break;
			case "EEEEeE":
				stack.push(stack.pop() * other.pop());
				break;
			case "EEEEee":
				stack.push(stack.pop() / other.pop());
				break;
			case "EEEeEE":
				stack.push(parseInt("" + stack.pop() + other.pop()));
				break;
			case "EEEeEe":
				var str = stack.pop();
				var sep = other.pop();
				for (var m = 0; m < str.length; m += sep) {
					stack.push(str.substring(m, m + sep));
				}
				break;
			case "EEEeeE":
				var d2 = other.pop();
				var d1 = stack.pop() / d2;
				for (var n = 0; n < d2; n++) {
					stack.push(d1);
				}
				break;
				// Empty slot
			case "EEeEEE":
				stack.push(Math.pow(stack.pop(), other.pop()));
				break;
			case "EEeEEe":
				stack.push(nthroot(stack.pop(), other.pop()));
				break;
			case "EEeEeE":
				stack.push(stack.pop() % other.pop());
				break;
				// Empty slots
				

			// 7 E/e
			case "EEEEEEE": // move single
				if (false) { // don't remove, don't set to true. it's exactly like it should be.
					output("https://www.youtube.com/watch?v=m-NgHh36_vU");
				}
				other.push(stack.pop());
				break;
			case "EEEEEEe": // copy single
				other.push(stack.get());
				break;
			case "EEEEEeE": // move all
			case "EEEEEee": // copy all
				for (var o = 0; o < stack.array.length; o++) {
					other.push(stack.array[o]);
				}
				if (scream == "EEEEEeE") { // move mode? Remove!
					stack.array.splice(0, stack.array.length);
				}
				break;
			case "EEEEeEE":
				var temp = stacks.r;
				stacks.r = stacks.R;
				stacks.R = temp;
				break;
				// empty slot
			case "EEEEeeE":
				stack.array.diff(other.array);
				break;
			case "EEEEeee":
				stack.array.diff(other.array, true);
				break;

			// 8 E/e
			case "EEEEEEEE":
				stack.push(stack.array.reduce(function(a, b) {
					return a + b;
				}, 0));
				break;
			case "EEEEEEeE":
				stack.push(stack.array.reduce(function(a, b) {
					return a * b;
				}, 0));
				break;
			case "EEEEEeEE":
				stack.push(stack.array.reduce(function(a, b) {
					return window.parseInt(a.toString() + b.toString());
				}, 0));
				break;
			case "EEEEEeeE":
				stack.array = stack.array.forEach(function(a) {
					a++;
				});
				break;
			case "EEEEEeee":
				stack.array = stack.array.forEach(function(a) {
					a--;
				});
				break;
			case "EEEEeEEE":
				stack.array.length = 0;
				break;
			case "EEEEeEEe":
				for (var it in stack.array) {
					stack.refresh();
					if (it != stack.pointer) {
						stack.array.splice(it, 1)
					}
				}
				break;
			case "EEEEeEeE":
				stack.array.sort();
				break;
			case "EEEEeEee":
				stack.array.reverse();
				break;
			case "EEEEeeEE":
				stack.array.shuffle();
				break;

				// error
			default:
				//debug("REEEE!", typeof scream, scream, scream.length, "EEEER");
				if (scream.length == 9) {
					var push = false;
					if (scream.charAt(0) == "E") {
						push = true;
					}
					var res = scream.substr(1).replace(/e/g, 0).replace(/E/g, 1).toString(2);
					var deb = res;
					res = parseInt(res, 2);
					//debug(res, push);
					if (push) {
						stack.push(res);
					} else {
						output(String.fromCharCode(res));
					}
				} else output(cmd + "ERROR!");
		}
	}
	console.log(code, stacks);
	debug(JSON.stringify(stacks.r.array))
	debug(JSON.stringify(stacks.R.array))
	debug("\nLabels:");
	debug(JSON.stringify(labels));
	return out;
}