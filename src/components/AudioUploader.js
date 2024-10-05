'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AudioUploader() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.userId) {
      setUserId(userData.userId);
    }
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !userId) return;

    const formData = new FormData();
    formData.append('audio', file);
    formData.append('userId', userId);

    try {
      setUploadStatus('Uploading...');
      const response = await axios.post('https://outboundbe-tvtddw3maa-uc.a.run.app/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*',  // This might be unnecessary if the backend already handles it
        }
      });
      console.log('File uploaded successfully:', response.data);
      setUploadStatus('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus(`Error uploading file: ${error.response?.data?.message || error.message}`);
    }
  };

  if (!userId) {
    return <div className="text-white text-center">Please log in to upload audio.</div>;
  }

  return (
    <div className="flex items-center justify-center h-96 bg-gray-900 py-10">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-xl space-y-4 w-[400px]">
        <h2 className="text-2xl font-bold text-center text-white">Upload Audio</h2>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
          type="submit"
          className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-md transition-all duration-300"
        >
          Upload Audio
        </button>
        {uploadStatus && <p className="text-center text-white">{uploadStatus}</p>}
      </form>
    </div>
  );
}