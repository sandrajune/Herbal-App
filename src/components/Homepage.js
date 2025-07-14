import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';

function Homepage() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await fetch('https://perenual.com/api/species-list?key=sk-bIXW686cebdc8abbf11332');
        const data = await response.json();
        setPlants(data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching plants:', err);
      }
    };
    fetchPlants();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Herbal Wellness</h1>
      <SearchBar plants={plants} />
      <h2 className="text-2xl font-semibold text-green-600 mb-4">Herbs Section</h2>
      {loading ? (
        <p>Loading plants...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plants.slice(0, 9).map((plant) => (
            <div key={plant.id} className="bg-white p-4 rounded-lg card-shadow">
              <img
                src={plant.default_image?.thumbnail || 'https://via.placeholder.com/150'}
                alt={plant.common_name}
                className="w-full h-32 object-cover rounded-md mb-2"
              />
              <h3 className="text-lg font-semibold text-green-700">{plant.common_name}</h3>
              <p className="text-gray-600">{plant.scientific_name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Homepage;