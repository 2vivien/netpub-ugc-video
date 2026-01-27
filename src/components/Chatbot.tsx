import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, FunctionDeclaration, Type } from '@google/genai';
import { ChatMessage, PortfolioCategory } from '../types';
import { decodeAudioData } from '../utils/audioUtils';
import { useChatbot } from '../contexts/ChatbotContext'; 
import { NotificationService } from '../lib/notifications';
import { fetchCsrfToken } from '../utils/csrf';

interface SpeechRecognitionInstance extends EventTarget {
    lang: string;
    onstart: (() => void) | null;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: { error: string }) => void) | null;
    onend: (() => void) | null;
    start: () => void;
    stop: () => void;
}

interface SpeechRecognitionConstructor {
    new (): SpeechRecognitionInstance;
}

declare global {
    interface Window {
        SpeechRecognition: SpeechRecognitionConstructor | undefined;
        webkitSpeechRecognition: SpeechRecognitionConstructor | undefined;
    }
}

interface SpeechRecognitionEvent extends Event {
    results: {
        [index: number]: {
            [index: number]: {
                transcript: string;
            };
            length: number;
        };
        length: number;
    };
}

const prendreRendezVous: FunctionDeclaration = {
    name: 'prendreRendezVous',
    description: "Prendre un rendez-vous pour un service spécifique à une date et une heure données.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            service: {
                type: Type.STRING,
                description: `Le service qui intéresse le client. Doit être l'une des options suivantes : '${PortfolioCategory.VIDEO_UGC}' ou '${PortfolioCategory.VIDEO_SPOT_PUBLICITAIRE}'.`,
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
                description: `Le service que le client souhaite commander. Doit être l'une des options suivantes : '${PortfolioCategory.VIDEO_UGC}' ou '${PortfolioCategory.VIDEO_SPOT_PUBLICITAIRE}'.`,
            },
            details: {
                type: Type.STRING,
                description: "Un bref résumé des besoins ou des détails spécifiques pour la commande.",
            },
        },
        required: ['service', 'details'],
    },
};

const collecterInfosClient: FunctionDeclaration = {
    name: 'collecterInfosClient',
    description: "Collecter les informations du client pour le contacter.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            nom: { type: Type.STRING, description: "Le nom complet du client." },
            prenom: { type: Type.STRING, description: "Le prénom du client." },
            telephone: { type: Type.STRING, description: "Le numéro de téléphone du client." },
            email: { type: Type.STRING, description: "L'adresse email du client." },
        },
    },
};

const collecterFeedbackSite: FunctionDeclaration = {
    name: 'collecterFeedbackSite',
    description: "Collecter le feedback du client sur comment il a trouvé le site.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            feedback: {
                type: Type.STRING,
                description: "Comment le client a trouvé le site.",
            },
        },
        required: ['feedback'],
    },
};

const enregistrerNomClient: FunctionDeclaration = {
    name: 'enregistrerNomClient',
    description: "Enregistrer le nom du client.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            nom: { type: Type.STRING, description: "Le nom de famille du client." },
            prenom: { type: Type.STRING, description: "Le prénom du client." },
        },
        required: ['prenom'],
    },
};

interface GeminiModel {
    generateContent: (config: { 
        contents: unknown[]; 
        generationConfig?: unknown;
        tools?: unknown[];
    }) => Promise<{ 
        response: { 
            text: () => string;
            candidates?: Array<{ 
                content?: { 
                    parts?: Array<{ 
                        text?: string; 
                        inlineData?: { data: string; mimeType?: string };
                        functionCall?: { name: string; args: unknown };
                    }> 
                } 
            }> 
        } 
    }>;
}

interface GeminiSDK {
    getGenerativeModel: (config: { model: string; systemInstruction?: string }) => GeminiModel;
}


const Chatbot: React.FC = () => {
    const { isOpen, toggleChatbot, closeChatbot } = useChatbot(); 
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);

    const aiRef = useRef<GoogleGenAI | null>(null);
    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const inputValueRef = useRef(inputValue);
    const messagesRef = useRef(messages);

    useEffect(() => {
        inputValueRef.current = inputValue;
    }, [inputValue]);

    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    const env = (import.meta as unknown as { env: { VITE_API_KEY: string } }).env;
    const API_KEY = env.VITE_API_KEY;
    const GRAPHQL_ENDPOINT = '/graphql';

    const stopSpeaking = () => {
        if (audioSourceRef.current) {
            try {
                audioSourceRef.current.stop();
            } catch { /* ignore */ }
            audioSourceRef.current = null;
        }
    };

    const speakText = useCallback(async (text: string) => {
        if (!aiRef.current || !audioContextRef.current || !text) return;
        stopSpeaking(); 
        try {
            const sdk = aiRef.current as unknown as GeminiSDK;
            const model = sdk.getGenerativeModel({ model: "gemini-2.0-pro-preview-tts" });
            const result = await model.generateContent({
                contents: [{ role: 'user', parts: [{ text: text }] }],
                generationConfig: {
                    responseModalities: ["AUDIO"],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: 'Kore' },
                        },
                    },
                },
            });
            
            const parts = result.response.candidates?.[0]?.content?.parts || [];
            const audioPart = parts.find(p => p.inlineData?.mimeType?.startsWith('audio/'));
            const base64Audio = audioPart?.inlineData?.data;

            if (typeof base64Audio === 'string' && base64Audio) {
                const audioBuffer = await decodeAudioData(base64Audio, audioContextRef.current);
                const source = audioContextRef.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContextRef.current.destination);
                audioSourceRef.current = source;
                source.onended = () => {
                    if (audioSourceRef.current === source) audioSourceRef.current = null;
                };
                source.start();
            }
        } catch (err) {
            console.error('TTS Error:', err);
        }
    }, []);

    const saveChatMessageToDb = useCallback(async (sender: string, text: string) => {
        if (!conversationId) return;
        try {
            const csrf = await fetchCsrfToken();
            if (!csrf) return;
            await fetch(GRAPHQL_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
                body: JSON.stringify({
                    query: `mutation AddChatMessage($conversationId: ID!, $sender: String!, $text: String!) {
                        addChatMessage(conversationId: $conversationId, sender: $sender, text: $text) { id }
                    }`,
                    variables: { conversationId, sender, text },
                }),
            });
        } catch { /* ignore */ }
    }, [conversationId]);

    const createConversation = useCallback(async () => {
        if (isLoading || conversationId) return;
        setIsLoading(true);
        try {
            const csrf = await fetchCsrfToken();
            if (!csrf) {
                setIsLoading(false);
                return;
            }
            const response = await fetch(GRAPHQL_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
                body: JSON.stringify({
                    query: `mutation CreateConversation { createConversation { id userName userId } }`,
                }),
            });
            const result = await response.json();
            if (result.data?.createConversation) {
                const conversation = result.data.createConversation;
                setConversationId(conversation.id);
                const initialGreeting = API_KEY
                    ? "Salut ! 😊 Je suis Naïla, Community Manager chez Netpub. Comment dois-je t'appeler ?"
                    : "Désolé, le chatbot n'est pas entièrement configuré.";
                
                setMessages([{ id: Date.now(), role: 'model', text: initialGreeting, type: 'text' }]);

                await fetch(GRAPHQL_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
                    body: JSON.stringify({
                        query: `mutation AddChatMessage($conversationId: ID!, $sender: String!, $text: String!) {
                            addChatMessage(conversationId: $conversationId, sender: $sender, text: $text) { id }
                        }`,
                        variables: { conversationId: conversation.id, sender: 'model', text: initialGreeting }
                    }),
                });

                NotificationService.notifyNewConversation({
                    id: conversation.id,
                    userName: conversation.userName,
                    userId: conversation.userId
                });
            }
        } catch { /* ignore */ } finally {
            setIsLoading(false);
        }
    }, [API_KEY, conversationId, isLoading]);

    const handleSendMessage = useCallback(async (e: React.FormEvent | null, textOverride?: string) => {
        if (e) e.preventDefault();
        const textToSend = textOverride || inputValueRef.current;
        if (!textToSend.trim() || isLoading || !aiRef.current) return;

        const userMessage: ChatMessage = { id: Date.now(), role: 'user', text: textToSend, type: 'text' };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);
        stopSpeaking();
        saveChatMessageToDb('user', textToSend);

        // Gemini requires history to start with a 'user' message. 
        // We filter out the initial model greeting from the history sent to the API.
        const history = messagesRef.current
            .filter((msg, index) => !(index === 0 && msg.role === 'model'))
            .map(msg => ({ role: msg.role, parts: [{ text: msg.text }] }));
            
        const systemPrompt = `Tu es Naïla, assistante chez Netpub. Discussion humaine, Emojis 😊. Une seule question à la fois.`;

        try {
            const response = await aiRef.current.models.generateContent({
                model: 'gemini-2.5-flash-lite',
                contents: [...history, { role: 'user', parts: [{ text: textToSend }] }],
                config: {
                    systemInstruction: systemPrompt,
                    tools: [{ functionDeclarations: [prendreRendezVous, passerCommande, collecterInfosClient, collecterFeedbackSite, enregistrerNomClient] }],
                },
            });

            const parts = response.candidates?.[0]?.content?.parts || [];
            const functionCalls = parts.filter(p => !!p.functionCall);

            if (functionCalls && functionCalls.length > 0) {
                const fc = functionCalls[0].functionCall!;
                let confirmationText = '';
                const csrf = await fetchCsrfToken();

                if (fc.name === 'prendreRendezVous' && csrf) {
                    const { service, date, heure } = fc.args as { service: string; date: string; heure: string };
                    confirmationText = `RDV noté pour ${service} le ${date} à ${heure}.`;
                    await fetch(GRAPHQL_ENDPOINT, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
                        body: JSON.stringify({
                            query: `mutation CreateAppointment($service: String!, $date: String!, $time: String!, $conversationId: String!) {
                                createAppointment(service: $service, date: $date, time: $time, conversationId: $conversationId) { id }
                            }`,
                            variables: { service, date, time: heure, conversationId }
                        }),
                    });
                } else if (fc.name === 'enregistrerNomClient' && csrf) {
                    const { nom, prenom } = fc.args as { nom?: string, prenom: string };
                    confirmationText = `C'est noté ${prenom} ! Qu'est-ce qui t'amène ?`;
                    await fetch(GRAPHQL_ENDPOINT, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
                        body: JSON.stringify({
                            query: `mutation UpdateConversation($conversationId: String!, $clientName: String) {
                                updateConversation(conversationId: $conversationId, clientName: $clientName) { id }
                            }`,
                            variables: { conversationId, clientName: nom ? `${nom} ${prenom}` : prenom }
                        })
                    });
                } else if (fc.name === 'collecterInfosClient' && csrf) {
                    const { prenom, telephone, email } = fc.args as { prenom: string; telephone: string; email: string };
                    confirmationText = `Merci ${prenom} ! Infos notées.`;
                    await fetch(GRAPHQL_ENDPOINT, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
                        body: JSON.stringify({
                            query: `mutation UpdateConversation($conversationId: String!, $clientName: String, $clientEmail: String, $clientPhone: String) {
                                updateConversation(conversationId: $conversationId, clientName: $clientName, clientEmail: $clientEmail, clientPhone: $clientPhone) { id }
                            }`,
                            variables: { conversationId, clientName: prenom, clientEmail: email, clientPhone: telephone }
                        }),
                    });
                }

                const functionMessage: ChatMessage = { id: Date.now(), role: 'model', text: confirmationText, type: 'function_confirmation' };
                setMessages(prev => [...prev, functionMessage]);
                saveChatMessageToDb('model', confirmationText);
                speakText(confirmationText);
            } else {
                const modelText = parts.find(p => !!p.text)?.text || "Désolé.";
                const modelMessage: ChatMessage = { id: Date.now(), role: 'model', text: modelText, type: 'text' };
                setMessages(prev => [...prev, modelMessage]);
                saveChatMessageToDb('model', modelText);
                speakText(modelText);
            }
        } catch (err) {
            console.error('Chatbot error:', err);
            setMessages(prev => [...prev, { id: Date.now(), role: 'model', text: "Une erreur est survenue lors de la communication avec Naïla.", type: 'text' }]);
        } finally {
            setIsLoading(false);
        }
    }, [aiRef, conversationId, isLoading, saveChatMessageToDb, speakText]);

    useEffect(() => {
        if (isOpen) {
            if (!aiRef.current && API_KEY) aiRef.current = new GoogleGenAI({ apiKey: API_KEY });
            if (!audioContextRef.current) {
                const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
                if (AudioContextClass) audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
            }
            if (messages.length === 0 && !conversationId && !isLoading) {
                createConversation();
            }

            const handler = (event: Event) => {
                const customEvent = event as CustomEvent<{ message?: string }>;
                const msg = customEvent.detail?.message;
                if (msg) handleSendMessage(null, msg);
            };
            window.addEventListener('chatbotContext', handler);
            return () => window.removeEventListener('chatbotContext', handler);
        } else {
            if (messages.length > 0) setMessages([]);
            if (conversationId !== null) setConversationId(null);
        }
    }, [isOpen, API_KEY, messages.length, conversationId, isLoading, createConversation, handleSendMessage]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const SR = (window.SpeechRecognition || window.webkitSpeechRecognition) as SpeechRecognitionConstructor | undefined;
        if (!SR) return;
        const recognition = new SR();
        recognition.lang = 'fr-FR';
        recognition.onstart = () => setIsRecording(true);
        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = event.results[0][0].transcript;
            handleSendMessage(null, transcript);
        };
        recognition.onerror = () => setIsRecording(false);
        recognition.onend = () => setIsRecording(false);
        recognitionRef.current = recognition;
    }, [handleSendMessage]);

    const handleToggleChatbot = () => {
        audioContextRef.current?.resume().catch(() => {});
        toggleChatbot();
    };

    const handleToggleRecording = () => {
        audioContextRef.current?.resume().catch(() => {});
        if (!recognitionRef.current) return;
        if (isRecording) recognitionRef.current.stop();
        else { stopSpeaking(); recognitionRef.current.start(); }
    };

    return (
        <>
            <button className="chatbot-toggler" onClick={handleToggleChatbot}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9.06 9.06 0 0 0 8 15zM2 8c0-3.418 2.582-6.182 5.5-6.182S13.5 4.582 13.5 8s-2.582 6.182-5.5 6.182c-1.802 0-3.41-.8-4.47-2.067a.498.498 0 0 1 .11-.643c.488-.34.954-.743 1.34-1.22.04-.05.056-.118.042-.176-.17-.73-.255-1.52-.255-2.355C4.733 8.36 4.613 8.68 4.5 9c-.114.32-.26.657-.43 1.004-.175.35-.37.718-.592 1.107A6.47 6.47 0 0 1 2 8zm5-1.996a.5.5 0 0 0-1 0v.002a.5.5 0 0 0 1 0v-.002zm2.5.002a.5.5 0 0 0-1 0v.002a.5.5 0 0 0 1 0v-.002zm2.5-.002a.5.5 0 0 0-1 0v.002a.5.5 0 0 0 1 0v-.002z" /></svg>
            </button>
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h2>Naïla - Assistante Netpub</h2>
                        <button onClick={closeChatbot} aria-label="Fermer"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" /></svg></button>
                    </div>
                    <div className="chatbot-messages">
                        {messages.map(msg => (
                            <div key={msg.id} className={`message-bubble ${msg.role}`}>
                                {msg.role === 'model' && isLoading && messages[messages.length - 1].id === msg.id ? (
                                    <div className="typing-indicator"><span></span><span></span><span></span></div>
                                ) : <p>{msg.text}</p>}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <form className="chatbot-input-form" onSubmit={handleSendMessage}>
                        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Posez votre question..." disabled={isLoading} />
                        <button type="button" className={`mic-button ${isRecording ? 'recording' : ''}`} onClick={handleToggleRecording} disabled={isLoading}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z" /><path d="M8 8a3 3 0 0 0 3-3V3a3 3 0 0 0-6 0v2a3 3 0 0 0 3 3z" /></svg>
                        </button>
                        <button type="submit" disabled={isLoading || !inputValue.trim()}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11zM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493z" /></svg></button>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot;
