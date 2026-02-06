import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const PORT = process.env.PORT || 3001;

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Fairblock Banner API is running" });
});

// Fetch Discord user avatar
app.get("/discord-avatar/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const r = await fetch(`https://discord.com/api/v10/users/${id}`, {
      headers: {
        Authorization: `Bot ${DISCORD_TOKEN}`,
      },
    });

    if (!r.ok) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = await r.json();

    const avatar = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`
      : `https://cdn.discordapp.com/embed/avatars/0.png`;

    res.json({
      avatar,
      username: user.username,
      displayName: user.global_name || user.username,
    });
  } catch (err) {
    res.status(500).json({ error: "Discord error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
