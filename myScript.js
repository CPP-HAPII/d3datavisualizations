var waterData=[
    {Year: '2013', Qty:478},
    {Year: '2014', Qty:410},
    {Year: '2015', Qty:421},
    {Year: '2016', Qty:404},
    {Year: '2017', Qty:410}
];
var svg=d3.select("#svg");

var padding={top:20,right:30,bottom:30,left:50};

var colors=d3.schemeCategory20c;

var chartArea={
    "width":parseInt(svg.style("width"))-padding.left-padding.right,
    "height":parseInt(svg.style("height"))-padding.top-padding.bottom
};

var yScale = d3.scaleLinear()
    .domain([0,d3.max(waterData,function(d,i) {return d.Qty})])
    .range([chartArea.height,0]).nice();

var xScale = d3.scaleBand()
    .domain(waterData.map(function(d) {return d.Year}))
    .range([0,chartArea.width])
    .padding(.2); //space between bar graphs

var xAxis=svg.append("g")
    .classed("xAxis",true)
    .attr(
        'transform', 'translate('+padding.left+','+(chartArea.height+ padding.top)+')'
    )
    .call(d3.axisBottom(xScale));

var yAxisFn=d3.axisLeft(yScale);
var yAxis=svg.append("g")
        .classed("yAxis", true)
        .attr(
            'transform', 'translate('+padding.left+','+padding.top+')'
        );
yAxisFn(yAxis);

var grid=svg.append("g")
    .attr("class", "grid")
    .attr(
        'transform', 'translate('+padding.left+','+padding.top+')'
    )
    .call(d3.axisLeft(yScale)
        .tickSize(-(chartArea.width))
        .tickFormat("")
    )
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -30)
    .attr('text-anchor', 'end')
    .attr('stroke', 'black')
    .text('Million Gallons');
    

var rectGrp=svg.append("g").attr(
    'transform', 'translate('+padding.left+','+padding.top+')'
);

rectGrp.selectAll("rect")
    .data(waterData)
    .enter().append("rect")
    .attr("class", "rect")
    .on("mouseover", onMouseOver)
    .on("mouseout", onMouseOut)
    .attr("width", xScale.bandwidth())
    .transition()
    .ease(d3.easeLinear)
    .duration(300)
    .delay(function(d,i) { return i * 50})
    .attr("height", function (d,i) {
        return chartArea.height-yScale(d.Qty);
    })
    .attr("x", function(d,i) {
        return xScale(d.Year);
    })
    .attr("y", function(d,i) {
        return yScale(d.Qty);
    })
    .attr("fill", function(d,i) {
        return colors[i];
    });

    function onMouseOver(d,i)
    {   // Get bar's xy values, then augment for the tooltip
        var xPos = parseFloat(d3.select(this).attr('x')) + xScale.bandwidth() / 2;
        var yPos = parseFloat(d3.select(this).attr('y')) / 2 + height / 2

        //Update Tooltip's position and value
        d3.select('#tooltip')
            .style('left', xPos + 'px')
            .style('top', yPos + 'px')
            .select('#value').text(i.value)


        d3.select(this).attr('class', 'highlight')
        d3.select(this)
            .transition()
            .duration(500)
            .attr('width', xScale.bandwidth() + 5)
            .attr('y', function(d){return height - yScale(d.value) + 10;})
    }

    function onMouseOut(d,i)
    {
        d3.select(this).attr('class', 'rect')
        d3.select(this)
            .transition()
            .duration(500)
            .attr('width', xScale.bandwidth())
            .attr('y', function(d){return height - yScale(d.value);})

        d3.select('#tooltip').classed('hidden', true);
    }
