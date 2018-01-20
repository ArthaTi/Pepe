
	function o(p, r, s, f) {
  	// push if p, else output
    // remove if r
    // s = stack
    // f = function
  	if (p) {
    	s.push(f(s, r));
      return "";
    } else {
    	return f(s, r);
    }
  }

function pepe(code, inp) {
    var out  = "";
    var s = {
      r: [],
      R: [],
    };
    console.log(code.replace(/[^RE?!]/gi, ""), code.replace(/[^RE?!]/gi, "").replace(/(([rR])[^!]*!)|(([rR])[^?]*\?)/g, "$1$2$3$4"));
    code = code.replace(/[^RE?!]/gi, "").replace(/(([rR])[^!?]*!)|(([rR])[^!?]*\?)/g, "$1$2$3$4").split(/(?=R|[\?!])/gi);
    console.log(code);
	
  	var fs = {
    	
    };
    
    String.prototype.tarr = function() {
    	var cc = [];
      for(var i = 0; i < this.length; ++i) cc[i] = this.charCodeAt(i);
      return cc;
    }
    
    Array.prototype.ctr = function() {
    	var val = this[this.length-1];
    	return (val?val:0);
    }
    
    Array.prototype.last = function() {
    	if (this.length) {
    		return this.length - 1;
      } else {
      	return 0; 
      }
    }

    code.forEach(function(x,i) {
      var now;
      var other;
      if (x == "R") return;
      if (x == "!") {
        // later
        console.log("!");
        return;
      }
      if (x == "?") {
        // later
        console.log("?");
        return;
      }
      if (x.charAt(0).toUpperCase() == "R") {
        now = s[x.charAt(0)];
        other = s[(x.charAt(0)=="R"?"r":"R")];
        x = x.substr(1);
      }
      switch (x) {
      	// 1 E/e
      	case "E": // increment
        	now[now.last()] = now.ctr()+1;
        	break;
        case "e": // decrement
        	now[now.last()] = now.ctr()-1;
          break;
       	// 2 E/e
        case "Ee": // move
        case "EE": // copy
        	var counter = now.ctr();
          if (x=="Ee") delete now[now.last()];
          other.push(counter);
          break;
        case "ee":
        	var asnum = parseInt(inp);
        	if (isNaN(asnum)) {
            now.push.apply(now, inp.tarr());
          } else {
          	now.push(asnum);
          }
          break;
        case "eE":
        	now.push(0);
          break;
        // 3 E/e
        case "EEE": // Output as int
        case "EEe": // & pop
        	out += now.ctr();
          if (x=="EEe") delete now[now.last()];
        	break;
        case "EeE": // Output as str
        case "Eee": // & pop
        	out += String.fromCharCode(now.ctr());
          if (x=="Eee") delete now[now.last()];
        	break;
        case "eEE": // Join & output
        case "eEe": // & clear
        	now.forEach(function(t, i) {
          	out += t;
          });
          now.length = 0;
        	break;
        case "eeE": // Join & output
        case "eee": // & clear
        	now.forEach(function(t, i) {
          	out += String.fromCharCode(t);
          });
          if (x=="eee") {
          	now.length = 0;
          }
        	break;
        // 4 E/e
        case "EEEE": // Sum the stack
        case "EEEe": // & clear
        case "EeEE": // & push
        case "EeEe": // & clear & push
        	var sum = 0;
        	now.forEach(function(t, i) {
          	sum += t;
          });
          if (x=="EEEe" || x=="EeEe") {
          	now.length = 0;
          }
          if (x=="EeEE" || x=="EeEe") {
          	now.push(sum);
          } else {
          	out += sum;
          }
        	break;
      }
      console.log(x, now, other);
    });
    return out;
  });