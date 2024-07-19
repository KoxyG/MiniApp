const { Telegraf, Markup } = require("telegraf");
const path = require("path");
const axios = require("axios");
const fs = require("fs");

// Use environment variable for security
// const bot = new Telegraf(process.env.BOT_TOKEN);
const bot = new Telegraf("7301280642:AAG--QdD4vkPv5Q-JSZbaM0RZ6NdEx-NHzw");

// Function to get the image path
const imagePath = (fileName) => path.join(__dirname, "images", fileName);

// Function to register user
const registerUser = async (userId, username, inviteUsername = "") => {
    try {
        // Provide the correct URL for your server
        const response = await axios.post("http://your-server-url.com/register", { // Change this URL to your actual endpoint
            userId,
            username,
            inviteUsername
        });
        return response.data;
    } catch (error) {
        console.error("Error", error);
        throw error;
    }
};

// Bot start command
bot.start(async (ctx) => {
    const userId = ctx.from.username;
    const username = ctx.from.username || "there";
    const inviteUsername = ctx.startPayload || ""; // Extract invited user from start payload if available

    try {
        await registerUser(userId, username, inviteUsername);

        // Check if the image file exists
        const imageFilePath = imagePath("burger.png");
        if (!fs.existsSync(imageFilePath)) {
            throw new Error(`Image file not found at path: ${imageFilePath}`);
        }

        ctx.replyWithPhoto(
            { source: imageFilePath },
            {
                caption: `Welcome, ${username} to Foodies`,
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "Play", web_app: "https://mile-nft.vercel.app/" }, { text: "Join community", callback_data: "description.jpg" }]
                    ]
                }
            }
        );
    } catch (error) {
        console.error("Error in bot.start:", error);
        ctx.reply('Welcome back');
    }
});

// Launch the bot
bot.launch();
