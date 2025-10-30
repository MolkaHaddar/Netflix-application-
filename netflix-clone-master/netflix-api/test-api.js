// test-api.js - Test rapide de l'API Gemini
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

console.log('=== TEST API GEMINI ===\n');

// Vérifier la clé API
console.log('1. Clé API:', process.env.GEMINI_API_KEY ? '✅ Trouvée' : '❌ Manquante');
console.log('   Longueur:', process.env.GEMINI_API_KEY?.length || 0, 'caractères\n');

// Tester les modèles requis pour le projet
const models = [
    'gemini-2.0-flash-exp', // Modèle utilisé dans le chatbot-server.js
];

async function testModels() {
    // Sortir si la clé est manquante
    if (!process.env.GEMINI_API_KEY) {
        console.log("❌ ÉCHEC: Clé API manquante. Veuillez la définir dans le fichier .env.");
        return;
    }
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    console.log('2. Test du modèle gemini-2.0-flash-exp:\n');
    
    for (const modelName of models) {
        try {
            console.log(`   Test: ${modelName}...`);
            
            const model = genAI.getGenerativeModel({ 
                model: modelName
            });

            const result = await model.generateContent('Say hello');
            const response = await result.response;
            const text = response.text; // Utilisation de .text

            console.log(`   ✅ ${modelName} FONCTIONNE !`);
            console.log(`   Réponse: ${text.substring(0, 50)}...\n`);
            
            console.log(`\n🎉 SUCCÈS ! Le chatbot devrait fonctionner avec ce modèle.\n`);
            return;
            
        } catch (error) {
            console.log(`   ❌ ${modelName} - Erreur: ${error.message}`);
            
            if (error.status === 404) {
                console.log(`      (Ce modèle n'existe pas ou n'est pas disponible)\n`);
            } else if (error.message.includes('API key')) {
                console.log(`      (Problème critique avec la clé API)\n`);
                break;
            } else {
                console.log(`      (${error.status || 'Erreur inconnue'})\n`);
            }
        }
    }
    
    console.log('\n❌ ÉCHEC: Le modèle principal ne fonctionne pas.');
}

testModels().catch(err => {
    console.error('\n❌ ERREUR CRITIQUE:', err.message);
});