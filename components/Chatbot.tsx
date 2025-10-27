import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, FunctionDeclaration, Type, Modality } from '@google/genai';
import { ChatMessage, PortfolioCategory } from '../types';
import { decode, decodeAudioData } from '../utils/audioUtils';
import { useChatbot } from '../contexts/ChatbotContext'; // Import the context hook

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const prendreRendezVous: FunctionDeclaration = {
  name: 'prendreRendezVous',
  description: "Prendre un rendez-vous pour un service spécifique à une date et une heure données.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      service: {
        type: Type.STRING,
        description: `Le service qui intéresse le client. Doit être l'une des options suivantes : '${PortfolioCategory.UGC}', '${PortfolioCategory.SPOT_4K}', ou '${PortfolioCategory.STRATEGY}'.`,
      },
      date: {
        type: Type.STRING,
        description: "La date souhaitée pour le rendez-vous, au format 'JJ/MM/AAAA' ou une description textuelle comme 'demain' ou 'mardi prochain'.",
      },
      heure: {
        type: Type.STRING,
        description: "L'heure souhaitée pour le rendez-vous, au format 'HH:MM' ou une description textuelle comme 'l'après-midi' ou '15h'.",
      },
    },
    required: ['service', 'date', 'heure'],
  },
};

const passerCommande: FunctionDeclaration = {
  name: 'passerCommande',
  description: "Passer une commande pour un service spécifique avec des détails additionnels.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      service: {
        type: Type.STRING,
        description: `Le service que le client souhaite commander. Doit être l'une des options suivantes : '${PortfolioCategory.UGC}', '${PortfolioCategory.SPOT_4K}', ou '${PortfolioCategory.STRATEGY}'.`,
      },
      details: {
        type: Type.STRING,
        description: "Un bref résumé des besoins ou des détails spécifiques pour la commande.",
      },
    },
    required: ['service', 'details'],
  },
};


const Chatbot: React.FC = () => {
    const { isOpen, toggleChatbot, closeChatbot } = useChatbot(); // Use context
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    // needsNotification state and its useEffect are removed as context manages isOpen

    const aiRef = useRef<GoogleGenAI | null>(null);
    const recognitionRef = useRef<any | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    
    // Notification logic removed for now, can be re-added if needed via context

    const speakText = async (text: string) => {
        if (!aiRef.current || !audioContextRef.current || !text) return;
        try {
            const response = await aiRef.current.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text: text }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: 'Kore' },
                        },
                    },
                },
            });
            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
                const audioBuffer = await decodeAudioData(
                    decode(base64Audio),
                    audioContextRef.current,
                    24000,
                    1
                );
                const source = audioContextRef.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContextRef.current.destination);
                source.start();
            }
        } catch (error) {
            console.error("Error generating speech:", error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            if (!aiRef.current) {
                aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            }
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            if (messages.length === 0) {
                const initialMessageText = "Bonjour ! Je suis l'assistant Netpub. Comment puis-je vous aider aujourd'hui ?";
                setMessages([{
                    id: Date.now(),
                    role: 'model',
                    text: initialMessageText,
                    type: 'text',
                }]);
                speakText(initialMessageText);
            }
        } else {
            // Reset messages when chatbot closes
            setMessages([]);
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'fr-FR';
            recognition.interimResults = false;

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                handleSendMessage(null, transcript);
            };
            recognition.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setIsRecording(false);
            };
            recognition.onend = () => setIsRecording(false);
            recognitionRef.current = recognition;
        }
    }, []);

    const toggleRecording = () => {
        if (!recognitionRef.current) return;
        if (isRecording) {
            recognitionRef.current.stop();
        } else {
            setInputValue('');
            recognitionRef.current.start();
            setIsRecording(true);
        }
    };
    
    const handleSendMessage = async (e: React.FormEvent | null, textOverride?: string) => {
        if (e) e.preventDefault();
        const textToSend = textOverride || inputValue;
        if (!textToSend.trim() || isLoading || !aiRef.current) return;

        const userMessage: ChatMessage = {
            id: Date.now(),
            role: 'user',
            text: textToSend,
            type: 'text',
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        const history = messages.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }));

        try {
            const response = await aiRef.current.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [...history, { role: 'user', parts: [{ text: textToSend }] }],
                config: {
                    tools: [{ functionDeclarations: [prendreRendezVous, passerCommande] }],
                },
            });

            if (response.functionCalls && response.functionCalls.length > 0) {
                const fc = response.functionCalls[0];
                let confirmationText = '';
                if (fc.name === 'prendreRendezVous') {
                    const { service, date, heure } = fc.args;
                    confirmationText = `Parfait, j'ai noté votre rendez-vous pour un service de "${service}" le ${date} à ${heure}. Un expert Netpub vous contactera pour confirmer.`;
                } else if (fc.name === 'passerCommande') {
                    const { service, details } = fc.args;
                    confirmationText = `Excellent choix ! Votre commande pour un service de "${service}" avec les détails "${details}" a bien été enregistrée. Notre équipe va l'examiner.`;
                }
                
                const functionMessage: ChatMessage = {
                    id: Date.now(),
                    role: 'model',
                    text: confirmationText,
                    type: 'function_confirmation'
                };
                setMessages(prev => [...prev, functionMessage]);
                speakText(confirmationText);
            } else {
                const modelText = response.text;
                const modelMessage: ChatMessage = {
                    id: Date.now(),
                    role: 'model',
                    text: modelText,
                    type: 'text'
                };
                setMessages(prev => [...prev, modelMessage]);
                speakText(modelText);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: ChatMessage = {
                id: Date.now(),
                role: 'model',
                text: "Désolé, une erreur est survenue. Veuillez réessayer.",
                type: 'text',
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button className="chatbot-toggler" onClick={toggleChatbot} aria-label="Ouvrir le chatbot">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9.06 9.06 0 0 0 8 15zM2 8c0-3.418 2.582-6.182 5.5-6.182S13.5 4.582 13.5 8s-2.582 6.182-5.5 6.182c-1.802 0-3.41-.8-4.47-2.067a.498.498 0 0 1 .11-.643c.488-.34.954-.743 1.34-1.22.04-.05.056-.118.042-.176-.17-.73-.255-1.52-.255-2.355C4.733 8.36 4.613 8.68 4.5 9c-.114.32-.26.657-.43 1.004-.175.35-.37.718-.592 1.107A6.47 6.47 0 0 1 2 8zm5-1.996a.5.5 0 0 0-1 0v.002a.5.5 0 0 0 1 0v-.002zm2.5.002a.5.5 0 0 0-1 0v.002a.5.5 0 0 0 1 0v-.002zm2.5-.002a.5.5 0 0 0-1 0v.002a.5.5 0 0 0 1 0v-.002z"/>
                </svg>
            </button>
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h2>Assistant Netpub</h2>
                        <button onClick={closeChatbot} aria-label="Fermer le chatbot">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                        </button>
                    </div>
                    <div className="chatbot-messages">
                        {messages.map(msg => (
                            <div key={msg.id} className={`message-bubble ${msg.role} ${msg.type === 'function_confirmation' ? 'function-confirmation' : ''}`}>
                                {msg.role === 'model' && isLoading && messages[messages.length -1].id === msg.id ? (
                                    <div className="typing-indicator"><span></span><span></span><span></span></div>
                                ) : <p>{msg.text}</p>}
                                {msg.role === 'model' && msg.text && (
                                    <button className="play-audio-button" onClick={() => speakText(msg.text)} aria-label="Réécouter le message">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-1.088.649A7.475 7.475 0 0 1 12.525 8a7.475 7.475 0 0 1-2.077 5.36l1.088.65zm-2.27-2.27A6.475 6.475 0 0 0 12.025 8a6.475 6.475 0 0 0-1.953-4.63l-1.088.649A5.482 5.482 0 0 1 11.025 8a5.482 5.482 0 0 1-1.64 3.98l1.088.65zm-2.27-2.27A4.5 4.5 0 0 0 9.525 8a4.5 4.5 0 0 0-1.722-3.36l-1.088.649A3.5 3.5 0 0 1 8.525 8a3.5 3.5 0 0 1-1.313 2.92l1.088.65zm-2.27-2.27A2.5 2.5 0 0 0 7.025 8a2.5 2.5 0 0 0-1.002-1.99l-1.088.649A1.5 1.5 0 0 1 6.025 8a1.5 1.5 0 0 1-.588 1.21l1.088.65zm-2.27-2.27A.5.5 0 0 0 4 9.5v.01A.5.5 0 0 0 4.717 10l.693-.416a.5.5 0 0 0 0-.868L4.717 9.08z"/></svg>
                                    </button>
                                )}
                            </div>
                        ))}
                         {isLoading && messages[messages.length - 1]?.role === 'user' && (
                            <div className="message-bubble model">
                                <div className="typing-indicator"><span></span><span></span><span></span></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form className="chatbot-input-form" onSubmit={handleSendMessage}>
                        <input
                            type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Posez votre question..." aria-label="Posez votre question" disabled={isLoading}
                        />
                        <button type="button" className={`mic-button ${isRecording ? 'recording' : ''}`} onClick={toggleRecording} disabled={isLoading} aria-label="Utiliser le microphone">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/><path d="M8 8a3 3 0 0 0 3-3V3a3 3 0 0 0-6 0v2a3 3 0 0 0 3 3z"/></svg>
                        </button>
                        <button type="submit" disabled={isLoading || !inputValue.trim()} aria-label="Envoyer le message">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11zM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493z"/></svg>
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot;