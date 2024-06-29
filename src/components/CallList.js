'use client';

import { useQuery } from 'react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';

const fetchCalls = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  try {
    const response = await axios.get(`http://localhost:3500/calls?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching calls:', error);
    throw error;
  }
};

const parseAnalysis = (analysisText) => {
    // Splitting the analysis into sections based on the title pattern "Output: "
    const sections = analysisText.split(/([^\n]+ Output:)/).filter(section => section.trim() !== '');
  
    // Combining title and content back together
    const formattedSections = [];
    for (let i = 0; i < sections.length; i += 2) {
      const title = sections[i].replace('Output:', '').trim();
      let content = (sections[i + 1] || '').trim();
      
      // Removing repeated sequences of hyphens and similar characters
      content = content.replace(/-{2,}/g, '');
      content = content.replace(/_{2,}/g, '');
      content = content.replace(/={2,}/g, '');
  
      // Replacing text surrounded by ** with h3 tags
      const formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<h3 class="text-lg font-semibold mb-2">$1</h3>');
  
      formattedSections.push({ title, content: formattedContent });
    }
    
    return formattedSections;
};

export default function CallList({ selectedEmployeeId }) {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.userId) {
      setUserId(userData.userId);
    }
  }, []);

  const { data: calls, isLoading, isError, error } = useQuery(
    ['calls', selectedEmployeeId || userId],
    () => fetchCalls(selectedEmployeeId || userId),
    { enabled: !!(selectedEmployeeId || userId) }
  );

  const [selectedCall, setSelectedCall] = useState(null);

  useEffect(() => {
    // Reset selected call when user changes
    setSelectedCall(null);
  }, [selectedEmployeeId, userId]);

  if (!userId && !selectedEmployeeId) return <div className="text-center mt-10">Please log in or select an employee to view calls.</div>;

  if (isLoading) return <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>;

  if (isError) return <div className="text-red-500 text-center mt-10">Error fetching calls: {error.message}</div>;

  const parsedAnalysis = selectedCall ? parseAnalysis(selectedCall.analysis) : null;

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        {selectedEmployeeId ? "Employee's Recent Calls" : "Your Recent Calls"}
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-6">
          {calls && calls.length > 0 ? (
            <ul className="space-y-4">
              {calls.map((call) => (
                <li key={call._id} 
                    className={`p-4 rounded-md transition-all duration-300 ease-in-out ${
                      selectedCall && selectedCall._id === call._id 
                        ? 'bg-blue-100 shadow-md' 
                        : 'bg-gray-50 hover:bg-gray-200'
                    }`}
                    onClick={() => setSelectedCall(call)}>
                  <span className="cursor-pointer text-blue-600 hover:text-blue-800">
                    {new Date(call.createdAt).toLocaleString()}
                  </span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    call.analysis ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {call.analysis ? 'Complete' : 'Pending'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No calls found.</p>
          )}
        </div>
        {selectedCall && (
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Analysis for call on {new Date(selectedCall.createdAt).toLocaleString()}
            </h3>
            <div className="space-y-6">
              {parsedAnalysis.map((section, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md">
                  <h2 className="text-2xl font-bold mb-2 text-blue-600">{section.title}</h2>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: section.content }}></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}