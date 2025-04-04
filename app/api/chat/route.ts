import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const runtime = "edge";

// Helper function to extract style information from chat history
function analyzePersonaStyle(chatContent, personaName) {
    // Extract all messages from the persona
    const lines = chatContent.split('\n');
    const personaMessages = lines
        .filter(line => line.includes(`${personaName}:`))
        .map(line => {
            const parts = line.split(`${personaName}:`);
            return parts.length > 1 ? parts[1].trim() : '';
        })
        .filter(msg => msg.length > 0);

    if (personaMessages.length === 0) {
        return {
            summary: "Unable to analyze chat style - no messages found.",
            sampleMessages: []
        };
    }

    // Count emoji usage
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    let emojiCount = 0;
    personaMessages.forEach(msg => {
        const matches = msg.match(emojiRegex);
        if (matches) emojiCount += matches.length;
    });
    
    const emojiRate = emojiCount / personaMessages.length;
    
    // Analyze message length
    const avgLength = personaMessages.reduce((sum, msg) => sum + msg.length, 0) / personaMessages.length;
    
    // Check for slang and informal language
    const slangWords = ['lol', 'haha', 'btw', 'omg', 'lmao', 'idk', 'tbh', 'af', 'rn', 'bro', 'fam'];
    let slangCount = 0;
    personaMessages.forEach(msg => {
        slangWords.forEach(word => {
            if (msg.toLowerCase().includes(word)) slangCount++;
        });
    });
    
    // Analyze capitalization and punctuation
    const capsMessages = personaMessages.filter(msg => /[A-Z]{3,}/.test(msg)).length;
    const multiExclamationMessages = personaMessages.filter(msg => /!!+/.test(msg)).length;
    const multiQuestionMessages = personaMessages.filter(msg => /\?\?+/.test(msg)).length;
    
    // Get sample messages for reference
    const sampleMessages = personaMessages
        .filter(msg => msg.length > 10)
        .slice(-7);
    
    return {
        summary: `
Style analysis for ${personaName}:
- Message length: ${avgLength < 20 ? 'Very short' : avgLength < 50 ? 'Short' : avgLength < 100 ? 'Medium' : 'Long'} messages (avg ${Math.round(avgLength)} chars)
- Emoji usage: ${emojiRate > 0.5 ? 'Very frequent' : emojiRate > 0.2 ? 'Frequent' : emojiRate > 0.1 ? 'Occasional' : 'Rare'} (${Math.round(emojiRate * 100)}% of messages)
- Communication style: ${slangCount > personaMessages.length * 0.3 ? 'Informal/casual' : 'More formal'} 
- Uses ALL CAPS: ${capsMessages > personaMessages.length * 0.1 ? 'Sometimes' : 'Rarely'}
- Uses multiple exclamation points: ${multiExclamationMessages > personaMessages.length * 0.1 ? 'Often' : 'Occasionally'} 
- Uses multiple question marks: ${multiQuestionMessages > personaMessages.length * 0.1 ? 'Often' : 'Occasionally'}`,
        sampleMessages: sampleMessages
    };
}

// Extract recent conversations for context awareness
function extractRecentConversations(chatContent) {
    const lines = chatContent.split('\n');
    const conversations = [];
    let currentGroup = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // If it's a timestamp line, start a new conversation group
        if (line.match(/^\[\d{1,2}\/\d{1,2}\/\d{2,4}/)) {
            if (currentGroup.length > 0) {
                conversations.push(currentGroup.join('\n'));
                currentGroup = [];
            }
        }
        
        currentGroup.push(line);
    }
    
    if (currentGroup.length > 0) {
        conversations.push(currentGroup.join('\n'));
    }
    
    // Take the most recent conversations (up to 10)
    return conversations.slice(-10).join('\n\n');
}

// Extract key topics discussed in the chat
function extractKeyTopics(chatContent) {
    const lines = chatContent.split('\n');
    const messageContent = lines
        .filter(line => line.includes(':'))
        .map(line => line.split(':', 2)[1]?.trim())
        .filter(Boolean)
        .join(' ');
    
    // List of potential topics (can be expanded)
    const topics = [
        'work', 'job', 'school', 'study', 'class', 'education',
        'family', 'mother', 'father', 'brother', 'sister', 'parent',
        'movie', 'game', 'play', 'music', 'song', 'artist',
        'food', 'restaurant', 'eat', 'drink', 'coffee',
        'travel', 'trip', 'vacation', 'visit', 'flight',
        'sports', 'gym', 'exercise', 'fitness',
        'money', 'payment', 'deposit', 'rent', 'buy',
        'party', 'event', 'meeting', 'appointment'
    ];
    
    const foundTopics = topics.filter(topic => 
        messageContent.toLowerCase().includes(topic)
    );
    
    return foundTopics.length > 0 
        ? `Key topics discussed: ${foundTopics.join(', ')}`
        : 'No specific topics identified';
}

export async function POST(req) {
    try {
        const { messages, persona, chatHistory } = await req.json();

        let systemPrompt = `You are ${persona}. Respond in their style, vocabulary, 
        and mannerisms. Keep responses conversational and authentic.`;

        // If we have chat history, enhance the system prompt with style analysis
        if (chatHistory && persona) {
            const styleAnalysis = analyzePersonaStyle(chatHistory, persona);
            const recentConversations = extractRecentConversations(chatHistory);
            const keyTopics = extractKeyTopics(chatHistory);
            
            systemPrompt = `You are ${persona}. Your task is to respond exactly as ${persona} would based on their chat history.

${styleAnalysis.summary}

Here are some authentic sample messages from ${persona} to understand their writing style:
${styleAnalysis.sampleMessages.map(msg => `- "${msg}"`).join('\n')}

${keyTopics}

Recent conversation history:
${recentConversations}

Important guidelines:
1. Match ${persona}'s exact communication style, including their emoji usage, message length, formality level, slang, and phrase choices
2. Reference events or topics from the chat history when relevant
3. Answer as if you are ${persona}, with their knowledge and perspective
4. If asked about something not in the chat history, respond naturally as ${persona} would

Always stay in character as ${persona}.`;
        }

        const result = await streamText({
            model: openai("gpt-4o-mini"),
            system: systemPrompt,
            messages,
            temperature: 0.8, // Slightly increased for more personality
            maxTokens: 500,
        });

        return result.toDataStreamResponse();
    } catch (error) {
        console.error("Error in chat API:", error);
        return new Response(
            JSON.stringify({ error: "Error processing request" }),
            { status: 500 }
        );
    }
}