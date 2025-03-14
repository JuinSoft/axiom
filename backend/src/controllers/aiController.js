const { Configuration, OpenAIApi } = require('openai');

// Initialize OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Generate agent configuration from description
exports.generateAgentConfig = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }
    
    // Prepare the prompt for OpenAI
    const prompt = `
      Create a JSON configuration for an AI agent with the following details:
      
      Name: ${name}
      Description: ${description}
      
      The configuration should include:
      1. Capabilities (e.g., web_search, data_analysis, natural_language_processing)
      2. Parameters (e.g., response_time, accuracy, learning_rate)
      3. Permissions (e.g., read_blockchain_data, write_transactions, access_external_data)
      4. Triggers (e.g., time_based, event_based, manual)
      
      Return only the JSON object without any explanations.
    `;
    
    // Call OpenAI API
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 1000,
      temperature: 0.7,
    });
    
    // Parse the response to get the JSON configuration
    let configText = response.data.choices[0].text.trim();
    
    // Ensure the response is valid JSON
    try {
      // Remove any markdown code block indicators if present
      if (configText.startsWith('```json')) {
        configText = configText.replace(/```json\n|```/g, '');
      } else if (configText.startsWith('```')) {
        configText = configText.replace(/```\n|```/g, '');
      }
      
      const config = JSON.parse(configText);
      res.status(200).json(config);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      res.status(500).json({ 
        message: 'Failed to parse AI-generated configuration', 
        error: parseError.message,
        rawResponse: configText
      });
    }
  } catch (error) {
    console.error('Error generating agent configuration:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Optimize agent configuration
exports.optimizeAgentConfig = async (req, res) => {
  try {
    const { configuration } = req.body;
    
    if (!configuration) {
      return res.status(400).json({ message: 'Agent configuration is required' });
    }
    
    // Prepare the prompt for OpenAI
    const prompt = `
      Optimize the following AI agent configuration for better performance and efficiency:
      
      ${JSON.stringify(configuration, null, 2)}
      
      Suggest improvements for:
      1. Resource usage
      2. Response time
      3. Accuracy
      4. Security
      
      Return only the optimized JSON configuration without any explanations.
    `;
    
    // Call OpenAI API
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 1000,
      temperature: 0.5,
    });
    
    // Parse the response to get the optimized configuration
    let optimizedConfigText = response.data.choices[0].text.trim();
    
    // Ensure the response is valid JSON
    try {
      // Remove any markdown code block indicators if present
      if (optimizedConfigText.startsWith('```json')) {
        optimizedConfigText = optimizedConfigText.replace(/```json\n|```/g, '');
      } else if (optimizedConfigText.startsWith('```')) {
        optimizedConfigText = optimizedConfigText.replace(/```\n|```/g, '');
      }
      
      const optimizedConfig = JSON.parse(optimizedConfigText);
      res.status(200).json(optimizedConfig);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      res.status(500).json({ 
        message: 'Failed to parse AI-optimized configuration', 
        error: parseError.message,
        rawResponse: optimizedConfigText
      });
    }
  } catch (error) {
    console.error('Error optimizing agent configuration:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 