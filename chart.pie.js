// GLOBALS
var w = 1000,h = 900;

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

function total() {

d3.select("#fund1").remove();
d3.select("#fund2").remove();

d3.csv("data/7500up.csv", function(d) {
  d.amount = +d.amount;
  return d;
}, function(error, data) {
  if (error) throw error;

  
  	var svgPie = d3.select('svg')
  .append('svg')
  .attr('width', w)
  .attr('height', h)
   .attr('id', 'blue')
  .append('g');
 
	var radius = Math.min(w, h) / 3;
	
	var pie = d3.pie().value(function(d) { return d.amount; });
	var pathPie = d3.arc()
    .outerRadius(radius + 0)
    .innerRadius(0);
	var label = d3.arc()
    .outerRadius(radius - 30)
    .innerRadius(radius - 30);
	
   var arc = svgPie.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
      .attr("class", "arc").attr('transform', 'translate(' + 300 +  ',' + 300 + ')')
	  		.on("click", click)
		.on("mouseover", mouseover)
		.on("mouseout", mouseout);  
	  
   arc.append("path")
      .attr("d", pathPie)
      .attr("fill", function(d) { return d.data.color; });
  
    arc.append("text")
      .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
      .attr("dy", "0.35em")
	  //.attr("fill", function(d) { if(d.data.amount > 1000000) return 'yellow'; })
      .text(function(d) { if(d.data.amount > 1000000) return d.data.donor; });  

	   
});
}


function fundsType() {
	d3.select("#blue").remove();
	

d3.csv("data/7500up.csv", function(d) {
  d.amount = +d.amount;
  return d;
}, function(error, data) {
  if (error) throw error;

  
   var svgPie = d3.select('svg')
  .append('svg')
  .attr('width', w)
  .attr('height', h)
   .attr('id', 'fund1')
  .append('g').attr('transform', 'translate(' + 300 +  ',' + 300 + ')');
 
	var radius = Math.min(w, h) / 4;
	
	var pie = d3.pie().value(function(d) { return d.amount; });
	
	var pathPie = d3.arc()
    .outerRadius(radius + 0)
    .innerRadius(0);
	
	var label = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);
	

	
   var arc = svgPie.selectAll(".arc")
    .data(pie(data.filter(function(d){return d.entityname != "Public Funds";})) )
    .enter().append("g")
      .attr("class", "arc")
	  .on("click", click)
		.on("mouseover", mouseover)
		.on("mouseout", mouseout);
	  
   arc.append("path")
      .attr("d", pathPie)
      .attr("fill", function(d) { return d.data.color; });
  
    arc.append("text")
      .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
      .attr("dy", "0.35em")
      .text(function(d) { if(d.data.amount > 1000000) return d.data.donor; });  
	  
	  
	


   var svgPie2 = d3.select('svg')
  .append('svg')
  .attr('width', w)
  .attr('height', h)
   .attr('id', 'fund2')
  .append('g').attr('transform', 'translate(' + 750 +  ',' + 400 + ')');

	var radius2 = Math.min(w, h) / 6;
	
	var pie2 = d3.pie().value(function(d) { return d.amount; });
	
	var pathPie2 = d3.arc()
    .outerRadius(radius2 + 0)
    .innerRadius(0);
	
	var label2 = d3.arc()
    .outerRadius(radius2 - 40)
    .innerRadius(radius2 - 40);
	
	  //.filter(function(d){return d.entityname != "Public Funds";})
   var arc2 = svgPie2.selectAll(".arc")
    .data(pie(data.filter(function(d){return d.entityname === "Public Funds";})) )
    .enter().append("g")
      .attr("class", "arc")
	  		.on("click", click)
		.on("mouseover", mouseover)
		.on("mouseout", mouseout);  
	  
   arc2.append("path")
      .attr("d", pathPie2)
      .attr("fill", function(d) { return d.data.color; });
  
    arc2.append("text")
      .attr("transform", function(d) { return "translate(" + label2.centroid(d) + ")"; })
      .attr("dy", "0.35em")
      .text(function(d) { if(d.data.amount > 1000000) return d.data.donor; }); 

	   
});
	
}

function display(data) {

	var svgPie = d3.select('svg')
  .append('svg')
  .attr('width', w)
  .attr('height', h)
   .attr('id', 'blue')
  .append('g');
 
	var radius = Math.min(w, h) / 3;
	
	var pie = d3.pie().value(function(d) { return d.amount; });
	var pathPie = d3.arc()
    .outerRadius(radius + 0)
    .innerRadius(0);
	var label = d3.arc()
    .outerRadius(radius - 30)
    .innerRadius(radius - 30);
	
   var arc = svgPie.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
      .attr("class", "arc").attr('transform', 'translate(' + 300 +  ',' + 300 + ')')
	  		.on("click", click)
		.on("mouseover", mouseover)
		.on("mouseout", mouseout);  
	  
   arc.append("path")
      .attr("d", pathPie)
      .attr("fill", function(d) { return d.data.color; });
  
    arc.append("text")
      .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
      .attr("dy", "0.35em")
	  //.attr("fill", function(d) { if(d.data.amount > 1000000) return 'yellow'; })
      .text(function(d) { if(d.data.amount > 1000000) return d.data.donor; });  	
}


function click(d, i) {
	window.open("https://www.google.gr/search?q="+d.data.donor, '_blank'); 
}

function mouseover(d, i) {
      var text = d.data.donor+ ' '+d.value;
	  
      /* var msg = new SpeechSynthesisUtterance();
      msg.rate = 0.6; 
      msg.pitch = 5; 
      msg.text = text;
      msg.onend = function(e) {
        console.log('Finished in ' + event.elapsedTime + ' seconds.');
      };
      speechSynthesis.speak(msg); */
	  
	// tooltip popup
	var mosie = d3.select(this);
	var amount = d.value;
	var donor = d.data.donor;
	var party = d.data.party;
	var entity = d.data.entity;
	var offset = $("svg").offset();
	
	
	
	// image url that want to check
	var imageFile = "https://raw.githubusercontent.com/ioniodi/D3js-uk-political-donations/master/photos/" + donor + ".ico";
	var infoBox = "<p> Source: <b>" + donor + "</b> " +  "<span><img src='" + imageFile + "' height='42' width='42' onError='this.src=\"https://github.com/favicon.ico\";'></span></p>" 	
	
	 							+ "<p> Recipient: <b>" + party + "</b></p>"
								+ "<p> Type of donor: <b>" + entity + "</b></p>"
								+ "<p> Total value: <b>&#163;" + amount + "</b></p>";
	

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
	
    return d3.csv("data/7500up.csv", display);

});


