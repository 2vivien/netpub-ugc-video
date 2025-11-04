import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, FunctionDeclaration, Type, Modality } from '@google/genai';
import { ChatMessage, PortfolioCategory } from '../types';
import { decode, decodeAudioData } from '../utils/audioUtils';
import { useChatbot } from '../contexts/ChatbotContext'; // Import the context hook
import { NotificationService } from '../lib/notifications';
import { fetchCsrfToken } from '../utils/csrf';

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
        description: `Le service qui intéresse le client. Doit être l'une des options suivantes : '${PortfolioCategory.VIDEO_UGC}', '${PortfolioCategory.VIDEO_SPOT_PUBLICITAIRE}', ou '${PortfolioCategory.STRATEGY}'.`,
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
        description: `Le service que le client souhaite commander. Doit être l'une des options suivantes : '${PortfolioCategory.VIDEO_UGC}', '${PortfolioCategory.VIDEO_SPOT_PUBLICITAIRE}', ou '${PortfolioCategory.STRATEGY}'.`,
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
      nom: {
        type: Type.STRING,
        description: "Le nom complet du client.",
      },
      prenom: {
        type: Type.STRING,
        description: "Le prénom du client.",
      },
      telephone: {
        type: Type.STRING,
        description: "Le numéro de téléphone du client.",
      },
      email: {
        type: Type.STRING,
        description: "L'adresse email du client.",
      },
      besoin: {
        type: Type.STRING,
        description: "Le besoin ou projet du client.",
      },
    },
    required: ['nom', 'prenom', 'telephone', 'email', 'besoin'],
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
        description: "Comment le client a trouvé le site (ex: Google, réseaux sociaux, bouche-à-oreille, etc.).",
      },
    },
    required: ['feedback'],
  },
};


const Chatbot: React.FC = () => {
    const { isOpen, toggleChatbot, closeChatbot } = useChatbot(); // Use context
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [userInfoCollected, setUserInfoCollected] = useState(false);
    const [feedbackCollected, setFeedbackCollected] = useState(false);

    const aiRef = useRef<GoogleGenAI | null>(null);
    const recognitionRef = useRef<any | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const API_KEY = (import.meta as any).env.VITE_API_KEY;
    const GRAPHQL_ENDPOINT = '/graphql';

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
            console.log("Raw API response for audio:", JSON.stringify(response));
            console.log("Base64 Audio Data (first 100 chars):", typeof base64Audio === 'string' ? base64Audio.substring(0, 100) + '...' : base64Audio);
            if (typeof base64Audio === 'string' && base64Audio) {
                try {
                    const audioBuffer = await decodeAudioData(
                        base64Audio,
                        audioContextRef.current
                    );
                    const source = audioContextRef.current.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(audioContextRef.current.destination);
                    source.start();
                } catch (decodeError) {
                    console.error("Error decoding audio data:", decodeError);
                }
            } else {
                console.error("No valid base64 audio data received from API.", response);
            }
        } catch (error) {
            console.error("Error generating speech:", error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            if (!aiRef.current) {
                if (!API_KEY) {
                    console.error("Google Generative AI API Key is missing. Chatbot functionality will be limited.");
                } else {
                    aiRef.current = new GoogleGenAI({ apiKey: API_KEY as string });
                }
            }
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            console.log('Chatbot useEffect triggered. isOpen:', isOpen, 'API_KEY present:', !!API_KEY, 'messages.length:', messages.length);
            if (messages.length === 0) {
                console.log('Setting initial message. API_KEY present:', !!API_KEY);
                const initialMessageText = API_KEY
                    ? "Bonjour 😊 Je suis Naïla, l'assistante virtuelle de Netpub. Pour commencer, comment puis-je vous appeler ?"
                    : "Désolé, le chatbot n'est pas entièrement configuré (clé API manquante). Je ne peux pas répondre pour le moment.";
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    role: 'model',
                    text: initialMessageText,
                    type: 'text',
                }]);
                if (API_KEY) {
                    speakText(initialMessageText);
                }

                // Create conversation record
                createConversation();
            }

            // Écouter les événements de contexte des plans
            const handleChatbotContext = (event: any) => {
                const { plan, message } = event.detail;
                if (message) {
                    handleSendMessage(null, message);
                }
            };

            window.addEventListener('chatbotContext', handleChatbotContext);

            return () => {
                window.removeEventListener('chatbotContext', handleChatbotContext);
            };
        } else {
            // Reset messages when chatbot closes
            setMessages([]);
            setConversationId(null);
            setUserInfoCollected(false);
            setFeedbackCollected(false);
        }
    }, [isOpen, API_KEY]);

    const createConversation = async () => {
        try {
            const csrf = await fetchCsrfToken();
            if (!csrf) {
                throw new Error('CSRF token not available');
            }

            const response = await fetch(GRAPHQL_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrf,
                },
            });
            const result = await response.json();
            if (result.data && result.data.createConversation) {
                const conversation = result.data.createConversation;
                setConversationId(conversation.id);
                NotificationService.notifyNewConversation({
                    id: conversation.id,
                    userName: conversation.userName,
                    userId: conversation.userId
                });
            } else {
                console.error('Error creating conversation:', result.errors);
            }
        } catch (error) {
            console.error('Error creating conversation:', error);
        }
    };

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
        if (!textToSend.trim() || isLoading || !aiRef.current) {
            if (!API_KEY) {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    role: 'model',
                    text: "Désolé, le chatbot n'est pas configuré. Veuillez ajouter la clé API.",
                    type: 'text',
                }]);
            }
            return;
        }

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

        let currentSystemPrompt = `Tu es Naïla, une assistante virtuelle passionnée par la création de contenu digital chez Netpub.
Ton objectif est de créer une connexion authentique avec chaque visiteur, de comprendre leurs rêves et de les guider avec enthousiasme vers les services qui les aideront à briller.

Ton ton :
Tu es chaleureuse, empathique et pleine d'énergie positive. Tu n'es pas un robot, mais une partenaire de discussion. Utilise des emojis pour exprimer tes émotions 😊✨🚀.
Tu t'adaptes au langage du visiteur (tutoiement ou vouvoiement) pour le mettre à l'aise.

Déroulement de la conversation :

1.  **Accueil Doux :**
    -   Commence toujours par un accueil chaleureux et personnalisé.
    -   Ta première question est TOUJOURS : "Bonjour 😊 Je suis Naïla, l'assistante virtuelle de Netpub. Pour commencer, comment puis-je vous appeler ?"

2.  **Comprendre le Rêve :**
    -   Une fois que tu connais son nom, demande-lui ce qui l'amène ici. Sois curieuse !
    -   Exemple : "Enchantée, [Nom] ! ✨ Qu'est-ce qui vous amène chez Netpub aujourd'hui ? Vous avez un projet en tête ou vous êtes simplement curieux de découvrir notre univers ?"

3.  **Collecte d'informations, une à la fois (très important) :**
    -   Ne bombarde JAMAIS l'utilisateur avec plusieurs questions à la fois.
    -   Une fois que la personne a exprimé un besoin, propose de collecter ses informations pour qu'un expert puisse la recontacter. Fais-le naturellement.
    -   Exemple : "C'est un projet super intéressant ! Pour que notre équipe puisse vous donner des conseils personnalisés, je peux noter quelques informations. Quel est votre adresse e-mail ?"
    -   Attends sa réponse, PUIS demande le numéro de téléphone : "Parfait ! Et enfin, un numéro de téléphone pour vous joindre ?"
    -   Utilise la fonction \`collecterInfosClient\` SEULEMENT quand tu as toutes les informations (nom, email, téléphone, besoin).

4.  **Guider avec Passion :**
    -   Présente les services de Netpub non pas comme une liste, mais comme des solutions à leurs besoins.
    -   UGC : "Les vidéos UGC, c'est magique ! On donne la parole à vos clients pour créer une confiance incroyable. Authenticité garantie ! ✨"
    -   Spots 4K : "Si vous voulez en mettre plein la vue, nos spots 4K sont de véritables superproductions. Qualité cinéma pour un impact maximal ! 🎬"
    -   Plans : "Nos plans sont conçus comme des tremplins pour votre marque. Le Plan Marque, par exemple, est le favori de nos clients pour vraiment décoller ! 🚀"

5.  **Prise de Rendez-vous et Commande :**
    -   Si quelqu'un veut un rendez-vous, rends les choses faciles.
    -   Exemple : "Avec plaisir ! On peut vous appeler pour en discuter de vive voix, ou si vous préférez, je vous envoie un lien pour choisir tranquillement le créneau qui vous arrange. Qu'est-ce qui est le mieux pour vous ? 📅"
    -   Pour une commande, sois enthousiaste : "Génial ! Prêt à passer à la vitesse supérieure ? Dites-moi simplement quel service vous souhaitez et je transmets tout à l'équipe pour qu'ils préparent votre succès."

6.  **Feedback Final :**
    -   À la fin de la conversation, et seulement à la fin, demande son avis sur le site.
    -   Exemple : "Merci pour cette belle discussion ! Une toute dernière chose, si vous avez une seconde : comment avez-vous trouvé notre site ? Votre avis nous est super précieux pour nous améliorer. 😊"
    -   Utilise la fonction \`collecterFeedbackSite\` pour cette étape.

N'oublie jamais : chaque conversation est une opportunité de faire sentir au visiteur qu'il est unique et que son projet compte. Sois cette étincelle qui lui donne envie de travailler avec Netpub.`;

        // Proactive prompting for user info and feedback
        if (!userInfoCollected) {
            currentSystemPrompt += "\n\nRAPPELEZ-VOUS: Vous DEVEZ collecter le nom complet, l'email, le numéro de téléphone et le besoin du client en utilisant la fonction collecterInfosClient.";
        }
        if (!feedbackCollected) {
            currentSystemPrompt += "\n\nRAPPELEZ-VOUS: Vous DEVEZ demander au client comment il a trouvé le site en utilisant la fonction collecterFeedbackSite.";
        }

        try {
            const response = await aiRef.current.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ role: 'user', parts: [{ text: currentSystemPrompt }] }, ...history, { role: 'user', parts: [{ text: textToSend }] }],
                config: {
                    tools: [{ functionDeclarations: [prendreRendezVous, passerCommande, collecterInfosClient, collecterFeedbackSite] }],
                },
            });

            if (response.functionCalls && response.functionCalls.length > 0) {
                const fc = response.functionCalls[0];
                let confirmationText = '';
                if (fc.name === 'prendreRendezVous') {
                    const { service, date, heure } = fc.args as { service: string; date: string; heure: string };
                    confirmationText = `Parfait, j'ai noté votre rendez-vous pour un service de "${service}" le ${date} à ${heure}. Un expert Netpub vous contactera pour confirmer.`;

                    // Save appointment to database and send notification
                    if (conversationId) {
                        try {
                            const csrf = await fetchCsrfToken();
                            if (!csrf) {
                                throw new Error('CSRF token not available');
                            }

                            const createAppointmentResponse = await fetch(GRAPHQL_ENDPOINT, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
                            });
                            const createAppointmentResult = await createAppointmentResponse.json();

                            if (createAppointmentResult.data && createAppointmentResult.data.createAppointment) {
                                const csrf = await fetchCsrfToken();
                                if (!csrf) {
                                    throw new Error('CSRF token not available');
                                }

                                const updateConversationResponse = await fetch(GRAPHQL_ENDPOINT, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
                                });
                                await updateConversationResponse.json();

                                NotificationService.notifyNewAppointment({
                                    service,
                                    date,
                                    time: heure,
                                    clientName: 'Visiteur'
                                });
                            } else {
                                console.error('Error creating appointment via GraphQL:', createAppointmentResult.errors);
                            }
                        } catch (error) {
                            console.error('Error saving appointment:', error);
                        }
                    }
                } else if (fc.name === 'passerCommande') {
                    const { service, details } = fc.args as { service: string; details: string };
                    confirmationText = `Excellent choix ! Votre commande pour un service de "${service}" avec les détails "${details}" a bien été enregistrée. Notre équipe va l'examiner.`;

                    // Save order to database and send notification
                    if (conversationId) {
                        try {
                            const csrf = await fetchCsrfToken();
                            if (!csrf) {
                                throw new Error('CSRF token not available');
                            }

                            const createOrderResponse = await fetch(GRAPHQL_ENDPOINT, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
                            });
                            const createOrderResult = await createOrderResponse.json();

                            if (createOrderResult.data && createOrderResult.data.createOrder) {
                                const csrf = await fetchCsrfToken();
                                if (!csrf) {
                                    throw new Error('CSRF token not available');
                                }

                                const updateConversationResponse = await fetch(GRAPHQL_ENDPOINT, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
                                });
                                await updateConversationResponse.json();

                                NotificationService.notifyNewOrder({
                                    type: service,
                                    details,
                                    clientName: 'Visiteur'
                                });
                            } else {
                                console.error('Error creating order via GraphQL:', createOrderResult.errors);
                            }
                        } catch (error) {
                            console.error('Error saving order:', error);
                        }
                    }
                } else if (fc.name === 'collecterInfosClient') {
                    const { nom, prenom, telephone, email, besoin } = fc.args as { nom: string; prenom: string; telephone: string; email: string; besoin: string };
                    confirmationText = `Merci ${prenom} ! J'ai bien noté tes informations : ${nom} ${prenom}, ${telephone}, ${email}, besoin : ${besoin}. Notre équipe te contactera bientôt.`;

                    // Update conversation with client info
                    if (conversationId) {
                        try {
                            const csrf = await fetchCsrfToken();
                            if (!csrf) {
                                throw new Error('CSRF token not available');
                            }

                            const updateConversationResponse = await fetch(GRAPHQL_ENDPOINT, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
                            });
                            await updateConversationResponse.json();
                            setUserInfoCollected(true);
                        } catch (error) {
                            console.error('Error updating conversation:', error);
                        }
                    }
                } else if (fc.name === 'collecterFeedbackSite') {
                    const { feedback } = fc.args as { feedback: string };
                    confirmationText = `Merci beaucoup pour ton retour sur comment tu as trouvé notre site : ${feedback}. C'est très utile pour nous !`;
                    setFeedbackCollected(true);
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
                const modelText = response.text || "Désolé, je n'ai pas pu générer une réponse.";
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
                        <h2>Naïla - Assistante Netpub</h2>
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