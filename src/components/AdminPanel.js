import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';

function AdminPanel() {
  const [userRole, setUserRole] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [remedies, setRemedies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        const role = userDoc.data()?.role || 'user';
        setUserRole(role);
        if (role === 'admin') {
          // Fetch users
          const usersSnapshot = await getDocs(collection(db, 'users'));
          setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          // Fetch posts
          const postsSnapshot = await getDocs(collection(db, 'posts'));
          setPosts(postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          // Fetch remedies
          const remediesSnapshot = await getDocs(collection(db, 'remedies'));
          setRemedies(remediesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } else {
          navigate('/'); // Redirect non-admins
        }
      }
    };
    fetchData();
  }, [navigate]);

  const updateUserRole = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setUsers(users.map(user => (user.id === userId ? { ...user, role: newRole } : user)));
    } catch (err) {
      console.error('Error updating role:', err);
    }
  };

  const handleApprovePost = async (postId) => {
    try {
      await updateDoc(doc(db, 'posts', postId), { approved: true });
      setPosts(posts.map(post => (post.id === postId ? { ...post, approved: true } : post)));
    } catch (err) {
      console.error('Error approving post:', err);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  if (userRole !== 'admin') return null;

  return (
    <div className="min-h-screen bg-green-50 p-6 font-poppins">
      <h2 className="text-2xl font-bold text-green-700 mb-6">Admin Panel - System Reports</h2>
      
      {/* Users Report */}
      <div className="bg-white p-4 rounded-lg card-shadow mb-6">
        <h3 className="text-lg font-semibold text-green-600 mb-2">Users ({users.length})</h3>
        <ul className="space-y-2">
          {users.map(user => (
            <li key={user.id} className="flex justify-between items-center">
              <span>{user.email} ({user.role})</span>
              <select
                value={user.role}
                onChange={(e) => updateUserRole(user.id, e.target.value)}
                className="p-1 border rounded text-green-600"
              >
                <option value="user">User</option>
                <option value="herbalist">Herbalist</option>
                <option value="admin">Admin</option>
              </select>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Posts Report */}
      <div className="bg-white p-4 rounded-lg card-shadow mb-6">
        <h3 className="text-lg font-semibold text-green-600 mb-2">Forum Posts ({posts.length})</h3>
        <ul className="space-y-2">
          {posts.map(post => (
            <li key={post.id} className="border-b py-2">
              <p>{post.content} by {post.email}</p>
              <p>Status: {post.approved ? 'Approved' : 'Pending'}</p>
              <div className="mt-2">
                {!post.approved && (
                  <button
                    onClick={() => handleApprovePost(post.id)}
                    className="bg-green-600 text-white p-1 rounded mr-2 hover:bg-green-700"
                  >
                    Approve
                  </button>
                )}
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Remedies Report */}
      <div className="bg-white p-4 rounded-lg card-shadow">
        <h3 className="text-lg font-semibold text-green-600 mb-2">Remedies ({remedies.length})</h3>
        <ul className="space-y-2">
          {remedies.map(remedy => (
            <li key={remedy.id} className="border-b py-2">
              <p>{remedy.content} by {remedy.email}</p>
              <p>Created: {new Date(remedy.createdAt?.seconds * 1000).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminPanel;