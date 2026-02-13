// Banner Generator Script
const canvas = document.getElementById("bannerCanvas");
const ctx = canvas.getContext("2d");
const discordIdInput = document.getElementById("discordId");
const fetchBtn = document.getElementById("fetchBtn");
const downloadBtn = document.getElementById("downloadBtn");

let currentDiscordId = "";
let currentUsername = "";

// Preload banner image for instant rendering
const bannerImage = new Image();
bannerImage.src = "/banner.jpg";

// Helper function to wait for banner image to load
function ensureBannerLoaded() {
  return new Promise((resolve, reject) => {
    if (bannerImage.complete) {
      // Image is already loaded from cache
      resolve();
    } else {
      bannerImage.onload = resolve;
      bannerImage.onerror = () =>
        reject(new Error("Failed to load banner.jpg"));
    }
  });
}

// Generate banner with Discord avatar
async function generate() {
  const id = discordIdInput.value.trim();

  if (!id) {
    alert("Please enter a Discord User ID");
    return;
  }

  currentDiscordId = id;

  // Show loading state
  fetchBtn.textContent = "Loading...";
  fetchBtn.disabled = true;

  try {
    // Ensure banner image is loaded
    await ensureBannerLoaded();

    // Draw banner immediately
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate proper scaling to fit image in canvas
    const imgAspect = bannerImage.width / bannerImage.height;
    const canvasAspect = canvas.width / canvas.height;
    let drawWidth, drawHeight, drawX, drawY;

    if (imgAspect > canvasAspect) {
      // Image is wider - fit to height
      drawHeight = canvas.height;
      drawWidth = canvas.height * imgAspect;
      drawX = (canvas.width - drawWidth) / 2;
      drawY = 0;
    } else {
      // Image is taller - fit to width
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgAspect;
      drawX = 0;
      drawY = (canvas.height - drawHeight) / 2;
    }

    ctx.drawImage(
      bannerImage,
      0,
      0,
      bannerImage.width,
      bannerImage.height,
      drawX,
      drawY,
      drawWidth,
      drawHeight,
    );

    // Fetch Discord data
    const isDev = window.location.hostname === "localhost";
    const apiUrl = isDev
      ? `http://localhost:3001/discord-avatar/${id}`
      : `/.netlify/functions/discord?id=${id}`;

    const r = await fetch(apiUrl);
    const data = await r.json();

    console.log("Received data from backend:", data);

    if (!data.avatar) {
      alert("Avatar not found");
      fetchBtn.textContent = "Generate";
      fetchBtn.disabled = false;
      return;
    }

    const avatar = new Image();
    avatar.crossOrigin = "anonymous";
    avatar.src = data.avatar;

    avatar.onload = () => {
      // Seismic banner is 1500x500 (3:1 aspect ratio)
      const size = 265; // Size of the circular profile picture
      const x = 60; // X position (left edge of circle)
      const y = 110; // Y position (center vertically: (500 - 250) / 2 = 125)

      ctx.save();
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(avatar, x, y, size, size);
      ctx.restore();

      // Store username for gallery (but don't display on banner)
      const username = data.displayName || data.username;
      currentUsername = username;

      console.log("Banner generated successfully!");
      fetchBtn.textContent = "Generate";
      fetchBtn.disabled = false;
    };

    avatar.onerror = () => {
      alert("Failed to load avatar image");
      fetchBtn.textContent = "Generate";
      fetchBtn.disabled = false;
    };
  } catch (error) {
    alert(
      "Could not load Discord avatar. Check the User ID and make sure the backend is running.",
    );
    console.error(error);
    fetchBtn.textContent = "Generate";
    fetchBtn.disabled = false;
  }
}

// Download banner
function downloadBanner() {
  if (!currentDiscordId) {
    alert("Generate a banner first!");
    return;
  }

  const imageData = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = "banner.png";
  link.href = imageData;
  link.click();

  // Save to gallery with username
  saveToGallery(imageData, currentUsername);
}

// AUDIO SETUP - Must be at the top after DOM elements
const bgMusic = document.getElementById("bgMusic");
const audioBtn = document.getElementById("audioBtn");
let isPlaying = false;
let hasStarted = false;

console.log("bgMusic element:", bgMusic);
console.log("audioBtn element:", audioBtn);

function playMusic() {
  console.log("playMusic called, hasStarted:", hasStarted);
  if (!hasStarted && bgMusic) {
    hasStarted = true;
    console.log("Attempting to play...");
    bgMusic.muted = false;
    bgMusic.volume = 0.5;
    bgMusic
      .play()
      .then(() => {
        console.log("✓ Music playing successfully!");
        isPlaying = true;
      })
      .catch((e) => {
        console.log("✗ Music error:", e.message);
      });
  }
}

// Try to start music on first interaction - using window instead of document.body
window.addEventListener("mousemove", playMusic, { once: true });
window.addEventListener("click", playMusic, { once: true });
window.addEventListener("touchstart", playMusic, { once: true });
window.addEventListener("scroll", playMusic, { once: true });

console.log("✓ Music listeners attached to window");

audioBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  console.log("Audio button clicked, isPlaying:", isPlaying);
  if (!isPlaying) {
    playMusic();
  } else {
    bgMusic.pause();
    isPlaying = false;
  }
});

// Event listeners
fetchBtn.addEventListener("click", generate);

discordIdInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    generate();
  }
});

downloadBtn.addEventListener("click", downloadBanner);

// Gallery functions
function saveToGallery(imageData, username) {
  let generations = JSON.parse(localStorage.getItem("bannerGenerations")) || [];

  // Add new generation
  generations.unshift({
    image: imageData,
    name: username,
    timestamp: Date.now(),
  });

  // Keep only last 6 generations
  if (generations.length > 6) {
    generations = generations.slice(0, 6);
  }

  localStorage.setItem("bannerGenerations", JSON.stringify(generations));
  loadGallery();
}

function loadGallery() {
  const galleryGrid = document.getElementById("galleryGrid");
  const generations =
    JSON.parse(localStorage.getItem("bannerGenerations")) || [];

  if (generations.length === 0) {
    galleryGrid.innerHTML =
      '<p class="col-span-full text-center text-gray-400">No banners generated yet</p>';
    return;
  }

  galleryGrid.innerHTML = generations
    .map(
      (gen) => `
    <div class="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden hover:border-[#64c8f0] transition-colors">
      <img src="${gen.image}" alt="${gen.name}" class="w-full h-auto" />
      <div class="p-3">
        <p class="text-[#64c8f0] font-semibold truncate">${gen.name}</p>
        <p class="text-gray-500 text-xs">${new Date(gen.timestamp).toLocaleDateString()}</p>
      </div>
    </div>
  `,
    )
    .join("");
}

// Load gallery on page load
loadGallery();
