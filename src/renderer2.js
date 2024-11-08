let allCountries = []; // Store all countries here

async function fetchCountries() {
    const content = document.getElementById('content');
    content.innerHTML = '<p>Loading countries...</p>';
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        allCountries = await response.json();
        displayCountries(allCountries);
    } catch (error) {
        content.innerHTML = '<p>Error fetching countries. Please try again later.</p>';
        console.error('Error fetching countries:', error);
    }
}

function displayItineraries() {
    const content = document.getElementById('content');
    const itineraries = getItineraries();
    content.innerHTML = ''; // Clear previous content

    if (itineraries.length === 0) {
        content.innerHTML = '<p>No itineraries added yet.</p>';
        return;
    }

    itineraries.forEach(itinerary => {
        const itineraryElement = document.createElement('div');
        itineraryElement.classList.add('itinerary');
        itineraryElement.innerHTML = `
            <h3>${itinerary.country}</h3>
            <textarea data-id="${itinerary.id}" placeholder="Add notes here...">${itinerary.notes}</textarea>
            <button onclick="updateItinerary(${itinerary.id})">Update Notes</button>
            <button onclick="deleteItinerary(${itinerary.id})">Delete Itinerary</button>
        `;
        content.appendChild(itineraryElement);
    });
}

function getItineraries() {
    return JSON.parse(localStorage.getItem('itineraries')) || [];
}

// Save itineraries to storage
function saveItineraries(itineraries) {
    localStorage.setItem('itineraries', JSON.stringify(itineraries));
}

function updateItinerary(id) {
    const itineraries = getItineraries();
    const itinerary = itineraries.find(it => it.id === id);
    if (itinerary) {
        const textarea = document.querySelector(`textarea[data-id="${id}"]`);
        itinerary.notes = textarea.value;
        saveItineraries(itineraries);
        alert('Itinerary updated.');
    } else {
        alert('Itinerary not found.');
    }
}

// Delete itinerary
function deleteItinerary(id) {
    let itineraries = getItineraries();
    itineraries = itineraries.filter(it => it.id !== id);
    saveItineraries(itineraries);
    displayItineraries();
    alert('Itinerary deleted.');
}

document.getElementById('viewCountriesBtn').addEventListener('click', fetchCountries);
document.getElementById('itinerariesBtn').addEventListener('click', displayItineraries);

fetchCountries();