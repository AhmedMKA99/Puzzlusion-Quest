// Define the audio file
const audioFile = "background-audio.mp3";
let audioOn = false;
// Create the audio element
const audio = new Audio(audioFile);
// Set the audio to loop continuously
audio.loop = true;
// Preload the audio for smoother playback
audio.preload = "auto";
// Set the volume
audio.volume = 0.1;

// Function to play the audio
function playAudio() {
   
    audio.play(); // Play the audio
}

// Function to pause the audio
function pauseAudio() {
    
    audio.pause(); // Pause the audio
}

// Play the audio when the page loads
window.onload = function() {
    if (audioOn == true){
        playAudio();
    }
    
};

// Event listener to pause the audio when the user leaves the page
window.onbeforeunload = function() {
    pauseAudio();
};

// Event listener to store the current audio time to continue play off where left off from
window.onunload = function() {
    localStorage.setItem("audioCurrentTime", audio.currentTime);
};

// Retrieve and set the stored audio time if available
const storedTime = localStorage.getItem("audioCurrentTime");
if (storedTime !== null) {
    audio.currentTime = parseFloat(storedTime);
}

// Event listener to reset audio playback when it ends (for looping)
audio.onended = function() {
    audio.currentTime = 0; // Reset audio to the beginning
    playAudio(); // Play the audio again
};

// Function to toggle audio playback
function stopAndPlay() {
    if (audio.paused) {
        audioOn = true;
        playAudio();
    } else {
        audioOn = false;
        pauseAudio();

    }
}