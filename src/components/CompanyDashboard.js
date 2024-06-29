'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CompanyDashboard({ onEmployeeSelect }) {
  const [employees, setEmployees] = useState([]);
  const [invites, setInvites] = useState([]);
  const [newEmployeeEmail, setNewEmployeeEmail] = useState('');
  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.userId) {
      setCompanyId(userData.userId);
      fetchEmployees(userData.userId);
      fetchInvites(userData.userId);
    }
  }, []);

  const fetchEmployees = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3500/company/${id}/employees`);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to fetch employees. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchInvites = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3500/company-invites/${id}`);
      setInvites(response.data);
    } catch (error) {
      console.error('Error fetching invites:', error);
    }
  };

  const handleInviteEmployee = async () => {
    try {
      await axios.post('http://localhost:3500/invite-employee', {
        companyId,
        employeeEmail: newEmployeeEmail
      });
      setNewEmployeeEmail('');
      fetchInvites(companyId);
    } catch (error) {
      console.error('Error inviting employee:', error);
    }
  };

  const handleEmployeeClick = async (employee) => {
    setSelectedEmployee(employee);
    setAnalysis(null);
    try {
      const response = await axios.get(`http://localhost:3500/employee-calls/${employee._id}`);
      onEmployeeSelect(employee, response.data);
      
    } catch (error) {
      console.error('Error fetching employee calls:', error);
      setError('Failed to fetch employee calls. Please try again later.');
    }
    try{
      const analys = await axios.get(`http://localhost:3500/employee-analysis/${employee._id}`);
      setAnalysis(analys.data);
    }
    catch (error){
      console.error('Error fetching employee calls:', error);
      setError('Failed to fetch employee calls. Please try again later.');
    }
  };

  const handleAnalyzeEmployee = async (isReanalyze = false) => {
    if (!selectedEmployee) return;
    try {
      setAnalyzing(true);
      const response = await axios.post(`http://localhost:3500/analyze-employee/${selectedEmployee._id}`, { forceReanalysis: isReanalyze });
      setAnalysis(response.data);
    } catch (error) {
      console.error('Error analyzing employee:', error);
      setError('Failed to analyze employee. Please try again later.');
    } finally {
      setAnalyzing(false);
    }
  };

  const formatAnalysisText = (text) => {
    // Remove text surrounded by double asterisks
    const cleanText = text.replace(/\*\*.*?\*\*/g, '');
    return cleanText.split(/(\d+\.\s)/).map((part, index) => {
      if (index % 2 === 0) {
        return part;
      } else {
        return <><br />{part}</>;
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-blue-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-300">Company Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-filter backdrop-blur-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-300">Invite New Employee</h2>
            <div className="flex">
              <input
                type="email"
                value={newEmployeeEmail}
                onChange={(e) => setNewEmployeeEmail(e.target.value)}
                placeholder="Enter employee email"
                className="flex-grow p-2 bg-gray-700 border border-blue-500 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleInviteEmployee}
                className="bg-blue-600 text-white p-2 rounded-r hover:bg-blue-700 transition duration-300"
              >
                Invite
              </button>
            </div>
          </div>

          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-filter backdrop-blur-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-300">Employees</h2>
            {employees.length > 0 ? (
              <ul className="space-y-2">
                {employees.map((employee) => (
                  <li 
                    key={employee._id} 
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-700 p-2 rounded transition duration-300"
                    onClick={() => handleEmployeeClick(employee)}
                  >
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span>{employee.username} - {employee.email}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No employees found.</p>
            )}
          </div>

          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-filter backdrop-blur-lg md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4 text-blue-300">Pending Invites</h2>
            {invites.length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {invites.map((invite, index) => (
                  <li key={index} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                    <span>{invite.email}</span>
                    <span className="px-2 py-1 bg-yellow-600 rounded-full text-xs">{invite.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No pending invites.</p>
            )}
          </div>
          {selectedEmployee && (
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-filter backdrop-blur-lg md:col-span-2">
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">Employee Analysis: {selectedEmployee.username}</h2>
              {analysis ? (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Strengths:</h3>
                  <p>{formatAnalysisText(analysis.strengths)}</p>
                  <h3 className="text-xl font-semibold mb-2 mt-4">Weaknesses:</h3>
                  <p>{formatAnalysisText(analysis.weaknesses)}</p>
                </div>
              ) : (
                <p>No analysis available yet.</p>
              )}
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => handleAnalyzeEmployee(false)}
                  className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-300 flex-1"
                  disabled={analyzing}
                >
                  {analyzing ? 'Analyzing...' : 'Analyze Employee'}
                </button>
                <button
                  onClick={() => handleAnalyzeEmployee(true)}
                  className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition duration-300 flex-1"
                  disabled={analyzing}
                >
                  {analyzing ? 'Re-analyzing...' : 'Re-analyze Employee'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}