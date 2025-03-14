import { useState } from 'react';

const DesignStudioPage = () => {
  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedConfig, setGeneratedConfig] = useState<string | null>(null);

  const handleGenerateConfig = () => {
    setIsGenerating(true);
    // Simulate API call to generate agent configuration
    setTimeout(() => {
      setGeneratedConfig(JSON.stringify({
        name: agentName,
        description: agentDescription,
        capabilities: [
          "web_search",
          "data_analysis",
          "natural_language_processing"
        ],
        parameters: {
          response_time: "fast",
          accuracy: "high",
          learning_rate: 0.01
        }
      }, null, 2));
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Design Studio
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Create your AI agent using natural language or our visual designer.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Agent Designer */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900">Agent Designer</h3>
          <p className="mt-1 text-sm text-gray-500">
            Describe your agent's behavior and capabilities.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="agent-name" className="block text-sm font-medium text-gray-700">
                Agent Name
              </label>
              <input
                type="text"
                id="agent-name"
                className="input mt-1"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="E.g., Market Analyzer"
              />
            </div>

            <div>
              <label htmlFor="agent-description" className="block text-sm font-medium text-gray-700">
                Agent Description
              </label>
              <textarea
                id="agent-description"
                rows={4}
                className="input mt-1"
                value={agentDescription}
                onChange={(e) => setAgentDescription(e.target.value)}
                placeholder="Describe what you want your agent to do. E.g., Monitor cryptocurrency markets and alert me when specific conditions are met."
              />
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleGenerateConfig}
                disabled={isGenerating || !agentName || !agentDescription}
              >
                {isGenerating ? 'Generating...' : 'Generate Configuration'}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                disabled={isGenerating}
              >
                Use Visual Designer
              </button>
            </div>
          </div>
        </div>

        {/* Configuration Preview */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900">Configuration Preview</h3>
          <p className="mt-1 text-sm text-gray-500">
            AI-generated agent configuration based on your description.
          </p>

          <div className="mt-6">
            {generatedConfig ? (
              <div className="bg-gray-800 rounded-md p-4 overflow-auto max-h-96">
                <pre className="text-sm text-gray-100">{generatedConfig}</pre>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-md p-4 text-center text-gray-500">
                {isGenerating ? (
                  <p>Generating configuration...</p>
                ) : (
                  <p>Fill out the form and click "Generate Configuration" to see the preview.</p>
                )}
              </div>
            )}
          </div>

          {generatedConfig && (
            <div className="mt-6 flex space-x-4">
              <button type="button" className="btn btn-primary">
                Deploy Agent
              </button>
              <button type="button" className="btn btn-outline">
                Edit Configuration
              </button>
              <button type="button" className="btn btn-outline">
                Save Draft
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Agent Templates */}
      <div className="mt-12">
        <h3 className="text-lg font-medium text-gray-900">Agent Templates</h3>
        <p className="mt-1 text-sm text-gray-500">
          Start with a pre-built template and customize it to your needs.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: 'Market Monitor',
              description: 'Monitors cryptocurrency markets and sends alerts based on price movements.',
              category: 'Finance',
            },
            {
              name: 'Data Analyzer',
              description: 'Analyzes on-chain data and generates insights and visualizations.',
              category: 'Analytics',
            },
            {
              name: 'Trading Bot',
              description: 'Executes trades based on predefined strategies and market conditions.',
              category: 'Trading',
            },
          ].map((template, index) => (
            <div key={index} className="card hover:shadow-lg transition-shadow cursor-pointer">
              <h4 className="text-base font-medium text-gray-900">{template.name}</h4>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mt-2">
                {template.category}
              </span>
              <p className="mt-2 text-sm text-gray-500">{template.description}</p>
              <button className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-500">
                Use Template
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesignStudioPage; 