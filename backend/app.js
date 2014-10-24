/*jslint vars: true, node: true, white: true */
"use strict";

var express = require("express");
var bodyParser = require("body-parser");
var nunjucks = require("nunjucks");
var path = require("path");
var generateSeats = require("./seats");
var util = require("./util");

var startTitle = "ROCA Airways Web Check-In | Start";
var seatTitle = "ROCA Airways Web Check-In | Seat Selection";
var finishTitle = "ROCA Airways Web Check-In | Finished";

var app = express();
var app = module.exports = express();

app.set("startTitle", startTitle);
app.set("seatTitle", seatTitle);
app.set("finishTitle", finishTitle);

nunjucks.configure("templates", { autoescape: true, express: app });

app.use("/assets", express.static(path.join(__dirname, "..", "assets")));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(req, res) {
	var params = {
		title: app.get("startTitle"),
		includeCSS: req.query.css !== "0",
		includeJS: req.query.js !== "0",
		checkInURI: "/",
		devLinks: devLinks(req.url)
	};
	res.render("start.html", params);
});

app.post("/", function(req, res) {
	var flightID = req.body.flight;
	var passengerName = req.body.passengerName;

	// someone's being clever or client validation did not work
	if(flightID.indexOf("RC-") !== 0) {
		res.status(404).send("We're afraid flight " + flightID +
				" is not operated by ROCAir.");
		return;
	} else {
		var checkInURI = "/check-in/" + flightID + "?passengerName=" +  encodeURIComponent(passengerName);
		res.redirect(checkInURI);
	}
});

app.all("/check-in/:flight", function(req, res) {
	// validate request method -- XXX: we shouldn't be doing this manually
	var methods = ["GET", "POST"]; // TODO: OPTIONS, HEAD?
	if(methods.indexOf(req.method) === -1) {
		res.set("Allow", methods.join(", "));
		res.status(405).end();
		return;
	}

	var flightID = req.params.flight.toUpperCase();
	if(flightID.indexOf("RC-") !== 0) { // someone's being clever
		res.status(404).send("We're afraid flight " + flightID +
				" is not operated by ROCAir.");
		return;
	}

	var params = {
		title: app.get("seatTitle"),
		flightID: flightID
	};

	if(req.method === "GET") {
		var seatGenerator = generateSeats(24, 6, 0.3);

		params.checkInURI = ""; // i.e. self
		params.seats = seatGenerator.seats;
		params.selectedSeat = seatGenerator.selectedSeat;
		params.departure = oneWeekFromNow(1);
		params.arrival = oneWeekFromNow(2);
		params.passengerName = req.query.passengerName;
		params.includeCSS = req.query.css !== "0";
		params.includeJS = req.query.js !== "0";
		params.devLinks = devLinks(req.url);

		res.render("seats.html", params);
	} else {
		params.title = app.get("finishTitle");
		params.includeCSS = true;
		params.includeJS = true;
		params.selectedSeat = req.body.seat;
		res.render("confirmation.html", params);
	}
});

function oneWeekFromNow(hours) {
	var date = new Date();
	date.setDate(date.getDate()+7);
	date.setHours(date.getHours()+hours);
	return date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear()
		+ ', ' + date.getHours() + ':' + date.getMinutes() + 'h';
};

function devLinks(uri) {
	var links = [{
		label: "All on",
		desc: "Enable CSS and JavaScript",
		queryString: null
	}, {
		label: "Styles only",
		desc: "Disable JavaScript",
		queryString: "js=0"
	}, {
		label: "HTML only",
		desc: "Disable CSS and JavaScript",
		queryString: "css=0&js=0"
	}];
	links.forEach(function(link) {
		if (uri.indexOf("?") > -1) {
			link.uri = link.queryString ? [uri, link.queryString].join("&") : uri;
		} else {
			link.uri = link.queryString ? [uri, link.queryString].join("?") : uri;
		}

		delete link.queryString;
	});
	return links;
}
