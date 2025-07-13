import React, { useState } from 'react';
import { FaRobot } from 'react-icons/fa';
import './Chatbot.css';
import { sendToGemini } from '../api/sendToGemini'; // Ensure this path is correct

const suggestions = [
  'What career roles match my resume?',
  'How can I improve my resume?',
  'Show me the roadmap for Python',
  'How do I prepare for a React interview?',
  'Can you suggest 5 project ideas?'
];

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Hi! I'm CareerBot 🤖. Ask me anything about jobs, resumes, or skills!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { type: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const prompt = `
You are CareerBot 🤖, an expert assistant for students and professionals.
Respond clearly and helpfully to the user's question below:

"${input}"
`;
      const response = await sendToGemini(prompt);
      setMessages((prev) => [...prev, { type: 'bot', text: response.trim() }]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text: '❌ Failed to connect to the AI. Please try again later.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
        <FaRobot size={24} />
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">CareerBot 🤖</div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.type}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="chat-msg bot">✍️ Typing...</div>}
          </div>

          <div className="chat-suggestions">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => setInput(s)}>
                {s}
              </button>
            ))}
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a question..."
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
