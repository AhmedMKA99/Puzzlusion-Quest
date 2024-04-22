document.addEventListener("DOMContentLoaded", function() {
    const audioFile = "background-audio.mp3"; // Define the audio file
    const audio = new Audio(audioFile); // Create the audio element
    audio.loop = true; // Set the audio to loop continuously
    audio.preload = "auto"; // Preload the audio for smoother playback
    audio.volume = 0.1; // Set the volume to 50%


    // Function to play the audio
    function playAudio() {
        audio.play(); // Play the audio
    }

    // Play the audio when the page loads
    playAudio();

    // Event listener to pause the audio when the user leaves the page
    window.addEventListener("beforeunload", function() {
        audio.pause(); // Pause the audio
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

    // Event listener to reset audio playback when it ends (for looping)
    audio.addEventListener("ended", function() {
        audio.currentTime = 0; // Reset audio to the beginning
        audio.play(); // Play the audio again
    });
});

// Function to play pickDrop sound
function playPickDropSound() {
    
    // Create an audio element
    const audio = new Audio('pickDrop.mp3'); 
    // Play the audio
    audio.volume = 0.5;
    audio.play();
}
