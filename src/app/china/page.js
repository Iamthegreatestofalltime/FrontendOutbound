"use client"

import { useState } from 'react';

export default function Home() {
  const [backgroundColor, setBackgroundColor] = useState('bg-white');

  const changeBackgroundColor = () => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setBackgroundColor(randomColor);
  };

  return (
    <div className={`flex justify-center items-center h-screen ${backgroundColor}`}>
      <button
        onClick={changeBackgroundColor}
        className="px-6 py-3 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Change Background Color
      </button>
    </div>
  );
}