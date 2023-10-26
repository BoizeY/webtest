//this file handles the file input and output

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

    // Once all files are read, you can work with the merged data
    console.log(mergedData);


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