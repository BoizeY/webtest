
// Survey data to be stored in an array
const surveyData = [];

// CSV content to be downloaded
let csvContent = "";

// Function to parse through the survey questions and answers and store them in an array(surveyData)
function handleAnswers() {
    const questions = document.querySelectorAll('.question');
    const answers = document.querySelectorAll('.answer');

    // Loop through all questions and answers
    for (let i = 0; i < questions.length; i++) {

        // Check if the answer is likert scale of radio buttons
        if (answers[i].tagName === 'UL') {
            const radioButtons = answers[i].querySelectorAll('input[type="radio"]');
            // Loop through each radio button
            radioButtons.forEach(radioButton => {
                // Check if the radio button is selected
                if (radioButton.checked) {
                    // get value of the selected radio button to be the answer
                    answers[i].value = radioButton.value;
                    console.log(`Selected value: ${radioButton.value}`);
                }
            });
        }
        // Add question and answer to survey data
        surveyData.push({
            question: questions[i].textContent,
            answer: answers[i].value
        });
    }

}

// when user clicks submit button
window.addEventListener("DOMContentLoaded", (event) => {
    // Add a click event listener to the submit button
    const submitBtn = document.querySelector('#submit-btn');
    submitBtn.addEventListener('click', () => {

        handleAnswers();

        console.log('Submit button clicked!');

        // Add header row
        const headerRow = surveyData.map(data => data.question);
        csvContent += headerRow.join(',') + '\n';

        // Add answer row
        const answerRow = surveyData.map(data => data.answer);
        csvContent += answerRow.join(',') + '\n';

        exportToCSV();
    });

    // when user clicks reload button
    const reloadBtn = document.querySelector('#reload-btn');
    // Add a click event listener to the reload button
    reloadBtn.addEventListener('click', () => {
        // Reload the HTML page
        location.reload();
    });

});

// Function to convert the merged data to CSV and create a download link
function exportToCSV() {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Participant_' + surveyData[0].answer + '_Survey' + '.csv';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
};
