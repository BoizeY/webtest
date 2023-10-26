// Add a click event listener to the merge files button
document.getElementById('mergeFiles').addEventListener('click', function () {
    const filesInput = document.getElementById('csvFileInput');
    const files = filesInput.files;
    let isFirstFile = true;
    // Initialize mergedData as an empty array
    let mergedData = [];

    if (files.length === 0) {
        alert('Please select CSV files to merge.');
        return;
    }

    const readFile = (file, isFirstFile) => {
        // Return a promise to read the file
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                const csvData = event.target.result;
                const lines = csvData.split('\n');

                // Process each line of the CSV
                let fileData = [];
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (line) {
                        const values = line.split(',');

                        // If it's not the first file, skip adding the header row
                        if (!isFirstFile && i === 0) {
                            continue;
                        }
                        else {
                            fileData.push(values);
                        }
                    }
                }
                resolve(fileData);
            };

            reader.onerror = (event) => {
                reject(event.target.error);
            };

            reader.readAsText(file);
        });
    };

    // Read each file and add it to the promises array
    const promises = [];
    for (let i = 0; i < files.length; i++) {

        // Read each file and add it to the promises array, along with a boolean to mark the first file
        promises.push(readFile(files[i], isFirstFile));
        // Update to mark the first file as read
        isFirstFile = false;
    }

    // Once all files are read, merge the data
    Promise.all(promises)
        .then((results) => {
            // Combine all file data into a single array
            mergedData = results.flat();

            // Create a table with the merged data here
            createTable(mergedData);
        })
        .catch((error) => {
            console.error(error);
        });

    // Function to convert the merged data to CSV and create a download link
    const exportToCSV = () => {
        const csvContent = mergedData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'merged_data.csv';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.getElementById('exportButton').remove();
    };

    // Remove the previous export button (if any)
    if (document.getElementById('exportButton')) {
        document.getElementById('exportButton').remove();
    }

    // Add a button to export the merged data to CSV
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export as CSV';
    exportButton.id = 'exportButton';
    exportButton.addEventListener('click', exportToCSV);
    document.body.appendChild(exportButton);

    // Remove the previous graph button (if any)
    if (document.getElementById('graphButton')) {
        document.getElementById('graphButton').remove();
    }

    // Add a button to create graphs from the merged data
    const graphButton = document.createElement('button');
    graphButton.textContent = 'Create Graphs';
    graphButton.id = 'graphButton';
    graphButton.addEventListener('click', function () {
        drawGraphMain(mergedData);
    });
    document.body.appendChild(graphButton);

});

// Function to create a table from the merged data
function createTable(data) {
    // Create table element
    const tableContainer = document.getElementById('tableContainer');
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    console.log(data);
    console.log(data.length);

    // Check if data array is empty or undefined
    if (!data || data.length === 0) {
        console.error('Data array is empty or undefined');
        return;
    }

    // Create table headers
    for (let i = 0; i < data[0].length; i++) {
        const headerCell = document.createElement('th');
        headerCell.textContent = data[0][i];
        headerRow.appendChild(headerCell);
    }

    table.appendChild(headerRow);

    // Create table rows
    for (let i = 1; i < data.length; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < data[i].length; j++) {
            const cell = document.createElement('td');
            cell.textContent = data[i][j];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    // Clear previous table (if any) and append the new one
    tableContainer.innerHTML = '';
    tableContainer.appendChild(table);
}





/********************************************************************************************************************************************/

/* drawing graphs functions from here on */

function drawGraphMain(data) {
    const headers = data[0];
    const numColumns = headers.length;

    //reverse the row and column of data
    const dataTransposed = data[0].map((col, i) => data.map(row => row[i]));

    //clear anything existing graphs in the graph container
    const graphContainer = document.querySelector('#graphicsContainer');
    graphContainer.innerHTML = '';


    for (let i = 0; i < numColumns; i++) {
        const header = headers[i];

        if (header.includes("{int}")) {
            // perform action for integer data
            console.log(`Processing integer data for column ${i}`);


        } else if (header.includes("{options}")) {
            // perform action for options data
            console.log(`Processing options data for column ${i}`);

            const bars = sortOptionsData(dataTransposed[i]);

            // Create the bar graph
            createBarGraph(header, bars.map(bar => bar.value), bars.map(bar => bar.label));

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

    // Loop through the data and count the occurrences of each string, excluding the header row
    for (let i = 1; i < data.length; i++) {
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


    return bars;
}

function createBarGraph(title, values, labels) {
    // Create a bar graph
    const barGraph = document.createElement('div');
    barGraph.id = 'bar-graph';

    //create title for the graph
    const titleElement = document.createElement('h2');
    titleElement.textContent = title;
    barGraph.appendChild(titleElement);

    // Create a bar for each value
    values.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.width = `${value * 10}px`;
        bar.style.background = 'grey'
        bar.textContent = labels[index];
        barGraph.appendChild(bar);
    });

    // Add the bar graph to the page
    const graphContainer = document.querySelector('#graphicsContainer');
    graphContainer.appendChild(barGraph);
}