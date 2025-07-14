import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

function SearchBar({ plants }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [userPosts, setUserPosts] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserPosts(posts);
    };
    fetchPosts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const lowerCaseTerm = searchTerm.toLowerCase();
    const filteredPlants = plants.filter(
      plant =>
        plant.common_name.toLowerCase().includes(lowerCaseTerm) ||
        plant.scientific_name.toLowerCase().includes(lowerCaseTerm)
    );
    const filteredPosts = userPosts.filter(
      post =>
        post.title.toLowerCase().includes(lowerCaseTerm) ||
        post.content.toLowerCase().includes(lowerCaseTerm)
    );
    setResults([...filteredPlants, ...filteredPosts]);
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSearch} className="flex space-x-2">
        <input
          type="text"
          placeholder="Search herbs or posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        <button type="submit">Search</button>
      </form>
      {results.length > 0 && (
        <div className="mt-4 bg-white p-4 rounded-lg card-shadow">
          <h3 className="text-lg font-semibold text-green-700">Search Results</h3>
          {results.map((result, index) => (
            <div key={index} className="border-b py-2">
              {result.common_name ? (
                <>
                  <h4 className="font-semibold">{result.common_name}</h4>
                  <p>{result.scientific_name}</p>
                </>
              ) : (
                <>
                  <h4 className="font-semibold">{result.title}</h4>
                  <p>{result.content.substring(0, 100)}...</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;