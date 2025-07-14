import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

function Forum() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const isAdmin = auth.currentUser?.email === 'admin@example.com'; // Example admin check

  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      const allPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(allPosts);
    };
    fetchPosts();
  }, []);

  const handleSubmitPost = async (e) => {
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
      fetchPosts();
    } catch (err) {
      console.error('Error submitting post:', err);
    }
  };

  const handleApprovePost = async (postId) => {
    await updateDoc(doc(db, 'posts', postId), { status: 'approved' });
    fetchPosts();
  };

  const handleDeletePost = async (postId) => {
    await deleteDoc(doc(db, 'posts', postId));
    fetchPosts();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-4">Library Forum</h1>
      <form onSubmit={handleSubmitPost} className="bg-white p-4 rounded-lg card-shadow mb-6">
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4 w-full"
        />
        <textarea
          placeholder="Post Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mb-4 w-full"
        />
        <button type="submit">Post Question</button>
      </form>
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white p-4 rounded-lg card-shadow">
            <h3 className="text-lg font-semibold text-green-700">{post.title}</h3>
            <p className="text-gray-600">{post.content}</p>
            <p className="text-sm text-gray-500">Status: {post.status}</p>
            {isAdmin && (
              <div className="mt-2 space-x-2">
                <button onClick={() => handleApprovePost(post.id)} className="bg-blue-600 hover:bg-blue-700">
                  Approve
                </button>
                <button onClick={() => handleDeletePost(post.id)} className="bg-red-600 hover:bg-red-700">
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Forum;