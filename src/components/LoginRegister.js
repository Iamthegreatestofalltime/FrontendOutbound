"use client"

import axios from "axios";
import { useContext, useState } from 'react';
import { UserContext } from './UserContext';

export default function AuthForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [error, setError] = useState('');
    const [formType, setFormType] = useState('userLogin');
    const { updateUser } = useContext(UserContext);

    const handleSuccess = (type) => {
        setTimeout(() => {
            window.location.href = type.includes('company') ? '/company/dashboard' : '/user/dashboard';
        }, 100);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let url = 'https://outboundbe-tvtddw3maa-uc.a.run.app';  // Base URL
        let payload = {};
    
        switch (formType) {
            case 'userLogin':
            case 'companyLogin':
                url += '/login';  // Append '/login' endpoint to the base URL
                payload = { 
                    username, 
                    password, 
                    userType: formType === 'userLogin' ? 'individual' : 'company'
                };
                break;
            case 'userRegister':
            case 'companyRegister':
                url += '/register';  // Append '/register' endpoint to the base URL
                payload = { 
                    username, 
                    password, 
                    email, 
                    userType: formType === 'userRegister' ? 'individual' : 'company'
                };
                if (formType === 'companyRegister') payload.companyName = companyName;
                break;
        }
    
        try {
            console.log("Sending payload:", payload);
            const response = await axios.post(url, payload);  // Now 'url' has the full API endpoint
            console.log("Response from server:", response);
            
            if (response && response.data) {
                if (formType.includes('Login') && response.data.token) {
                    console.log("Login successful, updating user context");
                    const userData = { 
                        username: response.data.username, 
                        token: response.data.token, 
                        userId: response.data.userId,
                        userType: response.data.userType
                    };
                    updateUser(userData);
                    handleSuccess(formType);
                } else if (formType.includes('Register')) {
                    setFormType(formType === 'userRegister' ? 'userLogin' : 'companyLogin');
                    setError('Registration successful. Please log in.');
                }
            } else {
                setError("Unexpected server response. Please try again.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred. Please try again.");
        }
    }    

    const renderForm = () => {
        return (
            <>
                <input 
                    value={username}
                    className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    onChange={e => setUsername(e.target.value)}
                    type="text"
                    placeholder="Username"
                />
                <input 
                    value={password}
                    className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    type="password"
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                />
                {formType.includes('Register') && (
                    <input 
                        value={email}
                        className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                        onChange={e => setEmail(e.target.value)}
                        type="email"
                        placeholder="Email"
                        required
                    />
                )}
                {formType === 'companyRegister' && (
                    <input 
                        value={companyName}
                        className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                        onChange={e => setCompanyName(e.target.value)}
                        type="text"
                        placeholder="Company Name"
                        required
                    />
                )}
            </>
        );
    }

    return(
        <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl p-8 space-y-8">
                    <div className="flex justify-center space-x-4 mb-8">
                        <button 
                            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                                formType.includes('user') 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50' 
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                            onClick={() => setFormType(formType.includes('Login') ? 'userLogin' : 'userRegister')}
                        >
                            User
                        </button>
                        <button 
                            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                                formType.includes('company') 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50' 
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                            onClick={() => setFormType(formType.includes('Login') ? 'companyLogin' : 'companyRegister')}
                        >
                            Company
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h1 className="text-3xl font-bold text-center text-white mb-8">
                            {formType.includes('Login') ? 'Login' : 'Register'} as {formType.includes('user') ? 'User' : 'Company'}
                        </h1>
                        {renderForm()}
                        {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
                        <button className="w-full p-3 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-300 transform hover:scale-105">
                            {formType.includes('Login') ? 'Login' : 'Register'}
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <button 
                            className="text-blue-400 hover:text-blue-300 transition duration-300"
                            onClick={() => setFormType(prev => 
                                prev.includes('Login') ? prev.replace('Login', 'Register') : prev.replace('Register', 'Login')
                            )}
                        >
                            {formType.includes('Login') ? "Don't have an account? Register" : "Already have an account? Login"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}