"use strict";

/*
	Provides possibiltiy to use a layout
	to render the HTML file. Contents of file
	will be placed inside of @RenderBody in
	the file provided.
*/
const fs = require("fs");
const variable = require("./variable.js");

module.exports = function (content, dependencies) {

	let regex = /(@{)[^@<>]+}$/gm,
		result = regex.exec(content),
		json = null;

	if (result) {
		result = result[0].replace(`@`, '');
		try {
			json = JSON.parse(result);
		} catch (e) {
			throw Error `Call to JSON.parse() with ${result} resulted in an error.`;
		}
	}

	if (json && json["Layout"]) {
		let master = fs.readFileSync(json["Layout"], "utf8");

		if (json["Data"]) {
			master = variable(master, json["Data"]);
		}

		content = content.replace(regex, '');
		content = master.replace(/.{0,}@RenderBody.{0,}/ig, content);

		if (master) dependencies.push(json["Layout"]);
	}

	return content;
}