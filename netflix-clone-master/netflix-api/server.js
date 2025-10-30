const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/UserRoutes");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/netflix", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });
// Dans un composant React (ex: Chatbot.js) de votre clone Netflix

const handleSendMessage = async (userMessage) => {
    // 1. Ajoutez le message de l'utilisateur à l'interface
    // (Cette partie dépend de la manière dont vous stockez les messages, souvent dans un state React)
    // setNewMessage({ text: userMessage, sender: 'user' });

    try {
        // 2. Appel au backend Node.js que nous avons créé
        const response = await fetch('http://localhost:3001/api/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        });

        if (!response.ok) {
            throw new Error('Réponse du serveur non valide.');
        }

        const data = await response.json();
        const aiReply = data.reply;

        // 3. Ajoutez la réponse de l'IA à l'interface
        // setNewMessage({ text: aiReply, sender: 'ai' });
        
        console.log("Réponse de l'IA:", aiReply);

    } catch (error) {
        console.error("Erreur lors de l'envoi du message au chatbot:", error);
        // setNewMessage({ text: "Désolé, le chatbot est hors ligne.", sender: 'ai' });
    }
};

// Exemple d'utilisation (vous appelez cette fonction lorsque l'utilisateur appuie sur "Envoyer")
// handleSendMessage("Je cherche un bon film d'horreur psychologique.");
app.use("/api/user", userRoutes);

app.listen(5000, () => {
  console.log("server Started on port 5000...");
});