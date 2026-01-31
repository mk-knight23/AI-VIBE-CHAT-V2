"use client"

// Demo mode responses for local testing without API key
// This provides realistic AI-like responses when no API key is available

export const DEMO_RESPONSES = {
  greetings: [
    "Hello! I'm your AI assistant. How can I help you today?",
    "Hi there! I'm ready to assist you. What would you like to know?",
    "Greetings! I'm here to help with any questions you have."
  ],
  
  coding: [
    "Here's a simple JavaScript function to handle that:\n\n```javascript\nfunction example() {\n  return 'Hello, World!';\n}\n```\n\nIs this what you were looking for?",
    "For that problem, I'd suggest using a try-catch block:\n\n```js\ntry {\n  // Your code here\n} catch (error) {\n  console.error('Error occurred:', error);\n}\n```\n\nWould you like me to elaborate on any part?",
    "I can help you with that! Here's a Python solution:\n\n```python\ndef solve_problem():\n    return \"Solution here\"\n```\n\nWhat specific aspect would you like to focus on?"
  ],
  
  explanation: [
    "That's a great question! Let me break it down step by step.\n\n1. First, we need to understand the core concept\n2. Then we can apply the principles\n3. Finally, we see the results\n\nDoes this help clarify things?",
    "I'd be happy to explain that! Think of it this way: it's similar to how [analogy]. The key points are:\n\n• Point one\n• Point two  \n• Point three\n\nWould you like me to dive deeper into any of these?",
    "Excellent question! Here's how it works:\n\nThe process involves multiple steps that work together to achieve the desired outcome. Each step builds upon the previous one.\n\nIs there a specific part you'd like me to expand on?"
  ],
  
  default: [
    "That's an interesting point! I'd be happy to help you with that. Could you provide a bit more context so I can give you a more specific response?",
    "I understand what you're asking about. Let me think through this carefully and provide you with a helpful response.",
    "Thanks for your question! I'm here to assist you. What specific aspect would you like me to focus on?",
    "That's something I can definitely help with. Let me provide you with some insights and suggestions.",
    "Great question! I can share some thoughts on that topic. What particular angle interests you most?"
  ],
  
  creative: [
    "That sparks some creative ideas! Here's what comes to mind:\n\n✨ A unique approach could be to think outside the box and try something unexpected.\n\n🎨 Sometimes the best solutions come from combining different ideas in novel ways.\n\nWhat direction would you like to explore?",
    "What a fascinating concept! I love the creative potential here. Let me share some thoughts:\n\n🚀 Innovation often comes from questioning assumptions\n💡 Sometimes the most unexpected ideas lead to breakthroughs\n🌟 Consider the possibilities from multiple perspectives\n\nWhat resonates most with your vision?",
    "This is such a creative challenge! I can see several interesting directions:\n\n🎭 Think about it from different angles\n🎪 Consider what others might not have considered\n🎨 Use your imagination to push boundaries\n\nWhich approach excites you most?"
  ]
};

export function getDemoResponse(prompt: string, model: string): string {
  const promptLower = prompt.toLowerCase();
  
  // Detect intent and return appropriate response
  if (promptLower.includes('hello') || promptLower.includes('hi') || promptLower.includes('hey')) {
    return DEMO_RESPONSES.greetings[Math.floor(Math.random() * DEMO_RESPONSES.greetings.length)];
  }
  
  if (promptLower.includes('code') || promptLower.includes('function') || promptLower.includes('programming') || 
      promptLower.includes('javascript') || promptLower.includes('python') || promptLower.includes('bug') ||
      promptLower.includes('error') || promptLower.includes('syntax')) {
    return DEMO_RESPONSES.coding[Math.floor(Math.random() * DEMO_RESPONSES.coding.length)];
  }
  
  if (promptLower.includes('explain') || promptLower.includes('what is') || promptLower.includes('how does') ||
      promptLower.includes('why') || promptLower.includes('understand') || promptLower.includes('concept')) {
    return DEMO_RESPONSES.explanation[Math.floor(Math.random() * DEMO_RESPONSES.explanation.length)];
  }
  
  if (promptLower.includes('creative') || promptLower.includes('idea') || promptLower.includes('innovative') ||
      promptLower.includes('unique') || promptLower.includes('brainstorm') || promptLower.includes('think')) {
    return DEMO_RESPONSES.creative[Math.floor(Math.random() * DEMO_RESPONSES.creative.length)];
  }
  
  // Default response with some variety
  return DEMO_RESPONSES.default[Math.floor(Math.random() * DEMO_RESPONSES.default.length)];
}
