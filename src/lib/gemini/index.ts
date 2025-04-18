import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { 
  saveAILearningEntry, 
  getLearningContext 
} from '@/lib/firebase/aiLearningService';
import { Medicine } from '@/lib/firebase/prescriptionService';

// Initialize the Google Generative AI with the API key from environment variables
const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY as string;

if (!apiKey) {
  console.error("Google Gemini API key is missing. Please check your .env file.");
}

// Initialize the API
const genAI = new GoogleGenerativeAI(apiKey);

// Default model name
const DEFAULT_MODEL = "gemini-2.5-flash-preview-04-17";

// Helper function to get a Gemini model
export const getGeminiModel = (modelName = DEFAULT_MODEL) => {
  return genAI.getGenerativeModel({ model: modelName });
};

// Function to generate content with Gemini
export async function generateContent(prompt: string, modelName = DEFAULT_MODEL) {
  try {
    const model = getGeminiModel(modelName);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    throw error;
  }
}

// Function for medical suggestions with learning capability
export async function generateMedicalSuggestions(
  symptoms: string, 
  doctorId: string,
  modelName = DEFAULT_MODEL
) {
  try {
    const model = getGeminiModel(modelName);
    
    // Get relevant past interactions from Firebase
    const historyContext = await getLearningContext(doctorId, symptoms);
    
    // Build prompt with past learning data
    const prompt = `You are a medical assistant helping a doctor with prescription suggestions. 
    Based on the following symptoms, suggest up to 3 possible medications with appropriate dosage, frequency, and duration. 
    Format your response in a structured way that can be parsed. For each medication, include: 
    name, dosage, frequency (from the list: Once daily, Twice daily, Three times daily, Four times daily, Every 4 hours, Every 6 hours, Every 8 hours, Every 12 hours, As needed, Before meals, After meals, At bedtime), 
    duration (from the list: 3 days, 5 days, 7 days, 10 days, 14 days, 1 month, 2 months, 3 months, As directed, Until finished), 
    and special instructions.
    
    ${historyContext}
    
    SYMPTOMS: ${symptoms}
    
    Format your response as follows (and ONLY this format):
    MEDICATION 1:
    Name: [medication name]
    Dosage: [dosage]
    Frequency: [frequency]
    Duration: [duration]
    Instructions: [special instructions]
    
    MEDICATION 2:
    ...`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Parse the medications from the response
    const medicationRegex = /MEDICATION \d+:\s*Name:\s*(.+)[\r\n]+Dosage:\s*(.+)[\r\n]+Frequency:\s*(.+)[\r\n]+Duration:\s*(.+)[\r\n]+Instructions:\s*(.+)(?:[\r\n]|$)/g;
    const medications: Medicine[] = [];
    let match;
    
    while ((match = medicationRegex.exec(responseText)) !== null) {
      medications.push({
        name: match[1].trim(),
        dosage: match[2].trim(),
        frequency: match[3].trim(),
        duration: match[4].trim(),
        instructions: match[5].trim(),
      });
    }
    
    // If medications were successfully parsed, save to Firebase
    if (medications.length > 0) {
      // Save in the background - don't await to keep the response fast
      saveAILearningEntry(doctorId, symptoms, medications)
        .catch(error => console.error('Error saving learning data:', error));
    }
    
    return responseText;
  } catch (error) {
    console.error("Error generating medical suggestions with Gemini:", error);
    throw error;
  }
}

// Function to generate content with Gemini that includes images
export async function generateContentWithImage(
  prompt: string,
  imageParts: Array<{ data: Uint8Array, mimeType: string }>,
  modelName = "gemini-1.5-pro-vision"
) {
  try {
    const model = getGeminiModel(modelName);
    
    // Prepare parts including text and images
    const parts: Part[] = [
      { text: prompt } as Part,
      ...imageParts.map(part => ({ 
        inlineData: { 
          data: Buffer.from(part.data).toString('base64'), 
          mimeType: part.mimeType 
        } 
      } as Part))
    ];
    
    const result = await model.generateContent(parts);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    throw error;
  }
}

// Function for chat interactions
export async function createGeminiChat(modelName = DEFAULT_MODEL) {
  const model = getGeminiModel(modelName);
  return model.startChat();
}

export default {
  getGeminiModel,
  generateContent,
  generateMedicalSuggestions,
  generateContentWithImage,
  createGeminiChat
}; 