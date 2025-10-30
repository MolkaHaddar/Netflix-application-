import React, { useState, useRef, useEffect } from 'react';

// Style simple pour l'exemple (vous pouvez l'améliorer en utilisant CSS)
const chatbotStyles = {
    button: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#E50914', // Rouge Netflix
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontSize: '24px',
        zIndex: 1000,
    },
    window: {
        position: 'fixed',
        bottom: '90px',
        right: '20px',
        width: '300px',
        height: '400px',
        backgroundColor: '#141414', // Fond sombre
        border: '1px solid #333',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        color: 'white',
    },
    header: {
        padding: '10px',
        backgroundColor: '#E50914',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    messagesContainer: {
        flexGrow: 1,
        padding: '10px',
        overflowY: 'auto',
    },
    messageUser: {
        textAlign: 'right',
        margin: '5px 0',
    },
    messageAI: {
        textAlign: 'left',
        margin: '5px 0',
    },
    messageBubble: (sender) => ({
        display: 'inline-block',
        padding: '8px 12px',
        borderRadius: '15px',
        backgroundColor: sender === 'user' ? '#0070f3' : '#333',
        maxWidth: '80%',
        wordWrap: 'break-word',
    }),
    inputArea: {
        display: 'flex',
        padding: '10px',
        borderTop: '1px solid #333',
    },
    input: {
        flexGrow: 1,
        padding: '8px',
        borderRadius: '4px',
        border: 'none',
        marginRight: '8px',
        backgroundColor: '#222',
        color: 'white',
    },
    sendButton: {
        padding: '8px 15px',
        backgroundColor: '#E50914',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { 
            sender: 'ai', 
            // Message de bienvenue en français
            text: 'Hello! I m RecomBot. What kind of movie or series would you like to watch tonight?' 
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Fonction pour scroller automatiquement vers le bas
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() === '' || isLoading) return;

        const userMessage = input;
        setInput('');
        
        // 1. Ajouter le message de l'utilisateur à la conversation
        setMessages(prevMessages => [...prevMessages, { sender: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            // 2. Appel au backend Node.js (Assurez-vous qu'il tourne sur http://localhost:3001)
            const response = await fetch('http://localhost:3001/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!response.ok) {
                // Message d'erreur interne
                throw new Error('Erreur réseau ou réponse non valide du serveur.'); 
            }

            const data = await response.json();
            const aiReply = data.reply;

            // 3. Ajouter la réponse de l'IA à la conversation
            setMessages(prevMessages => [...prevMessages, { sender: 'ai', text: aiReply }]);

        } catch (error) {
            console.error("Erreur lors de l'appel à l'IA:", error);
            setMessages(prevMessages => [
                ...prevMessages, 
                { 
                    sender: 'ai', 
                    // Message d'erreur affiché à l'utilisateur
                    text: "Désolé, je rencontre un problème de connexion avec l'IA. Vérifiez que le backend est bien démarré sur le port 3001." 
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Bouton pour ouvrir/fermer la fenêtre de chat */}
            <button
                style={chatbotStyles.button}
                onClick={() => setIsOpen(!isOpen)}
                // aria-label en français
                aria-label={isOpen ? "Fermer le Chatbot" : "Ouvrir le Chatbot"}
            >
                {isOpen ? '✖' : '💬'}
            </button>

            {/* Fenêtre du Chatbot */}
            {isOpen && (
                <div style={chatbotStyles.window}>
                    <div style={chatbotStyles.header}>RecomBot IA</div>
                    
                    <div style={chatbotStyles.messagesContainer}>
                        {messages.map((msg, index) => (
                            <div key={index} style={msg.sender === 'user' ? chatbotStyles.messageUser : chatbotStyles.messageAI}>
                                <span style={chatbotStyles.messageBubble(msg.sender)}>
                                    {msg.text}
                                </span>
                            </div>
                        ))}
                        {isLoading && (
                             <div style={chatbotStyles.messageAI}>
                                 <span style={chatbotStyles.messageBubble('ai')}>
                                     ... currently typing
                                 </span>
                             </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} style={chatbotStyles.inputArea}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            // Placeholder en français
                            placeholder="Write your answer" 
                            style={chatbotStyles.input}
                            disabled={isLoading}
                        />
                        <button 
                            type="submit" 
                            style={chatbotStyles.sendButton}
                            disabled={isLoading}
                        >
                            {/* Texte du bouton en français */}
                            {isLoading ? '...' : 'Send'} 
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot;