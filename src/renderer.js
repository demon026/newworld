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

function displayCountries(countries) {
    const content = document.getElementById('content');
    content.innerHTML = ''; // Clear previous content

    countries.forEach(country => {
        const languages = country.languages && Object.values(country.languages).join(', ') || "N/A";
        const timezones = country.timezones && country.timezones.join(', ') || "N/A";
        const area = country.area && `${country.area.toLocaleString()} km²` || "N/A";
        const continent = country.continents && country.continents[0] || "N/A";
        const subregion = country.subregion || "N/A";
        
        const countryElement = document.createElement('div');
        countryElement.classList.add('country');
        
        countryElement.innerHTML = `
            <h2>${country.name.common}</h2>
            <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" class="flag">
            <p><strong>Area:</strong> ${area}</p>
            <p><strong>Continent:</strong> ${continent}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <p><strong>Subregion:</strong> ${subregion}</p>
            <p><strong>Capital City:</strong> ${country.capital && country.capital[0] || "N/A"}</p>
            <p><strong>Languages:</strong> ${languages}</p>
            <p><strong>Time Zones:</strong> ${timezones}</p>
            <img src="${country.coatOfArms.svg}" alt="Flag of ${country.name.common}" class="flag">
            <p><a href="${country.maps.googleMaps}" target="_blank">View on Google Maps</a></p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <button onclick="addItinerary('${country.name.common}')">Add to Itinerary</button>
        `;
        
        content.appendChild(countryElement);
    });
}

// Search countries by name
function searchCountries() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filteredCountries = allCountries.filter(country =>
        country.name.common.toLowerCase().includes(searchInput)
    );
    displayCountries(filteredCountries);
}
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') { // Check if the Enter key is pressed
        searchCountries(); // Call the search function
    }
});

// Initialize itineraries
function getItineraries() {
    return JSON.parse(localStorage.getItem('itineraries')) || [];
}

// Save itineraries to storage
function saveItineraries(itineraries) {
    localStorage.setItem('itineraries', JSON.stringify(itineraries));
}

// Add country to itinerary
function addItinerary(countryName) {
    const itineraries = getItineraries();
    if (!itineraries.some(itinerary => itinerary.country === countryName)) {
        const newItinerary = {
            id: Date.now(),
            country: countryName,
            notes: ""
        };
        itineraries.push(newItinerary);
        saveItineraries(itineraries);
        alert(`${countryName} added to your itinerary.`);
    } else {
        alert(`${countryName} is already in your itinerary.`);
    }
}

// Event listeners for navigation
document.getElementById('viewCountriesBtn').addEventListener('click', fetchCountries);
document.getElementById('searchBtn').addEventListener('click', searchCountries);

// Initial fetch of countries
fetchCountries();
