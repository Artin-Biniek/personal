#!/usr/bin/nodejs
// validate-submissions-a4.js
//
// validate submissions for COMP 3000 2021F Assignment 4
//

var fs = require("fs");

var files = process.argv.slice(2);
var expectedQuestionList = "1,2,3,4,5,6a,6b,6c,7,8";
var numQuestions = 10;

function lineEncoding(lines) {
    var n, i, s;

    for (i = 0; i < lines.length; i++) {
	s = lines[i];
	n = s.length;
	if (s[n-1] === '\r') {
	    return "DOS/Windows Text (CR/LF)";
	}
    }
    
    return "UNIX";
}

function checkSubmission(fn) {
    var f = fs.readFileSync(fn, "utf8");
    var lines = f.split('\n')
    var c = 0;
    var questionList = [];
    var questionString;
    var q = {};
    var e = {};
    var i;
    var lastQuestion = null;
    
    if (!/(.+)-comp3000-(.+)\.txt/.test(fn)) {
	console.log("ERROR " + fn + " doesn't follow the pattern " +
		    "<name>-comp3000-<assignment>.txt");
	return;
    }

    let encoding = lineEncoding(lines);
    if (encoding !== "UNIX") {
	console.log("ERROR " + fn + " is not a UNIX textfile, it is a "
		    + encoding + " file.");
	return;
    }

    if (!/^COMP 3000 2021F Assignment 4$/.test(lines[0])) {
	console.log("ERROR " + fn +
		    " doesn't start with \"COMP 3000 2021F Assignment 4\"");
	return;
    }
    
    try {
	e.name = lines[1].match(/^Name:(.+)/m)[1].trim();
	e.id = lines[2].match(/^Student ID:(.+)/m)[1].trim();
    } catch (error) {
	console.log("ERROR " + fn + " has bad Name or Student ID field");
	return;
    }
	    
    var questionRE = /^([0-9a-g]+)\.(.*)/;
    
    for (i = 4; i < lines.length; i++) {
	if (typeof(lines[i]) === 'string') {
	    lines[i] = lines[i].replace('\r','');
	}

	let m = lines[i].match(questionRE);
	if (m) {
	    c++;
	    questionList.push(m[1]);
	    q[m[1]] = m[2];
	    lastQuestion = m[1];
	} else {
	    if (lastQuestion !== null) {
		if ((q[lastQuestion] === '') || (q[lastQuestion] === ' ')) {
		    q[lastQuestion] = lines[i];
		} else {
		    q[lastQuestion] = q[lastQuestion] + "\n" + lines[i];
		}
	    }
	}
    }

    questionString = questionList.toString();
    if (questionString !== expectedQuestionList) {
        console.log("ERROR Bad questions in " + fn + ": " + questionString);
    } else {
        console.log("PASSED " + fn + ": " + e.name + " (" + e.id + ")");
    }
    
    return;
}


var i;

if (files.length < 1) {
    console.error("Please give a file to check.");
    process.exit(-1);
}

for (i = 0; i < files.length; i++) {
    checkSubmission(files[i]);
}