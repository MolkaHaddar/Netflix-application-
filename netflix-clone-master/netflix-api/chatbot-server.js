// 1. Charger les dépendances et la clé API
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialiser l'API Gemini avec la clé API
// Assurez-vous d'avoir un fichier .env avec GEMINI_API_KEY="VOTRE_CLÉ_API"
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();
const port = 3001; // Port pour le serveur IA, différent du frontend (3000)

// 2. Configuration du Middleware
app.use(express.json()); 
// Autoriser le frontend (sur localhost:3000) à communiquer
app.use(cors({
    origin: 'http://localhost:3000'
}));

// 3. Endpoint du Chatbot
app.post('/api/chatbot', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: 'Please provide a message.' });
    }

    try {
        // Définir le rôle de l'IA (System Instruction)
        const systemInstruction = `You are RecomBot, an expert chatbot for movies and TV shows available on Netflix India. Your role is to give relevant recommendations. Respond in a friendly and concise manner, and always reply in English. If the user asks for a recommendation, suggest 2 or 3 titles. If you cannot find a title, say so politely.`;

        // Obtenir le modèle avec les instructions système et le modèle spécifique
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash-exp",
            systemInstruction: systemInstruction
        });

        // Générer le contenu
        const result = await model.generateContent(userMessage);
        const response = await result.response;
        const text = response.text; // Utilisation de .text pour éviter le warning de dépréciation

        // Renvoyer la réponse de l'IA au frontend
        res.json({
            reply: text
        });

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({
            error: 'Sorry, an error occurred while processing your AI request. Check your API key and connection.'
        });
    }
});

// 4. Démarrer le Serveur IA
app.listen(port, () => {
    console.log(`[AI Server] Chatbot backend started on http://localhost:${port}`);
});