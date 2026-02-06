import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [generations, setGenerations] = useState([
    { name: "STER", image: "/placeholder1.png" },
    { name: "FAIRBLOCK FAN", image: "/placeholder2.png" },
    { name: "CRYPTO KING", image: "/placeholder3.png" },
  ]);
  const canvasRef = useRef(null);

  useEffect(() => {
    initCanvas();
  }, []);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Create gradient background
    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height,
    );
    gradient.addColorStop(0, "#2d242b");
    gradient.addColorStop(0.5, "#1a1618");
    gradient.addColorStop(1, "#130f11");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add grid pattern
    ctx.strokeStyle = "rgba(142, 110, 121, 0.15)";
    ctx.lineWidth = 1;

    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }

    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Load and draw banner.png as placeholder
    const placeholderImg = new Image();
    placeholderImg.src = "/banner.png";
    placeholderImg.onload = () => {
      ctx.drawImage(placeholderImg, 0, 0, canvas.width, canvas.height);
    };
    placeholderImg.onerror = () => {
      // If image fails to load, show text fallback
      ctx.fillStyle = "#dfaad0";
      ctx.font = "bold 24px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("banner.png", canvas.width / 2, canvas.height / 2);
    };
  };

  const generateBanner = async () => {
    if (!username.trim()) {
      alert("Please enter a username");
      return;
    }

    setLoading(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const twitterUsername = username.replace("@", "").trim();
    let profileImage = null;

    // Try to load profile picture
    const loadImage = (url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = url;
      });
    };

    // Try different services
    const urls = [
      `https://unavatar.io/twitter/${twitterUsername}?fallback=false`,
      `https://logo.clearbit.com/twitter.com/${twitterUsername}`,
      `https://ui-avatars.com/api/?name=${encodeURIComponent(twitterUsername)}&size=400&background=dfaad0&color=1a1618&bold=true`,
    ];

    for (const url of urls) {
      console.log("Trying:", url);
      const img = await loadImage(url);
      if (img) {
        profileImage = img;
        console.log("Successfully loaded from:", url);
        break;
      }
    }

    // Draw the banner
    drawBanner(ctx, canvas, username, profileImage);
    setLoading(false);
  };

  const drawBanner = (ctx, canvas, username, profileImage) => {
    // Create gradient background
    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height,
    );
    gradient.addColorStop(0, "#2d242b");
    gradient.addColorStop(0.5, "#1a1618");
    gradient.addColorStop(1, "#130f11");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add grid pattern
    ctx.strokeStyle = "rgba(142, 110, 121, 0.15)";
    ctx.lineWidth = 1;

    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }

    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Add decorative elements
    ctx.strokeStyle = "#8e6e79";
    ctx.lineWidth = 2;

    // Left decorative lines
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(150, 50);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(50, 150);
    ctx.lineTo(150, 150);
    ctx.stroke();

    // Right decorative lines
    ctx.beginPath();
    ctx.moveTo(canvas.width - 150, 50);
    ctx.lineTo(canvas.width - 50, 50);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width - 150, 150);
    ctx.lineTo(canvas.width - 50, 150);
    ctx.stroke();

    // Draw profile picture if available
    if (profileImage) {
      const pfpSize = 120;
      const pfpX = 80;
      const pfpY = canvas.height / 2 - pfpSize / 2;

      // Draw circular profile picture with border
      ctx.save();
      ctx.beginPath();
      ctx.arc(
        pfpX + pfpSize / 2,
        pfpY + pfpSize / 2,
        pfpSize / 2,
        0,
        Math.PI * 2,
      );
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(profileImage, pfpX, pfpY, pfpSize, pfpSize);
      ctx.restore();

      // Draw border around profile picture
      ctx.strokeStyle = "#dfaad0";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(
        pfpX + pfpSize / 2,
        pfpY + pfpSize / 2,
        pfpSize / 2 + 2,
        0,
        Math.PI * 2,
      );
      ctx.stroke();

      // Add glow effect to profile picture
      ctx.shadowColor = "rgba(223, 170, 208, 0.4)";
      ctx.shadowBlur = 15;
      ctx.strokeStyle = "#dfaad0";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(
        pfpX + pfpSize / 2,
        pfpY + pfpSize / 2,
        pfpSize / 2 + 2,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Add username text (adjusted position for profile picture)
    const textX = profileImage ? canvas.width / 2 + 50 : canvas.width / 2;
    ctx.fillStyle = "#dfaad0";
    ctx.font = "bold 48px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(username.toUpperCase(), textX, canvas.height / 2 - 10);

    // Add Fairblock branding
    ctx.fillStyle = "#8e6e79";
    ctx.font = "bold 20px Inter, sans-serif";
    ctx.fillText("FAIRBLOCK", textX, canvas.height / 2 + 40);

    // Add glow effect to username
    ctx.shadowColor = "rgba(223, 170, 208, 0.6)";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#dfaad0";
    ctx.font = "bold 48px Inter, sans-serif";
    ctx.fillText(username.toUpperCase(), textX, canvas.height / 2 - 10);

    // Reset shadow
    ctx.shadowBlur = 0;
  };

  const downloadBanner = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "banner.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="app">
      {/* Ticker */}
      <div className="ticker">
        <div className="ticker-content">
          <span>MAGNITUDE IS THE KEY •FINTECHS •PRIVACY •</span>
          <span>MAGNITUDE IS THE KEY •FINTECHS •PRIVACY •</span>
          <span>MAGNITUDE IS THE KEY •FINTECHS •PRIVACY •</span>
          <span>MAGNITUDE IS THE KEY •FINTECHS •PRIVACY •</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        {/* Logo */}
        <div className="logo-section">
          <img src="/logo.svg" alt="Fairblock Logo" className="logo" />
        </div>

        {/* Title */}
        <h1 className="title">Fairblock Banner Generator</h1>

        {/* Canvas */}
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width="800"
            height="200"
            className="banner-canvas"
          />
        </div>

        {/* Input Section */}
        <div className="input-section">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="username-input"
            onKeyPress={(e) => e.key === "Enter" && generateBanner()}
          />
          <button
            onClick={generateBanner}
            className="btn btn-fetch"
            disabled={loading}
          >
            {loading ? "Loading..." : "Fetch"}
          </button>
          <button onClick={downloadBanner} className="btn btn-download">
            DOWNLOAD BANNER
          </button>
        </div>

        {/* Latest Generations */}
        <div className="generations-section">
          <h2 className="generations-title">LATEST GENERATIONS</h2>
          <div className="generations-grid">
            {generations.map((gen, index) => (
              <div key={index} className="generation-item">
                <div className="generation-placeholder">
                  <span className="generation-name">{gen.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="footer">
          <p>
            Developed by{" "}
            <a
              href="https://x.com/t_webninja"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dee Figure
            </a>{" "}
            & Art by{" "}
            <a
              href="https://x.com/maryisclear"
              target="_blank"
              rel="noopener noreferrer"
            >
              MaryClaire
            </a>{" "}
            | © 2026 Fairblock.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
