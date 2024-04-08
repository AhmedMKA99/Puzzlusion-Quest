document.addEventListener("DOMContentLoaded", function() {
    const audioFile = "background-audio.mp3"; // Define the audio file
    const audio = new Audio(audioFile); // Create the audio element
    audio.preload = "auto"; // Preload the audio for smoother playback

    let isPlaying = false; // Track whether the audio is currently playing

    // Function to play the audio
    function playAudio() {
        audio.play(); // Play the audio
        isPlaying = true; // Set flag to indicate audio is playing
    }

    // Function to pause the audio
    function pauseAudio() {
        audio.pause(); // Pause the audio
        isPlaying = false; // Set flag to indicate audio is paused
    }

    // Play the audio when the page loads
    playAudio();

    // Event listener to pause the audio when the user leaves the page
    window.addEventListener("beforeunload", function() {
        pauseAudio();
    });

    // Event listener to store the current audio time when navigating between pages
    window.addEventListener("unload", function() {
        localStorage.setItem("audioCurrentTime", audio.currentTime);
    });

    // Retrieve and set the stored audio time if available
    const storedTime = localStorage.getItem("audioCurrentTime");
    if (storedTime !== null) {
        audio.currentTime = parseFloat(storedTime);
    }
});
