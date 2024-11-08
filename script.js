document.getElementById('analyzeButton').addEventListener('click', () => {
    const fileInput = document.getElementById('imageUpload');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select an image file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const base64Image = event.target.result.split(',')[1];

        fetch('/.netlify/functions/analyze-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: base64Image })
        })
        .then(response => response.json())
        .then(data => {
            displayResults(data);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while analyzing the image.');
        });
    };
    reader.readAsDataURL(file);
});

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (!data.sets || data.sets.length === 0) {
        resultsDiv.textContent = 'No Sets found.';
        return;
    }

    data.sets.forEach((set, index) => {
        const setDiv = document.createElement('div');
        setDiv.innerHTML = `<h3>Set ${index + 1}</h3>`;

        set.forEach(card => {
            const cardInfo = document.createElement('p');
            cardInfo.textContent = `Card: Number - ${card.number}, Shape - ${card.shape}, Color - ${card.color}, Shading - ${card.shading}`;
            setDiv.appendChild(cardInfo);
        });

        resultsDiv.appendChild(setDiv);
    });
}
