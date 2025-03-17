import React, { useState } from 'react';

const CreateAgent: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'finance',
    capabilities: {
      web_search: false,
      data_analysis: false,
      natural_language_processing: false,
      market_data: false,
      price_alerts: false,
      technical_analysis: false
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCapabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      capabilities: {
        ...prev.capabilities,
        [name]: checked
      }
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }
    
    // In a real app, this would call the backend to create the agent
    alert(`Agent "${formData.name}" created successfully!`);
    console.log('Form data:', formData);
  };
  
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-dark-card shadow-md rounded-lg p-8 mb-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-dark-text">Create New Agent</h1>
      <p className="text-gray-600 dark:text-dark-muted mb-6">Design your custom AI agent by filling out the form below.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-dark-text">
            Agent Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter a name for your agent"
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-dark-text">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe what your agent does"
            rows={4}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-dark-text">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text"
          >
            <option value="finance">Finance</option>
            <option value="trading">Trading</option>
            <option value="analytics">Analytics</option>
            <option value="social">Social</option>
            <option value="utility">Utility</option>
          </select>
        </div>
        
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-dark-text">
            Capabilities
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(formData.capabilities).map(([key, value]) => (
              <div key={key} className="flex items-center">
                <input
                  type="checkbox"
                  id={key}
                  name={key}
                  checked={value}
                  onChange={handleCapabilityChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-dark-border rounded"
                />
                <label htmlFor={key} className="ml-2 block text-sm text-gray-700 dark:text-dark-text">
                  {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <button 
          type="submit" 
          className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          Create Agent
        </button>
      </form>
    </div>
  );
};

export default CreateAgent; 