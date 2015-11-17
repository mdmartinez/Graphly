var width = 960,
    height = 500,
    color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-120)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("towns.json", function(error, graph) {
  if (error) throw error;

  var nodes = graph.nodes,
      links = graph.links,
      sp = new ShortestPathCalculator(nodes, links),
      froilaPoipuPath = sp.findRoute(1,9),
      froilaPoipuLinks = [],
      clickedNodes = [];

  for (i = 0; i < froilaPoipuPath['path'].length; i++) {
    for (j = 0;  j < links.length; j++) {
      if (links[j]['source'] == froilaPoipuPath['path'][i]['source'] &
          links[j]['target'] == froilaPoipuPath['path'][i]['target']) {
          froilaPoipuLinks.push(links[j]);
      };
    };
  };

  function click(d) {
    var node = d3.select(this).transition().attr("r", 18).style("fill", '#FFFC0D');
    clickedNodes.push(node);
    if(clickedNodes.length > 2) {
      previousNodeAgo = clickedNodes.shift(-1);
      d3.select(previousNodeAgo[0][0]).transition().attr("r", 12).style("fill", function(d) { return color(d.color); });
    }
    else if(clickedNodes.length == 2) {
        // findLinks.bind(sp,1,9);
    };
  };

  function findLinks(sourceNode,destinationNode) {
    spRoute = this.findRoute(sourceNode,destinationNode);
    spLinks = [];
    for (j = 0; j < spRoute['path'].length; j++) {
      for (i = 0;  i < links.length; i++) {
        if (links[i]['source'] == spRoute['path'][j]['source'] &
            links[i]['target'] == spRoute['path'][j]['target']) {
            spLinks.push(links[i]);
        };
      };
    };
  };

  force
    .nodes(nodes)
    .links(links)
    .linkDistance(function(link) { return link.distance*20 })
    .start();

  var link = svg.selectAll(".link")
      .data(links)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.distance); });

  var linksHighlighted = svg.selectAll(".active")
      .data(froilaPoipuLinks)
      .enter().append("line")
      .attr("class", "active")
      .style("stroke-width", function(d) { return Math.sqrt(d.distance); });

  var node = svg.selectAll(".node")
      .data(nodes)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", 12)
      .style("fill", function(d) { return color(d.color); })
      .on("click", click)
      .call(force.drag());

  node.append("title")
      .text(function(d) { return d.name; });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    linksHighlighted.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
});


