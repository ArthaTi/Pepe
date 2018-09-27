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
	var k = this.length;
	while (k--) {
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

var consts = {
	PRESERVE: 1,
	INSERT: 2,
	PREPEND: 4,
	PUSH: 8,
	RETURN: 16,
};

function nstack() {
	return {
		array: [],
		pointer: 0,
		flag: 0,
		
		refresh: function() {
			var t = this;
			if (t.array.length <= t.pointer) {
				t.pointer = t.array.length - 1;
			} else if (t.pointer < 0) {
				t.pointer = 0;
			}
			if (!t.array.length) {
				t.push(0);
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
			if (t.flag & consts.PUSH) {
				t.pop();
				t.push(val);
			} else {
				t.array[t.pointer] = val;
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

			if (t.flag & consts.INSERT) {
				t.insert(item);
			} else if (t.flag & consts.PREPEND) {
				t.prepend(item);
			} else {
				t.array.push(item);
			}

			return item;
		},
		prepend: function(item) {
			var t = this;
			t.array.splice(0, 0, item);
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

			if (!(t.flag & consts.PRESERVE)) {
				t.array.splice(t.pointer, 1);
			}
			
			return sel;
		},
	};
}

function pepe(code, inp) {
	var out = "";
	var flags = {};
	var ip = 0;
	var returns = [];
	
	function getinp() {
		if (inp[ip]) {
			return inp[ip];
		} else {
			return 0;
		}
	}

	function output(text) {
		out += text;
		return text;
	}

	var debug = function() {
	}
	
	if (arguments.length >= 3) {
		var fi = 2;
		if (typeof arguments[2] == "function") {
			debug = arguments[2];
			fi = 3;
		} 
		
		if (arguments.length > fi) {
			flags = arguments[fi];
		}
	}

	var labels = {
		flag: 0,
		goto: function(label) {
			var t = this;

			if (t.flag & consts.RETURN) {
				var ret = -1;

				returns.forEach(function(x){
					if (x > i && (ret == -1 || x < ret)) {
						ret = x;
					}
				});

				return ret
			}

			if (t.hasOwnProperty(label)) {
				return t[label];
			} else {
				return -1;
			}
		}
	};

	var stacks = {};
	var lgoto = -1;
	stacks.r = nstack();
	stacks.R = nstack();
	code = code.replace(/#.*|[^re]/ig, "");
	code = code.replace(/(r+)/gi, " $1");
	code = code.split(" ");
	code = code.filter(function(i) {
		return i;
	});
	code.forEach(function(i, idx){
		// If it's return, add to returns list
		if (i.replace(/[^e]/ig, "") == "Ee") {
			returns.push(idx)
		}
	});
	
	var pflags = "";

	if (code.length && code[0].charAt(0).toLowerCase() != "r") {
		pflags = code[0];
		code.splice(0, 1)
	}

	if (pflags) {
		debug("Warning: Program flags are not supported yet.")
	}
	
	var i = -1;
	var loop = function() {
		i++;
		if (i >= code.length) return [true, out, i];
		var cmd = code[i];
		var m = cmd.match(/^(r*)(r)(e*)/i);
		var cflag  = m[1];
		var stname = m[2];
		var scream = m[3];
		var stack, other;
		switch (stname) {
			case "r":
				stack = stacks.r;
				other = stacks.R;
				break;
			case "R":
				stack = stacks.R;
				other = stacks.r;
				break;
		}

		var expl = cmd+"  # ";

		var patterns = {
			pos: {
				r: consts.INSERT,
				R: consts.PREPEND,
			},
			pop: {
				r: consts.PRESERVE,
			},
			push: {
				r: consts.PUSH,
				R: consts.PUSH | consts.PRESERVE,
			},
			mix: {
				r: consts.PRESERVE,
				R: 0,
				rr: consts.INSERT,
				rR: consts.PREPEND,
				Rr: consts.INSERT  | consts.PRESERVE,
				RR: consts.PREPEND | consts.PRESERVE,
			},
			flow: {
				r: consts.RETURN,
			}
		};

		function cmdflag(pattern) {
			var res = 0;

			// console.log(pattern, cflag)
			if (pattern[cflag]) {
				res = pattern[cflag];
			} else if (cflag && pattern.length) {
				debug("Warning: Unknown command flag " + cflag);
			}

			stack.flag = res;
			other.flag = res;
			labels.flag = res;
		}

		// console.log("len:", scream.length, cflag, patterns.flow[cflag]);
		if (scream.length == 2) {
			cmdflag(patterns.flow);
		} else if (scream.length == 6
			|| scream.length == 7) {
			cmdflag(patterns.mix);
		} else {
			cmdflag({});
		}

		// console.log(stack, other, scream);
		switch (scream) {
			// 1 E/e (basic)
			case "E":
			cmdflag(patterns.pos)
				expl += "Push 0"
				stack.push(0);
				break;
			case "e":
				expl += "Pop the stack"
				stack.pop();
				break;

			// 2 E/e (flow)
			case "EE": // label
				expl += "Create label "+stack.now();
				labels[stack.now()] = i;
				// console.log("label:", i, stack.flag & consts.RETURN);

				if (stack.flag & consts.RETURN) {
					var n = labels.goto();
					// console.log("gotor:", i, n);
					if (n != -1) {
						i = n;
					}
				}
				break;
			case "Ee": // return
				expl += "Return to command "+(lgoto+1)
				if (lgoto > 0) {
					i = lgoto;
				}
				break;
			case "eE": // goto if WI == OI
				lgoto = i;
				if (stack.now() == other.now()) {
					expl += "A==B, Goto label "+stack.now();
					var n = labels.goto(stack.now());
					if (n != -1) {
						i = n;
					}
				} else {
					expl += "A==B, false";
				}
				break;
			case "ee": // goto if WI != OI
				lgoto = i;
				if (stack.now() != other.now()) {
					expl += "A!=B, Goto label "+stack.now();
					var n = labels.goto(stack.now());
					if (n != -1) {
						i = n;
					}
				} else {
					expl += "A!=B, false";
				}
				// console.log(stack.now(), other.now(), "goto",i);
				break;

			// 3 E/e (I/O)
			case "EEE":
			cmdflag(patterns.pos);

				if (isNaN(getinp()) || !getinp().length) {
					expl += "Input auto-parsed as string"
					for (var j = 0; j < getinp().length; j++) {
						stack.push(getinp().charCodeAt(j));
					}
				} else {
					expl += "Input auto-parsed as number"
					var parse = parseFloat(getinp(), 10);
					debug("input:",parse)
					stack.push(parse);
				}
				ip++;
				break;

			case "EEe":
			cmdflag(patterns.pos);

				expl += "Input (string)"
				for (let j = 0; j < getinp().length; j++) {
					stack.push(getinp().charCodeAt(j));
				}
				ip++;
				break;

			case "EeE":
			cmdflag(patterns.pos);

				if (isNaN(getinp())) {
					expl += "Input isn't a number, push 0 instead";
					stack.push(0);
				} else {
					expl += "Input (int): "+Math.round(getinp());
					stack.push(Math.round(getinp()))
				}
				ip++;
				break;

			case "Eee":
			cmdflag(patterns.pos);

				if (isNaN(getinp())) {
					expl += "Input isn't a number, push 0 instead";
					stack.push(0);
				} else {
					expl += "Input (float): "+getinp();
					stack.push(parseFloat(getinp()))
				}
				ip++;
				break;

			case "eEE":
			cmdflag(patterns.pop);
			
				expl += "Output as number";
				output(stack.pop());
				break;

			case "eEe":
			cmdflag(patterns.pop);
			
				expl += "Output as character"
				output(String.fromCharCode(stack.pop()));
				break;

			case "eeE":

				expl += "Output line break"
				output("\n");
				break;

			case "eee":

				expl += "Output stack as string";
				stack.array.forEach(function(i) {
					output(String.fromCharCode(i));
				});
				break;

			// 4 E/e (pointer)
			case "EEEE":
				expl += "Move pointer to first position";
				stack.pointer = 0;
				break;
			case "EEEe":
				expl += "Move pointer to last position";
				stack.pointer = stack.array.length - 1;
				break;
			case "EEeE":
				expl += "Move pointer to previous position";
				stack.prev()
				break;
			case "EEee":
				expl += "Move pointer to next position";
				stack.next();
				break;
				// empty slots...
			case "EeEE":
				expl += "Move pointer to a random position";
				stack.pointer = Math.floor(Math.random() * stack.array.length);
				break;
				// empty random slot

			// 5 E/e (active)
			case "EEEEE": // ++
			cmdflag(patterns.push);

				expl += "Increment, "+stack.now()+" → "+(stack.now()+1);
				stack.set(stack.now() + 1);
				break;

			case "EEEEe": // --
			cmdflag(patterns.push);

				expl += "Decrement, "+stack.now()+" → "+(stack.now()-1);
				stack.set(stack.now() - 1);
				break;

			case "EEEeE": // insert dupe

				expl += "Insert self (duplicate to next)";
				stack.insert(stack.now());
				break;

			case "EEEee": // push dupe
			cmdflag(patterns.pos);

				expl += "Push self (duplicate to end)";
				stack.push(stack.now());
				break;
				
			case "EEeEE": // random
			cmdflag(patterns.push);

				expl += "Random value from 0 to "+stack.now();
				var neg = Math.abs(stack.now()) != stack.now();
				var val = (neg?Math.abs(stack.now()):stack.now())+1
				val = Math.floor(Math.random() * val)
				stack.set(neg?-val:val);
				break;
				// Empty slot
			case "EEeeE": // round
			cmdflag(patterns.push);
				expl += "Round, "+stack.now()+" → "+Math.round(stack.now());
				stack.set(Math.round(stack.now()));
				break;
			case "EEeee": // round to 0.5
			cmdflag(patterns.push);
				expl += "Round to 0.5, "+stack.now()+" → "+(Math.round(stack.now()*2)/2);
				stack.set(Math.round(stack.now() * 2) / 2);
				break;
			case "EeEEE":
			cmdflag(patterns.push);
				expl += "Ceil, "+stack.now()+" → "+Math.ceil(stack.now());
				stack.set(Math.ceil(stack.now()));
				break;
			case "EeEEe":
			cmdflag(patterns.push);
				expl += "Floor, "+stack.now()+" → "+Math.floor(stack.now());
				stack.set(Math.floor(stack.now()));
				break;
			case "EeEeE":
			cmdflag(patterns.push);
				expl += "Absolute, "+stack.now()+" → "+Math.abs(stack.now());
				stack.set(Math.abs(stack.now()));
				break;
			case "EeEee":
			cmdflag(patterns.push);
				expl += "Reverse, "+stack.now()+" → "+(stack.now()*-1);
				stack.set(stack.now() * -1);
				break;
			case "EeeEE":
			cmdflag(patterns.push);
				expl += "Square, "+stack.now()+" → "+Math.pow(stack.now(), 2);
				stack.set(Math.pow(stack.now(), 2));
				break;
			case "EeeEe":
			cmdflag(patterns.push);
				expl += "Cube, "+stack.now()+" → "+Math.pow(stack.now(),3);
				stack.set(Math.pow(stack.now(), 3));
				break;
			case "EeeeE":
			cmdflag(patterns.push);
				expl += "Square root, "+stack.now()+" → "+Math.sqrt(stack.now());
				var xres = Math.sqrt(stack.now());
				stack.set(xres ? xres : 0);
				break;
			case "Eeeee":
			cmdflag(patterns.push);
				expl += "Cube root, "+stack.now()+" → "+Math.cbrt(stack.now());
				stack.set(Math.cbrt(stack.now()));
				break;
			case "eEEEE":
			cmdflag(patterns.push);
				expl += "Modulus 2, "+stack.now()+" → "+(stack.now()%2);
				stack.set(stack.now()%2);
				break;
			case "eEEEe":
			cmdflag(patterns.push);
				expl += "Modulus 3, "+stack.now()+" → "+(stack.now()%3);
				stack.set(stack.now()%3);
				break;
			case "eEEeE":
			cmdflag(patterns.push);
				expl += "Left bit shift, "+stack.now()+" → "+(stack.now() << 1);
				stack.set(stack.now() << 1);
				break;
			case "eEEee":
			cmdflag(patterns.push);
				expl += "Logical right bit shift, "+stack.now()+" → "+(stack.now() >>> 1);
				stack.set(stack.now() >>> 1);
				break;
				// Empty slots

			// 6 E/e (2 value)
			case "EEEEEE":
			cmdflag(patterns.mix);
				expl += "Sum, "+stack.now()+" + "+other.now()+" = "+(stack.now() + other.now());
				stack.push(stack.pop() + other.pop());
				break;
			case "EEEEEe":
			cmdflag(patterns.mix);
				expl += "Substract, "+stack.now()+" - "+other.now()+" = "+(stack.now() - other.now());
				stack.push(stack.pop() - other.pop());
				break;
			case "EEEEeE":
			cmdflag(patterns.mix);
				expl += "Multiply, "+stack.now()+" * "+other.now()+" = "+(stack.now() * other.now());
				stack.push(stack.pop() * other.pop());
				break;
			case "EEEEee":
			cmdflag(patterns.mix);
				expl += "Divide, "+stack.now()+" / "+other.now()+" = "+(stack.now() / other.now());
				var xres = stack.pop() / other.pop();
				stack.push(isFinite(xres)? xres : 0);
				break;
			case "EEEeEE":
			cmdflag(patterns.mix);
				expl += "Join, "+stack.now()+" + "+other.now()+" = "+("" + stack.now() + other.now());
				stack.push(parseInt("" + stack.pop() + other.pop()));
				break;
			case "EEEeeE":
			cmdflag(patterns.mix);
				expl += "Split "+stack.now()+" every "+other.now()+" digits";
				var str = stack.pop().toString(10);
				var sep = other.pop();
				for (var m = 0; m < str.length; m += sep) {
					stack.push(str.substring(m, m + sep));
				}
				break;
			case "EEEeee":
			cmdflag(patterns.mix);
				expl += "Chunk - Split "+stack.now()+" to "+other.now()+" parts";
				var d2 = other.pop();
				var d1 = stack.pop().toString(10);
				for (var n = 0; n < d2; n++) {
					var len = Math.floor(d1.length / d2);
					var xres = parseFloat(n+1 < d2 ? d1.substring(len*n, len*n+len) : d1.substring(len*n));
					stack.push(xres);
				}
				break;
				// Empty slot
			case "EEeEEE":
			cmdflag(patterns.mix);
				expl += "Power, "+stack.now()+" ^ "+other.now()+" = "+Math.pow(stack.now(), other.now());
				stack.push(Math.pow(stack.pop(), other.pop()));
				break;
			case "EEeEEe":
			cmdflag(patterns.mix);
				expl += stack.now()+"th root of "+other.now()+" = "+nthroot(stack.now(), other.now());
				stack.push(nthroot(stack.pop(), other.pop()));
				break;
			case "EEeEeE":
			cmdflag(patterns.mix);
				expl += "Modulus, "+stack.now()+" % "+other.now()+" = "+(stack.now() % other.now());
				stack.push(stack.pop() % other.pop());
				break;
				// Empty slot
			case "EEeeEE":
			cmdflag(patterns.mix);
				expl += "Left bit shift, "+stack.now()+" << "+other.now()+" → "+(stack.now() << other.now());
				stack.push(stack.pop() << other.pop());
				break;
			case "EEeeEe":
			cmdflag(patterns.mix);
				expl += "Logical right bit shift, "+stack.now()+" >>> "+other.now()+" → "+(stack.now() >>> other.now());
				stack.push(stack.pop() >>> other.pop());
				break;
				// Empty slots
				

			// 7 E/e
			case "EEEEEEE": // move single
				if (false) { // don't remove, don't set to true. it's exactly like it should be.
					output("https://www.youtube.com/watch?v=m-NgHh36_vU");
				}
				expl += "Move "+stack.now()+" to the other stack";
				other.push(stack.pop());
				break;
			case "EEEEEEe": // copy single
				expl += "Copy "+stack.now()+" to the other stack";
				other.push(stack.now());
				break;
			case "EEEEEeE": // move all
			case "EEEEEee": // copy all
				for (var o = 0; o < stack.array.length; o++) {
					other.push(stack.array[o]);
				}
				if (scream == "EEEEEeE") { // move mode? Remove!
					stack.array.splice(0, stack.array.length);
					expl += "Move everything to the other stack";
				} else {
					expl += "Copy everything to the other stack. ";
					expl += "NOTE: This function might be bugged.";
				}
				break;
			case "EEEEeEE":
				expl += "Swap R with r";
				var temp = stacks.r;
				stacks.r = stacks.R;
				stacks.R = temp;
				break;
				// empty slot
			case "EEEEeeE":
				expl += "Diff - remove items from stack which are in the other stack too";
				stack.array.diff(other.array);
				break;
			case "EEEEeee":
				expl += "Reverse diff - remove items from stack which aren't in the other stack";
				stack.array.diff(other.array, true);
				break;

			// 8 E/e
			case "EEEEEEEE":
			cmdflag(patterns.mix);
				expl += "Sum stack content";
				stack.push(stack.array.reduce(function(a, b) {
					return a + b;
				}, 0));
				break;
			case "EEEEEEeE":
			cmdflag(patterns.mix);
				expl += "Multiply stack content";
				stack.push(stack.array.reduce(function(a, b) {
					return a * b;
				}, 1));
				break;
			case "EEEEEeEE":
			cmdflag(patterns.mix);
				expl += "Join stack content";
				stack.push(stack.array.reduce(function(a, b) {
					return window.parseInt(a.toString() + b.toString());
				}, 0));
				break;
			case "EEEEEeeE":
				expl += "Increment stack content";
				stack.array = stack.array.map(function(a) {
					return a+1;
				});
				break;
			case "EEEEEeee":
				expl += "Decrement stack content";
				stack.array = stack.array.map(function(a) {
					return a-1;
				});
				break;
			case "EEEEeEEE":
				expl += "Clear the stack";
				stack.array.length = 0;
				break;
			case "EEEEeEEe":
				expl += "Clear without removing selected item";
				var it = stack.now();
				stack.array.length = 0;
				stack.array.push(it);
				break;
			case "EEEEeEeE":
				expl += "Sort the stack";
				// source: https://stackoverflow.com/a/1063027/5147563
				stack.array.sort(function(a,b) {
						return a - b;
				});
				break;
			case "EEEEeEee":
				expl += "Reverse the stack";
				stack.array.reverse();
				break;
			case "EEEEeeEE":
				expl += "Shuffle the stack";
				stack.array.shuffle();
				break;

				// error
			default:
				if (scream.length == 9) {
					cmdflag(patterns.pos);
					var push = false;
					if (scream.charAt(0) == "E") {
						push = true;
					}
					var res = scream.substr(1).replace(/e/g, 0).replace(/E/g, 1).toString(2);
					var deb = res;
					res = parseInt(res, 2);
					
					if (push) {
						expl += "Push "+res;
						stack.push(res);
					} else {
						var str = String.fromCharCode(res);
						expl += "print '"+str+"'";
						output(str);
					}
				} else {
					expl += "ERROR: "+cmd+" doesn't exist"
					output(cmd + "ERROR!");
				}
		}
		
		if (flags["step"] || i >= code.length-1) {

			var xlabels = labels;

			delete xlabels.flag;
		
			debug(expl)
			debug("")
			
			debug("Labels:");
			debug("\t", JSON.stringify(xlabels));
			debug("");
			
			debug("Stacks:");
			debug("\tR", JSON.stringify(stacks.R.array));
			debug("\tr", JSON.stringify(stacks.r.array));
			debug("");
		}
		
		// console.log("Command done!", i);
		if (i >= code.length-1) {
			// Execution finished
			return [true, out, i];
		} else {
			// Or not
			return [false, out, i];
		}
	}
	
	var c = 0
	if (flags["step"]) {
		if (code.length) {
			return loop;
		} else {
			return false;
		}
	} else {
		while(true) {
			if (loop()[0]) break;
		}
	}
	return out;
}
