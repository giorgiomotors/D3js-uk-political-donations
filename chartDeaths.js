// GLOBALS
var w = 1000,h = 900;
var padding = 2;
var nodes = [];
var force, node, data, maxVal;
var brake = 0.2;
var radius = d3.scale.sqrt().range([10, 20]);

var partyCentres = { 
    con: { x: w / 3, y: h / 3.3}, 
    lab: {x: w / 3, y: h / 2.3}, 
    lib: {x: w / 3	, y: h / 1.8},
	
		Male: {x: w / 3.2	, y: h / 1.8},
		Female: {x: w / 3.5	, y: h / 2.8},
		Total: {x: w / 3.9	, y: h / 3.8}
  };

var partyCentres2 = { 
    con: { x: w / 3, y: h / 3.3}, 
    lab: {x: w / 3, y: h / 2.3}
  };
  
var entityCentres = { 
    company: {x: w / 3.65, y: h / 2.3},
		union: {x: w / 3.65, y: h / 1.8},
		other: {x: w / 1.15, y: h / 1.9},
		society: {x: w / 1.12, y: h  / 3.2 },
		pub: {x: w / 1.8, y: h / 2.8},
		
		Male: {x: w / 3.2	, y: h / 1.8},
		Female: {x: w / 3.5	, y: h / 2.8},
		Total: {x: w / 3.9	, y: h / 3.8},
	
		individual: {x: w / 3.65, y: h / 3.3},
	};

var fill = d3.scale.ordinal().range(["#0c2986", "#08722D", "#992230"]);

var svgCentre = { 
    x: w / 3.6, y: h / 2
  };

var svg = d3.select("#chart").append("svg")
	.attr("id", "svg")
	.attr("width", w)
	.attr("height", h);

var nodeGroup = svg.append("g");

var tooltip = d3.select("#chart")
 	.append("div")
	.attr("class", "tooltip")
	.attr("id", "tooltip");

var comma = d3.format(",.0f");

const rollSound = new Audio("./data/beep-08b.wav");

function transition(name) {
	if (name === "all-donations") {
		$("#initial-content").fadeIn(250);
		$("#value-scale").fadeIn(1000);
		$("#view-donor-type").fadeOut(250);
		$("#view-source-type").fadeOut(250);
		$("#view-party-type").fadeOut(250);
		$("#view-amount-type").fadeOut(250);
		rollSound.play();
		return total();
		//location.reload();
	}
	if (name === "group-by-party") {
		$("#initial-content").fadeOut(250);
		$("#value-scale").fadeOut(250);
		$("#view-donor-type").fadeOut(250);
		$("#view-source-type").fadeOut(250);
		$("#view-amount-type").fadeOut(250);
		$("#view-party-type").fadeIn(1000);
		rollSound.play();
		return partyGroup();
	}
	if (name === "group-by-amount-type") {
		$("#initial-content").fadeOut(250);
		$("#value-scale").fadeOut(250);
		$("#view-donor-type").fadeOut(250);
		$("#view-source-type").fadeOut(250);
		$("#view-party-type").fadeOut(250);
		$("#view-amount-type").fadeIn(1000);
		rollSound.play();
		return partyGroup2();
	}
	
	if (name === "group-by-donor-type") {
		$("#initial-content").fadeOut(250);
		$("#value-scale").fadeOut(250);
		$("#view-party-type").fadeOut(250);
		$("#view-source-type").fadeOut(250);
		$("#view-amount-type").fadeOut(250);
		$("#view-donor-type").fadeIn(1000);
		rollSound.play();
		return donorType();
	}
	if (name === "group-by-money-source")
	{
		$("#initial-content").fadeOut(250);
		$("#value-scale").fadeOut(250);
		$("#view-donor-type").fadeOut(250);
		$("#view-party-type").fadeOut(250);
		$("#view-amount-type").fadeOut(250);
		$("#view-source-type").fadeIn(1000);
		rollSound.play();
		return fundsType();
	}
}

function start() {

	node = nodeGroup.selectAll("circle")
		.data(nodes)
	.enter().append("circle")
		.attr("class", function(d) { return "node " + d.party; })
		.attr("amount", function(d) { return d.value; })
		.attr("donor", function(d) { return d.donor; })
		.attr("entity", function(d) { return d.entity; })
		.attr("party", function(d) { return d.party; })
		// disabled because of slow Firefox SVG rendering
		// though I admit I'm asking a lot of the browser and cpu with the number of nodes
		//.style("opacity", 0.9)
		.attr("r", 0)
		.style("fill", function(d) { return fill(d.party); })
		.on("click", click)
		.on("mouseover", mouseover)
		.on("mouseout", mouseout);
		// Alternative title based 'tooltips'
		// node.append("title")
		//	.text(function(d) { return d.donor; });

		
		force.gravity(0)
			.friction(0.75)
			.charge(function(d) { return -Math.pow(d.radius, 2) / 3; })
			.on("tick", all)
			.start();

		node.transition()
			.duration(2500)
			.attr("r", function(d) { return d.radius; });
			
			
}

function total() {

	force.gravity(0)
		.friction(0.9)
		.charge(function(d) { return -Math.pow(d.radius, 2) / 2.8; })
		.on("tick", all)
		.start();
}

function partyGroup() {
	//alert('Year');
	force.gravity(0)
		.friction(0.8)
		.charge(function(d) { return -Math.pow(d.radius, 2.0) / 3; })
		.on("tick", parties)
		.start()
		.colourByParty();
}
function partyGroup2() {
	force.gravity(0)
		.friction(0.8)
		.charge(function(d) { return -Math.pow(d.radius, 2.0) / 3; })
		.on("tick", parties2)
		.start();
		//.colourByParty();
}

function donorType() {
	//alert('Ages');
	force.gravity(0)
		.friction(0.8)
		.charge(function(d) { return -Math.pow(d.radius, 2.0) / 3; })
		.on("tick", entities)
		.start();
}

function fundsType() {
	
	force.gravity(0)
		.friction(0.75)
		.charge(function(d) { return -Math.pow(d.radius, 2.0) / 3; })
		.on("tick", types)
		.start();		
}

function parties(e) {
	node.each(moveToParties(e.alpha));

		node.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) {return d.y; });
}
function parties2(e) {
	node.each(moveToParties2(e.alpha));

		node.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) {return d.y; });
}

function entities(e) {
	node.each(moveToEnts(e.alpha));

		node.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) {return d.y; });
}

function types(e) {
	node.each(moveToFunds(e.alpha));


		node.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) {return d.y; });
}

function all(e) {
	node.each(moveToCentre(e.alpha))
		.each(collide(0.001));

		node.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) {return d.y; });
}


function moveToCentre(alpha) {
	return function(d) {
		var centreX = svgCentre.x + 75;
			if (d.value <= 10) {
				centreY = svgCentre.y + 75;
			} else if (d.value <= 101) {
				centreY = svgCentre.y + 55;
			} else if (d.value <= 1001) {
				centreY = svgCentre.y + 35;
			} else  if (d.value <= 10001) {
				centreY = svgCentre.y + 15;
			} else  if (d.value <= 100001) {
				centreY = svgCentre.y - 5;
			} else  if (d.value <= maxVal) {
				centreY = svgCentre.y - 25;
			} else {
				centreY = svgCentre.y;
			}

		d.x += (centreX - d.x) * (brake + 0.06) * alpha * 1.2;
		d.y += (centreY - 80 - d.y) * (brake + 0.06) * alpha * 1.2;
	};
}

function moveToParties(alpha) {

	var year1=0,year2=0;

	return function(d) {
		d.value = +d.value;
		var centreX = w / 3 + 50;
		if (d.entity === 'Male' || d.entity === 'Female')
		{
			if (d.party < 2012) {
				year1+=d.value;
				centreY = h / 3.3;
			} else {
				year2+=d.value;
				centreY = h / 2.3;
			}
		}
		else
		{ 
			d.x = -100;
			d.y = -100;
		}
		
		d.x += (centreX - d.x) * (brake + 0.02) * alpha * 1.1;
		d.y += (centreY - d.y) * (brake + 0.02) * alpha * 1.1;
		
		$("#year1").html(year1);
		$("#year2").html(year2);
		$("#pyear1").html(year1);
		$("#pyear2").html(year2);	
		
	};
}
function moveToParties2(alpha) {
	return function(d) {
		
		var centreX = svgCentre.x + 75;

			if (d.value <= 1000001) {
				centreY = svgCentre.y + 15;
			
			} else  if (d.value <= maxVal) {
				centreY = svgCentre.y - 65;
			} else {
				centreY = svgCentre.y;
			}

		d.x += (centreX - d.x) * (brake + 0.06) * alpha * 1.2;
		d.y += (centreY - 100 - d.y) * (brake + 0.06) * alpha * 1.2;
	};
}

function moveToEnts(alpha) {	

	var tage1=0,tage2=0,tage3=0;
	
	return function(d) {
		d.value = +d.value;
		var centreX = w / 3 + 80;
		if (d.donor === '1-4' || d.donor === '5-9' || d.donor === '10-14'|| d.donor === '15-19'|| d.donor === 'Infant')
		{
				centreY = h / 3.3;	
				tage1+=d.value;				
		}
		
		if (d.donor === '20-24' || d.donor === '25-29' || d.donor === '30-34' || d.donor === '35-39' || d.donor === '40-44' || d.donor === '45-49')
		{
				centreY = h / 2.3;		
				tage2+=d.value;				
		}
		
		if (d.donor === '50-54'|| d.donor === '55-59'|| d.donor === '60-64'|| d.donor === '65-69'|| d.donor === '70-74'|| d.donor === '75-79'|| d.donor === '80-84'|| d.donor === '85-89'|| d.donor === '90-94'|| d.donor === '95-99'|| d.donor === '100 and over')
		{
				centreY = h / 1.8;		
				tage3+=d.value;				
		}

		
		if (d.donor === 'Total')
		{ 
			d.x = -100;
			d.y = -100;
		}
		
		d.x += (centreX - d.x) * (brake + 0.02) * alpha * 1.1;
		d.y += (centreY - d.y) * (brake + 0.02) * alpha * 1.1;
		
		$("#tage1").html(tage1);
		$("#tage2").html(tage2);
		$("#tage3").html(tage3);
	};
	
	
}

function moveToFunds(alpha) {
	
	var sex1=0,sex2=0;
	
	return function(d) {		
	d.value = +d.value;
	
		var centreY = h / 2.8;
		var centreX = w / 1.8;
		
		if (d.entity === 'Male' || d.entity === 'Female')
		{
			if (d.entity === 'Male') {
				centreY = 380;
				centreX = 350;
				sex1+=d.value;
			} else {
				centreX = centreX + 160;
				centreY = 380;
				sex2+=d.value;
			}			
		}
		else
		{ 
			d.x = -100;
			d.y = -100;
		}
		
		d.x += (centreX - d.x) * (brake + 0.02) * alpha * 1.1;
		d.y += (centreY - d.y) * (brake + 0.02) * alpha * 1.1;
		
		$("#sex1").html(sex1);
		$("#sex2").html(sex2);
		$("#psex1").html(100*(sex1/Math.abs(sex1+sex2)).toPrecision(4));
		$("#psex2").html(100*(sex2/Math.abs(sex1+sex2)).toPrecision(4));
	};
}

// Collision detection function by m bostock
function collide(alpha) {
  var quadtree = d3.geom.quadtree(nodes);
  return function(d) {
    var r = d.radius + radius.domain()[1] + padding,
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2
          || x2 < nx1
          || y1 > ny2
          || y2 < ny1;
    });
  };
}

function display(data) {

	maxVal = d3.max(data, function(d) { return d.amount; });

	var radiusScale = d3.scale.sqrt()
		.domain([0, maxVal])
			.range([10, 20]);

	data.forEach(function(d, i) {
		var y = radiusScale(d.amount);
		var node = {
				radius: radiusScale(d.amount) / 5,
				value: d.amount,
				donor: d.donor,
				party: d.party,
				partyLabel: d.party,
				entity: d.entity,
				entityLabel: d.entity,
				color: 'blue',
				x: Math.random() * w,
				y: -y
      };
			
      nodes.push(node)
	});

	console.log(nodes);

	force = d3.layout.force()
		.nodes(nodes)
		.size([w, h]);

	return start();
}

function click(d, i) {
	window.open("https://www.google.gr/search?q="+d.donor, '_blank'); 
}

function mouseover(d, i) {
		  var text = d.donor+ ' '+d.value;
/*       var msg = new SpeechSynthesisUtterance();
      msg.rate = 0.6; 
      msg.pitch = 5; 
      msg.text = text;
      msg.onend = function(e) {
        console.log('Finished in ' + event.elapsedTime + ' seconds.');
      };
      speechSynthesis.speak(msg); */
	  
	// tooltip popup
	var mosie = d3.select(this);
	var amount = mosie.attr("amount");
	var donor = d.donor;
	var party = d.partyLabel;
	var entity = d.entityLabel;
	var offset = $("svg").offset();
	


	// image url that want to check
	var imageFile = "https://raw.githubusercontent.com/ioniodi/D3js-uk-political-donations/master/photos/" + donor + ".ico";

	
	
	// *******************************************
	
	
	

	

	
	var infoBox = 
	
	 							 "<p> Year: <b>" + party + "</b></p>"
								+ "<p> Sex: <b>" + entity + "</b></p>"
								+ "<p> Ages: <b>" + donor + "</b></p>"
								+ "<p> Total value of deaths: <b>" + amount + "</b></p>";
	
	
	mosie.classed("active", true);
	d3.select(".tooltip")
  	.style("left", (parseInt(d3.select(this).attr("cx") - 80) + offset.left) + "px")
    .style("top", (parseInt(d3.select(this).attr("cy") - (d.radius+150)) + offset.top) + "px")
		.html(infoBox)
			.style("display","block");
	
	
	}

function mouseout() {
	// no more tooltips
		var mosie = d3.select(this);

		mosie.classed("active", false);

		d3.select(".tooltip")
			.style("display", "none");
		}

$(document).ready(function() {
		d3.selectAll(".switch").on("click", function(d) {
      var id = d3.select(this).attr("id");
      return transition(id);
    });
	
	/* return d3.csv("data/7500up.csv", display); */
    return d3.csv("deaths.csv", display);

});


