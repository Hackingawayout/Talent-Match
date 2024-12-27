async function getSuggestions() {
    const query = document.getElementById('queryInput').value.toLowerCase();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ""; // Clear previous results

    console.log(`Fetching data for query: ${query}`); // Debug Log

    try {
        const response = await fetch(`http://localhost:5000/api/people?q=${query}`);
        console.log(`Response status: ${response.status}`); // Debug Log

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const suggestions = await response.json();
        console.log('Suggestions fetched:', suggestions); // Debug Log

        if (suggestions.length > 0) {
            resultsDiv.innerHTML = suggestions.map(person => `
                <div class="card">
                    <h3>${person.fullname}</h3>
                    <p><strong>Technical Skills:</strong> ${person.technical_skills.join(", ")}</p>
                    <p><strong>Projects:</strong> ${person.projects.join(", ")}</p>
                    <button onclick="openModal('${person.fullname}')">Request</button>
                </div>
            `).join('');
        } else {
            resultsDiv.innerHTML = `<p>No suggestions found for your query.</p>`;
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error); // Debug Log
        alert('Unable to fetch data from the database.');
    }
}


let currentPerson = null;

function openModal(personName) {
    currentPerson = peopleData.find(person => person.fullname === personName);
    document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function sendRequest() {
    const message = document.getElementById('messageInput').value;
    if (!message) {
        alert("Please enter your problem!");
        return;
    }

    alert(`Your request has been sent to ${currentPerson.fullname}!`);
    closeModal();

    // Simulating a notification back from the person
    setTimeout(() => {
        if (confirm(`${currentPerson.fullname} has accepted your request. Would you like to see their details?`)) {
            showPersonDetails(currentPerson);

            // Wait for 5 seconds before redirecting to chatPage.html
            setTimeout(() => {
                window.location.href = `chatPage.html?user=${encodeURIComponent(currentPerson.fullname)}`;
            }, 5000);  // Delay of 5 seconds before redirect
        }
    }, 3000);  // Simulate the 3 seconds before showing the confirmation dialog
}

function showPersonDetails(person) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <div class="card">
            <h3>${person.fullname}</h3>
            <p><strong>Technical Skills:</strong> ${person.technical_skills.join(", ")}</p>
            <p><strong>Projects:</strong> ${person.projects.join(", ")}</p>
            <button onclick="startChat('${person.fullname}')">Chat Now</button>
        </div>
    `;
}

function startChat(personName) {
    // Here, we initiate the chat by redirecting to the chatPage.html page
    window.location.href = `chatPage.html?user=${encodeURIComponent(personName)}`;
}
