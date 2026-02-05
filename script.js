document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("sounds");

  if (!container) {
    console.error("❌ #sounds introuvable");
    return;
  }

  let currentAudio = null;
  let currentButton = null;

  fetch("config.json")
    .then(res => res.json())
    .then(config => {

      const volume = config.volume ?? 1;

      config.sounds.forEach(sound => {

        const wrap = document.createElement("div");
        wrap.className = "sound";

        const btn = document.createElement("button");
        btn.textContent = "▶";
        btn.style.background = `hsl(${Math.random() * 360},70%,50%)`;

        const label = document.createElement("span");
        label.textContent = sound.name;

        const audio = new Audio("sounds/" + sound.file);
        audio.volume = volume;

        // 🔹 Remettre le bouton en play quand le son se termine
        audio.addEventListener("ended", () => {
          btn.textContent = "▶";
          if (currentAudio === audio) {
            currentAudio = null;
            currentButton = null;
          }
        });

        btn.onclick = () => {
          if (currentAudio && currentAudio !== audio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentButton.textContent = "▶";
          }

          if (audio.paused) {
            audio.play();
            btn.textContent = "⏹";
            currentAudio = audio;
            currentButton = btn;
          } else {
            audio.pause();
            audio.currentTime = 0;
            btn.textContent = "▶";
            currentAudio = null;
          }
        };

        wrap.appendChild(btn);
        wrap.appendChild(label);
        container.appendChild(wrap);
      });

    })
    .catch(err => {
      container.innerHTML = "❌ Erreur chargement config.json";
      console.error(err);
    });

});
