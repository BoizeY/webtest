

function drawGraphMain(data) {
    const headers = data[0];
    const numColumns = headers.length;

    //clear anything existing graphs in the graph container
    const graphContainer = document.querySelector('#graph-container');
    graphContainer.innerHTML = '';
    

    for (let i = 0; i < numColumns; i++) {
        const header = headers[i];

        if (header.includes("{int}")) {
            // perform action for integer data
            console.log(`Processing integer data for column ${i}`);


        } else if (header.includes("{options}")) {
            // perform action for options data
            console.log(`Processing options data for column ${i}`);

            const bars = sortOptionsData(data);

            // Create the bar graph
            createBarGraph(bars.map(bar => bar.value), bars.map(bar => bar.label));

        } else if (header.includes("{likert}")) {
            // perform action for likert data
            console.log(`Processing likert data for column ${i}`);
        } else {
            // handle other cases
            console.log(`No action defined for column ${i}`);
        }
    }
}

function sortOptionsData(data) {
    // Create an object to store the counts of each string
    const counts = {};

    // Loop through the data and count the occurrences of each string
    for (let i = 0; i < data.length; i++) {
        const str = data[i];

        if (counts[str]) {
            counts[str]++;
        } else {
            counts[str] = 1;
        }
    }

    // Create an array of objects with the string and count for each bar
    const bars = Object.keys(counts).map(str => ({
        label: str,
        value: counts[str]
    }));

    // Sort the bars in descending order of count
    bars.sort((a, b) => b.value - a.value);

    // Create the bar graph
    //createBarGraph(bars.map(bar => bar.value), bars.map(bar => bar.label));
    return bars;
}

function createBarGraph(values, labels) {
    // Create a bar graph
    const barGraph = document.createElement('div');
    barGraph.id = 'bar-graph';

    // Create a bar for each value
    values.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.width = `${value * 10}px`;
        bar.textContent = labels[index];
        barGraph.appendChild(bar);
    });

    // Add the bar graph to the page
    const graphContainer = document.querySelector('#graph-container');
    graphContainer.appendChild(barGraph);
}

function getRangeAndCount(data, interval) {
    // Sort the data in ascending order
    data.sort((a, b) => a - b);

    // Initialize variables
    let rangeStart = data[0];
    let rangeEnd = rangeStart + interval;
    let count = 0;
    const result = [];

    // Loop through the data and count the integers in each range
    for (let i = 0; i < data.length; i++) {
        const num = data[i];

        if (num >= rangeStart && num < rangeEnd) {
            count++;
        } else {
            // Add the range and count to the result array
            result.push({
                range: `${rangeStart}-${rangeEnd - 1}`,
                count
            });

            // Reset variables for the next range
            rangeStart = rangeEnd;
            rangeEnd += interval;
            count = 1;
        }
    }

    // Add the last range and count to the result array
    result.push({
        range: `${rangeStart}-${rangeEnd - 1}`,
        count
    });

    return result;
}