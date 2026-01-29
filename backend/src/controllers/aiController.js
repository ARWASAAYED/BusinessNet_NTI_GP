exports.chatWithAI = async (req, res, next) => {
    try {
        const {
            message,
            context
        } = req.body;

        // Proxy to Python AI Service
        try {
            const response = await fetch("http://127.0.0.1:8000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message,
                    context
                })
            });

            if (!response.ok) throw new Error('AI Service failed');

            const data = await response.json();
            res.json({
                success: true,
                reply: data.reply
            });
        } catch (err) {
            console.error(err);
            // Fallback
            res.json({
                success: true,
                reply: "I'm having trouble connecting to my brain right now. Please try again later."
            });
        }
    } catch (error) {
        next(error);
    }
};
