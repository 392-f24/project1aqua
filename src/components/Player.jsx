import React, { useState, useRef, useEffect } from 'react';


const Player = () => {
   const audioSrc = '/combined_audio.mp3';
   const [isPlaying, setIsPlaying] = useState(false);
   const [progress, setProgress] = useState(0);
   const [duration, setDuration] = useState(0); // To store the duration of the audio
   const audioRef = useRef(new Audio(audioSrc));


   // Update progress bar as the audio plays
   useEffect(() => {
       const audio = audioRef.current;


       const updateProgress = () => {
       const progressPercentage = (audio.currentTime / audio.duration) * 100;
       setProgress(progressPercentage);
       };


       // Set audio duration when it's loaded
       const setAudioData = () => {
       setDuration(audio.duration);
       };


       // Attach the 'timeupdate' event listener to update progress bar
       audio.addEventListener('timeupdate', updateProgress);
       audio.addEventListener('loadedmetadata', setAudioData); // Load duration when audio metadata is available


       // Cleanup event listener when component unmounts
       return () => {
       audio.removeEventListener('timeupdate', updateProgress);
       audio.removeEventListener('loadedmetadata', setAudioData);
       };
   }, []);


   const togglePlayPause = () => {
       const audio = audioRef.current;


       if (isPlaying) {
       audio.pause();
       } else {
       audio.play();
       }
       setIsPlaying(!isPlaying);
   };


   // Handle manual progress bar change
   const handleProgressChange = (event) => {
       const audio = audioRef.current;
       const newTime = (event.target.value / 100) * audio.duration;
       audio.currentTime = newTime;
       setProgress(event.target.value);
   };


   return (
    <div className="flex flex-col items-center p-6 bg-gray-800 rounded-xl shadow-lg w-full max-w-md mt-6">
      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        className="mb-4 p-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {isPlaying ? (
          <i className="fa-regular fa-circle-pause text-3xl"></i>
        ) : (
          <i className="fa-regular fa-circle-play text-3xl"></i>
        )}
      </button>

      {/* Progress Bar */}
      <div className="w-full">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        {/* Progress Time */}
        <div className="flex justify-between mt-2 text-sm text-gray-300">
          <span>{Math.floor(audioRef.current.currentTime)}s</span>
          <span>{Math.floor(duration)}s</span>
        </div>
      </div>
    </div>
  );
};


export default Player;



