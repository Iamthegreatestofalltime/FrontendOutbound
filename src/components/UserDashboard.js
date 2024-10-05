'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserDashboard() {
  const [invites, setInvites] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.userId) {
      setUserId(userData.userId);
      fetchInvites(userData.userId);
    }
  }, []);

  const fetchInvites = async (id) => {
    try {
      const response = await axios.get(`https://outboundbe-tvtddw3maa-uc.a.run.app/user-invites/${id}`);
      setInvites(response.data);
    } catch (error) {
      console.error('Error fetching invites:', error);
    }
  };

  const handleInvitation = async (companyId, status) => {
    try {
      await axios.post('https://outboundbe-tvtddw3maa-uc.a.run.app/handle-invitation', {
        userId,
        companyId,
        status
      });
      fetchInvites(userId);
    } catch (error) {
      console.error('Error handling invitation:', error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-blue-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-300">User Dashboard</h1>
        
        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-filter backdrop-blur-lg">
          <h2 className="text-2xl font-semibold mb-6 text-blue-300">Company Invitations</h2>
          {invites.length > 0 ? (
            <ul className="space-y-6">
              {invites.map((invite) => (
                <li key={invite._id} className="bg-gray-700 bg-opacity-50 p-6 rounded-lg transition-all duration-300 hover:bg-opacity-70">
                  <p className="mb-4 text-lg">Invitation from: <span className="font-semibold text-blue-300">{invite.name}</span></p>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleInvitation(invite._id, 'accepted')}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-full transition-all duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transform hover:scale-105"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleInvitation(invite._id, 'rejected')}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-full transition-all duration-300 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transform hover:scale-105"
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-400 py-8">No pending invitations</p>
          )}
        </div>
      </div>
    </div>
  );
}