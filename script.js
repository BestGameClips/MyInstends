let globalVolume = 1;
const audios = {};
let currentPlaying = null;

// Couleur aléatoire
function randomColor() {
    return `hsl(${Math.random() * 360}, 70%, 55%)`;
}

// Charger config
fetch("config.json")
    .then(res => res.json())
    .then(config => {
        globalVolume = config.volume;
        document.getElementById("volume").value = globalVolume;

        config.sounds.forEach(sound => createSound(sound));
    });

// Créer un bouton son
function createSound(sound) {
    const div = document.createElement("div");
    div.className = "sound";
    div.dataset.name = sound.name.toLowerCase();

    const btn = document.createElement("button");
    btn.textContent = "▶";
    btn.style.background = randomColor();

    const label = document.createElement("span");
    label.textContent = sound.name;

    const audio = new Audio(sound.file);
    audio.preload = "auto";
    audio.volume = globalVolume;

    audios[sound.file] = audio;

    btn.onclick = () => {
        // stop si déjà en cours
        if (currentPlaying === audio) {
            audio.pause();
            audio.currentTime = 0;
            currentPlaying = null;
            btn.textContent = "▶";
            return;
        }

        // stop l'ancien
        if (currentPlaying) {
            currentPlaying.pause();
            currentPlaying.currentTime = 0;
            document.querySelectorAll(".sound button").forEach(b => b.textContent = "▶");
        }

        audio.currentTime = 0;
        audio.play();
        btn.textContent = "⏹";
        currentPlaying = audio;
    };

    div.appendChild(btn);
    div.appendChild(label);
    document.getElementById("soundboard").appendChild(div);
}

// Volume global
document.getElementById("volume").oninput = e => {
    globalVolume = e.target.value;
    Object.values(audios).forEach(a => a.volume = globalVolume);
};

// Recherche
document.getElementById("search").onkeyup = e => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll(".sound").forEach(s => {
        s.style.display = s.dataset.name.includes(q) ? "flex" : "none";
    });
};
