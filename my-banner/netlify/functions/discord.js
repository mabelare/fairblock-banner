export async function handler(event) {
  const { id } = event.queryStringParameters || {};

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Discord ID is required" }),
    };
  }

  try {
    const res = await fetch(`https://discord.com/api/v10/users/${id}`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    });

    if (!res.ok) {
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: "User not found" }),
      };
    }

    const user = await res.json();

    const avatar = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`
      : `https://cdn.discordapp.com/embed/avatars/0.png`;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        avatar,
        username: user.username,
        displayName: user.global_name || user.username,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Discord API error" }),
    };
  }
}
