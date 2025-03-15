import { useState, useEffect } from 'react';
import { designStudioApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  config: any;
}

const DesignStudioPage = () => {
  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedConfig, setGeneratedConfig] = useState<string | null>(null);
  const [templates, setTemplates] = useState<AgentTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisualDesignerOpen, setIsVisualDesignerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch agent templates when component mounts
    const fetchTemplates = async () => {
      try {
        setIsLoading(true);
        const data = await designStudioApi.getTemplates();
        setTemplates(data);
      } catch (error) {
        console.error('Error fetching templates:', error);
        toast.error('Failed to load agent templates');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleGenerateConfig = async () => {
    if (!agentName || !agentDescription) {
      toast.warning('Please provide both agent name and description');
      return;
    }

    try {
      setIsGenerating(true);
      const data = await designStudioApi.generateConfig(agentName, agentDescription);
      setGeneratedConfig(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error generating configuration:', error);
      toast.error('Failed to generate agent configuration');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!generatedConfig) {
      toast.warning('Please generate a configuration first');
      return;
    }

    try {
      setIsLoading(true);
      const config = JSON.parse(generatedConfig);
      const savedAgent = await designStudioApi.saveAgent({
        ...config,
        status: 'draft'
      });
      toast.success('Agent saved as draft');
      // Redirect to the agent details page
      navigate(`/agents/${savedAgent.id}`);
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save agent draft');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeployAgent = async () => {
    if (!generatedConfig) {
      toast.warning('Please generate a configuration first');
      return;
    }

    try {
      setIsLoading(true);
      const config = JSON.parse(generatedConfig);
      const savedAgent = await designStudioApi.saveAgent(config);
      const deployedAgent = await designStudioApi.deployAgent(savedAgent.id);
      toast.success('Agent deployed successfully');
      // Redirect to the deployment page
      navigate(`/deployments/${deployedAgent.id}`);
    } catch (error) {
      console.error('Error deploying agent:', error);
      toast.error('Failed to deploy agent');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditConfiguration = () => {
    if (!generatedConfig) {
      toast.warning('Please generate a configuration first');
      return;
    }

    try {
      const config = JSON.parse(generatedConfig);
      // Open the visual designer with the current configuration
      setIsVisualDesignerOpen(true);
    } catch (error) {
      console.error('Error parsing configuration:', error);
      toast.error('Failed to parse configuration');
    }
  };

  const handleUseTemplate = async (template: AgentTemplate) => {
    try {
      setIsLoading(true);
      setAgentName(template.name);
      setAgentDescription(template.description);
      setGeneratedConfig(JSON.stringify(template.config, null, 2));
      toast.success(`Template "${template.name}" loaded`);
    } catch (error) {
      console.error('Error using template:', error);
      toast.error('Failed to load template');
    } finally {
      setIsLoading(false);
    }
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
                disabled={isGenerating || isLoading}
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
                disabled={isGenerating || isLoading}
              />
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleGenerateConfig}
                disabled={isGenerating || isLoading || !agentName || !agentDescription}
              >
                {isGenerating ? 'Generating...' : 'Generate Configuration'}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsVisualDesignerOpen(true)}
                disabled={isGenerating || isLoading}
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
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleDeployAgent}
                disabled={isLoading}
              >
                {isLoading ? 'Deploying...' : 'Deploy Agent'}
              </button>
              <button 
                type="button" 
                className="btn btn-outline"
                onClick={handleEditConfiguration}
                disabled={isLoading}
              >
                Edit Configuration
              </button>
              <button 
                type="button" 
                className="btn btn-outline"
                onClick={handleSaveDraft}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Draft'}
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
          {isLoading ? (
            <div className="col-span-full text-center py-8">
              <p>Loading templates...</p>
            </div>
          ) : templates.length > 0 ? (
            templates.map((template) => (
              <div key={template.id} className="card hover:shadow-lg transition-shadow cursor-pointer">
                <h4 className="text-base font-medium text-gray-900">{template.name}</h4>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mt-2">
                  {template.category}
                </span>
                <p className="mt-2 text-sm text-gray-500">{template.description}</p>
                <button 
                  className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-500"
                  onClick={() => handleUseTemplate(template)}
                  disabled={isLoading}
                >
                  Use Template
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p>No templates available</p>
            </div>
          )}
        </div>
      </div>

      {/* Visual Designer Modal (placeholder) */}
      {isVisualDesignerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Visual Agent Designer</h3>
              <button 
                onClick={() => setIsVisualDesignerOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <div className="h-[60vh] border rounded-md p-4">
              {/* Visual designer implementation would go here */}
              <p className="text-center text-gray-500 mt-20">
                Visual designer functionality is being implemented.
              </p>
            </div>
            <div className="mt-4 flex justify-end space-x-4">
              <button 
                className="btn btn-outline"
                onClick={() => setIsVisualDesignerOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  // Apply visual designer changes
                  setIsVisualDesignerOpen(false);
                  toast.success('Configuration updated');
                }}
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignStudioPage; 