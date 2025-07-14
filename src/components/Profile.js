import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

function Profile() {
  const [remedies, setRemedies] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchRemedies = async () => {
      const q = query(collection(db, 'posts'), where('userId', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const userRemedies = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRemedies(userRemedies);
    };
    fetchRemedies();
  }, []);

  const handleSubmitRemedy = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'posts'), {
        title,
        content,
        userId: auth.currentUser.uid,
        createdAt: new Date(),
        status: 'pending'
      });
      setTitle('');
      setContent('');
      fetchRemedies();
    } catch (err) {
      console.error('Error submitting remedy:', err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-4">My Profile</h1>
      <h2 className="text-xl font-semibold text-green-600 mb-4">Submit a Remedy</h2>
      <form onSubmit={handleSubmitRemedy} className="bg-white p-4 rounded-lg card-shadow mb-6">
        <input
          type="text"
          placeholder="Remedy Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4 w-full"
        />
        <textarea
          placeholder="Remedy Details"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mb-4 w-full"
        />
        <button type="submit">Submit Remedy</button>
      </form>
      <h2 className="text-xl font-semibold text-green-600 mb-4">My Remedies</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {remedies.map(remedy => (
          <div key={remedy.id} className="bg-white p-4 rounded-lg card-shadow">
            <h3 className="text-lg font-semibold text-green-700">{remedy.title}</h3>
            <p className="text-gray-600">{remedy.content}</p>
            <p className="text-sm text-gray-500">Status: {remedy.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;