function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/data/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("static/data/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("static/data/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = result.otu_ids;
    var otuLabels = result.otu_labels;
    var sampleValues = result.sample_values;
    // Create a variable that holds the washing frequency.
    var wFreq = data.metadata.filter(sampleObj => sampleObj.id == sample)[0].wfreq;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are first. 

    var yticks = otuIds.sort((a,b) => b.sampleValues - a.sampleValues).slice(0,10).map(otuId => "OTU " + otuId);
    // yticks.map(otuId => "OTU " + otuId)
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues,
      y: yticks,
      text: otuLabels, 
      name: "Sample",
      type: "bar",
      orientation: "h"
    }
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      yaxis: {
        autorange: "reversed"
      },
      plot_bgcolor: "#D9EDF7",
      paper_bgcolor: "#D9EDF7"
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Earth'  
      }
    }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {
        title: "OTU ID"
      },
      width: 1200,
      height: 550,
      margin: {
        b: 75, 
        t: 50
      },
      hovermode: "closest",
      plot_bgcolor: "#D9EDF7",
      paper_bgcolor: "#D9EDF7"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: wFreq,
      type: "indicator",
      mode: "gauge+number",
      title: {
        text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week"
      },
      gauge: {
        axis: {
          range: [null, 10],
          dtick: 2,
          tick0: 0
        },
        bar: {
          color: "midnightblue"
        },
        steps: [
          {range: [0,2], color: "red"},
          {range: [2,4], color: "orange"},
          {range: [4,6], color: "yellow"},
          {range: [6,8], color: "yellowgreen"},
          {range: [8,10], color: "green"}
        ]
      },
      number: {
        font: {color: "midnightblue", size: 90}
      }
    }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      margin: {
        b: 0, 
        t: 0,
        r: 25,
        l: 25
      },
      paper_bgcolor: "#D9EDF7"
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}
