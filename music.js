document.addEventListener("DOMContentLoaded", () => {
  const playerTitle = document.getElementById("player-title");
  const playerArtist = document.getElementById("player-artist");
  const playerToggle = document.getElementById("player-toggle");
  const playBtn = document.getElementById("play-btn");

  let current = {
    title: "Starlight Drift",
    artist: "Cosmic Ensemble",
    duration: "3:45",
    playing: false
  };

  function updatePlayer() {
    playerTitle.textContent = current.title;
    playerArtist.textContent = current.artist;
    playerToggle.textContent = current.playing ? "⏸" : "⏵";
    playBtn.textContent = current.playing ? "Pause" : "Play";
    }
    
  document.querySelectorAll(".track").forEach(trackEl => {
    trackEl.querySelector(".track-play").addEventListener("click", () => {
      current.title = trackEl.dataset.title;
      current.duration = trackEl.dataset.duration;
      current.artist = trackEl.querySelector(".track-artist").textContent;
      current.playing = true;
      updatePlayer();
    });
  });

  playerToggle.addEventListener("click", () => {
    current.playing = !current.playing;
    updatePlayer();
  });

  playBtn.addEventListener("click", () => {
    current.playing = !current.playing;
    updatePlayer();
  });

  updatePlayer();
});