import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { generateContent } from '@/lib/gemini';

export function GeminiExample() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    setLoading(true);
    setResponse("");
    
    try {
      const result = await generateContent(prompt);
      setResponse(result);
    } catch (error) {
      console.error("Error generating content:", error);
      setResponse("An error occurred while generating content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Google Gemini AI</CardTitle>
        <CardDescription>
          Ask a question or provide a prompt to generate content using Google Gemini AI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea 
              placeholder="Enter your prompt here..." 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <Button type="submit" disabled={loading || !prompt.trim()}>
            {loading ? "Generating..." : "Generate"}
          </Button>
        </form>

        {response && (
          <div className="mt-6 space-y-2">
            <h3 className="text-lg font-medium">Response:</h3>
            <div className="p-4 border rounded-md bg-muted/50 whitespace-pre-wrap">
              {response}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default GeminiExample; 