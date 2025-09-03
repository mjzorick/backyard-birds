// React App for MJ's Backyard Birds
const { useState, useEffect } = React;


// Main App Component
function App() {
    const [sightings, setSightings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch recent bird sightings on component mount
    useEffect(() => {
        fetchRecentBirdSightings();
    }, []);

    // Fetch recent bird sightings from eBird API
    const fetchRecentBirdSightings = async () => {
        setLoading(true);
        setError(null);

        try {
            console.log('Fetching recent bird sightings from eBird API...');
            
            const response = await fetch('https://api.ebird.org/v2/data/obs/geo/recent?lat=34.08&lng=-118.20&sort=species', {
                method: 'GET',
                headers: {
                    'X-eBirdApiToken': 'kpf4t1mcqhee',
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('eBird API response:', data);
            
            if (data && data.length > 0) {
                // Limit to first 10 sightings for display
                setSightings(data.slice(0, 12));
                console.log(`Successfully loaded ${data.slice(0, 12).length} bird sightings`);
            } else {
                setSightings([]);
            }
            
        } catch (err) {
            console.error('Error fetching bird sightings:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return React.createElement(
        React.Fragment,
        null,
        React.createElement(SightingsSection, {
            sightings,
            loading,
            error,
            onRefresh: fetchRecentBirdSightings
        })
    );
}

// Sightings Section Component
function SightingsSection({ sightings, loading, error, onRefresh }) {
    return React.createElement(
        'div',
        null,
        React.createElement(
            'h2',
            { className: 'text-3xl font-bold text-center mb-8 text-blue-800' },
            'Recent Sightings in Los Angeles, CA'
        ),
        React.createElement(SightingsList, { sightings, loading, error })
    );
}

// Sightings List Component
function SightingsList({ sightings, loading, error }) {
    if (loading) {
        return React.createElement(
            'div',
            { id: 'sightingsList' },
            React.createElement(
                'div',
                { className: 'grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-8' },
                'Loading recent bird sightings...'
            )
        );
    }

    if (error) {
        return React.createElement(
            'div',
            { id: 'sightingsList' },
            React.createElement(
                'div',
                { className: 'grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-8' },
                `Error loading bird sightings: ${error}`
            )
        );
    }

    if (sightings.length === 0) {
        return React.createElement(
            'div',
            { id: 'sightingsList' },
            React.createElement('div', null, 'No recent sightings found.')
        );
    }

    return React.createElement(
        'div',
        { id: 'sightingsList',
            class: 'grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-8'
         },
        sightings.map((sighting, index) =>
            React.createElement(SightingItem, {
                key: `${sighting.speciesCode}-${index}`,
                sighting
            })
        )
    );
}

// Individual Sighting Item Component
function SightingItem({ sighting }) {
    return React.createElement(
        'div',
        { className: 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 hover:shadow-md transition-all duration-200' },
        React.createElement(
            'div',
            null,
            React.createElement(
                'strong',
                { className: 'text-orange-800' },
                sighting.comName
            ),
            ' ',
            React.createElement(
                'em',
                { className: 'text-gray-600' },
                `(${sighting.sciName})`
            ),
            React.createElement('br'),
            React.createElement(
                'small',
                { className: 'text-gray-500' },
                `Location: ${sighting.locName}`,
                React.createElement('br'),
                `Date: ${new Date(sighting.obsDt).toLocaleDateString()}`,
                React.createElement('br'),
                `Count: ${sighting.howMany || 'Not specified'}`
            )
        )
    );
}


// Individual Notable Bird Item Component
function NotableBirdItem({ bird }) {
    return React.createElement(
        'div',
        { className: 'bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-3 hover:shadow-md transition-all duration-200' },
        React.createElement(
            'div',
            { className: 'flex justify-between items-start' },
            React.createElement(
                'div',
                { className: 'flex-1' },
                React.createElement(
                    'h5',
                    { className: 'font-semibold text-blue-800 text-sm' },
                    bird.comName
                ),
                React.createElement(
                    'p',
                    { className: 'text-xs text-gray-600 italic mb-1' },
                    bird.sciName
                ),
                React.createElement(
                    'p',
                    { className: 'text-xs text-gray-700' },
                    `${bird.locName}`
                ),
                React.createElement(
                    'p',
                    { className: 'text-xs text-gray-500' },
                    `${new Date(bird.obsDt).toLocaleDateString()}`
                )
            ),
            React.createElement(
                'div',
                { className: 'text-right' },
                React.createElement(
                    'span',
                    { className: 'bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium' },
                    'Notable'
                ),
                bird.howMany && React.createElement(
                    'p',
                    { className: 'text-xs text-gray-500 mt-1' },
                    `Count: ${bird.howMany}`
                )
            )
        )
    );
}

// State Notable Birds List Component
function StateRegionsList({ regions, loading, error, stateName }) {
    if (loading) {
        return React.createElement(
            'div',
            { className: 'mt-4 p-4 bg-blue-50 rounded-lg' },
            React.createElement(
                'p',
                { className: 'text-blue-700 text-center' },
                '\Loading notable birds for your state...'
            )
        );
    }

    if (error) {
        return React.createElement(
            'div',
            { className: 'mt-4 p-4 bg-red-50 border border-red-200 rounded-lg' },
            React.createElement(
                'p',
                { className: 'text-red-700' },
                `${error}`
            )
        );
    }

    if (regions.length === 0) {
        return null; // Don't show anything if no search has been made
    }

    return React.createElement(
        'div',
        { className: 'mt-6' },
        React.createElement(
            'h4',
            { className: 'text-lg font-semibold text-blue-700 mb-3' },
            `Notable Birds in ${stateName} (${regions.length} found)`
        ),
        React.createElement(
            'div',
            { className: 'space-y-3 max-h-96 overflow-y-auto' },
            regions.map((bird, index) =>
                React.createElement(StateRegionItem, {
                    key: `${bird.speciesCode}-${index}`,
                    region: bird
                })
            )
        )
    );
}

// Individual State Notable Bird Item Component  
function StateRegionItem({ region: bird }) {
    return React.createElement(
        'div',
        { className: 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 hover:shadow-md transition-all duration-200' },
        React.createElement(
            'div',
            { className: 'flex justify-between items-start' },
            React.createElement(
                'div',
                { className: 'flex-1' },
                React.createElement(
                    'h5',
                    { className: 'font-semibold text-orange-800 text-sm mb-1' },
                    bird.comName
                ),
                React.createElement(
                    'p',
                    { className: 'text-xs text-gray-600 italic mb-2' },
                    bird.sciName
                ),
                React.createElement(
                    'div',
                    { className: 'text-xs text-gray-700 space-y-1' },
                    React.createElement(
                        'p',
                        null,
                        `📍 ${bird.locName}`
                    ),
                    React.createElement(
                        'p',
                        null,
                        `📅 ${new Date(bird.obsDt).toLocaleDateString()}`
                    ),
                    bird.howMany && React.createElement(
                        'p',
                        null,
                        `🔢 Count: ${bird.howMany}`
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'text-right' },
                React.createElement(
                    'span',
                    { className: 'bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium mb-2 inline-block' },
                    'Notable'
                ),
                bird.userDisplayName && React.createElement(
                    'p',
                    { className: 'text-xs text-gray-500 mt-1' },
                    `By: ${bird.userDisplayName}`
                )
            )
        )
    );
}

// Initialize React App
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 React App initialized!');
    
    // Handle the state form submission
    const stateForm = document.getElementById('stateForm');
    const stateBirdsList = document.getElementById('stateBirdsList');
    
    if (stateForm && stateBirdsList) {
        // Create React app instance for the state regions functionality
        const StateRegionsApp = () => {
            const [birds, setBirds] = useState([]);
            const [loading, setLoading] = useState(false);
            const [error, setError] = useState(null);
            const [stateName, setStateName] = useState('');

            // Fetch notable bird sightings by state code
            const fetchNotableBirdsByState = async (stateCode, selectedStateName) => {
                setLoading(true);
                setError(null);
                setBirds([]);

                try {
                    console.log(`Fetching notable birds for state: US-${stateCode}`);
                    
                    const response = await fetch(`https://api.ebird.org/v2/data/obs/US-${stateCode}/recent/notable?detail=full`, {
                        method: 'GET',
                        headers: {
                            'X-eBirdApiToken': 'kpf4t1mcqhee',
                        }
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    setBirds(data || []);
                    setStateName(selectedStateName);
                    console.log(`Found ${data.length} notable bird sightings for ${selectedStateName}`);                    
                    
                } catch (err) {
                    console.error('Error fetching notable birds:', err);
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            // Set up form event listener
            useEffect(() => {
                const handleFormSubmit = (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const stateCode = formData.get('stateSelect');
                    const selectedOption = e.target.querySelector(`option[value="${stateCode}"]`);
                    const selectedStateName = selectedOption ? selectedOption.textContent : stateCode;
                    
                    if (stateCode && stateCode.trim()) {
                        fetchNotableBirdsByState(stateCode.trim(), selectedStateName);
                    }
                };

                stateForm.addEventListener('submit', handleFormSubmit);
                return () => stateForm.removeEventListener('submit', handleFormSubmit);
            }, []);

            return React.createElement(StateRegionsList, {
                regions: birds,
                loading,
                error,
                stateName
            });
        };

        ReactDOM.render(React.createElement(StateRegionsApp), stateBirdsList);
    }
    
    // Find the existing sightings section and contact form, or create containers
    const sightingsContainer = document.getElementById('sightings') || 
                              document.querySelector('#sightings') || 
                              createSectionContainer('sightings');
    
    const contactContainer = document.getElementById('contact') ||
                           document.querySelector('#contact') ||
                           createSectionContainer('contact');

    // Render React components
    if (sightingsContainer) {
        // Clear existing content but keep the section structure
        const existingList = sightingsContainer.querySelector('#sightingsList');
        if (existingList) {
            existingList.parentNode.replaceChild(
                document.createElement('div'), 
                existingList
            );
        }
        
        // Mount the SightingsSection component
        const sightingsApp = React.createElement(App);
        ReactDOM.render(sightingsApp, sightingsContainer.querySelector('div') || sightingsContainer);
    }

    console.log('React components mounted and ready!');
});

// Helper function to create section containers if they don't exist
function createSectionContainer(id) {
    const section = document.createElement('section');
    section.id = id;
    document.querySelector('main').appendChild(section);
    return section;
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);