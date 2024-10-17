import React, { useState, useRef, useEffect } from 'react';
import Summary from './Summary';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from './firebaseConfig'; // Import storage from your Firebase config file

const Player = ({ category }) => {
  const [summaryUrl, setSummaryUrl] = useState(null);

  // default state is paused when app opens
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0); // To store the duration of the audio
  const [audioUrl, setAudioUrl] = useState(null); // Set default if no URL
  const audioRef = useRef(null); 

  // get most recent podcast in {category}
  useEffect(() => {
    const fetchMostRecentPodcast = async () => {
      try {
        const rootRef = ref(storage, ''); 
        const all_buckets = await listAll(rootRef ); // list all files in root

        const matchingFiles = all_buckets.prefixes.filter((prefix) =>
          prefix.name.startsWith(category) && /\d{4}_\d{2}_\d{2}_\d{2}_\d{2}_\d{2}/.test(prefix.name)
        );

        // Get the most recent item by sorting the podcastItems by date
        const sortedFiles = matchingFiles.sort((a, b) => {
          const timestampA = a.name.split('_').slice(1).join('_'); // Extract the timestamp
          const timestampB = b.name.split('_').slice(1).join('_');
          return new Date(timestampB.replace(/_/g, '-')) - new Date(timestampA.replace(/_/g, '-')); // Sort by date
        });

        if (sortedFiles.length > 0) {
          const mostRecentFile = sortedFiles[0];
          // get podcast and summary download urls
          const podcastFile = ref(storage, `${mostRecentFile.fullPath}/combined_audio.mp3`);
          const mp3_url = await getDownloadURL(podcastFile);

          const podcastSummary = ref(storage, `${mostRecentFile.fullPath}/summary.txt`);
          const summary_url = await getDownloadURL(podcastSummary);

          setAudioUrl(mp3_url);
          setSummaryUrl(summary_url);
          // Initialize audio only if it is not already initialized
          if (!audioRef.current) {
            audioRef.current = new Audio(mp3_url);
            audioRef.current.addEventListener('loadedmetadata', () => {
              setDuration(audioRef.current.duration);
            });
          } else {
            audioRef.current.src = mp3_url; // Change the source if the audio already exists
          }
        }
      } catch (err) {
        console.error('Error fetching the podcast:', err);
      }
    };
    fetchMostRecentPodcast();

    // Cleanup function to stop audio
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('loadedmetadata', () => {
          setDuration(audioRef.current.duration);
        });
        
        audioRef.current.pause(); // Stop audio playback
        audioRef.current.src = ''; // Reset the source
        audioRef.current.load(); // Load the audio element to reset
        console.log("Cleanup function called: Audio paused"); // Debugging log
        setIsPlaying(false); // Update play state
      }
    };
  }, [category]);


  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
  
      // Update progress bar as the audio plays
      const updateProgress = () => {
        if (!isNaN(audio.duration)) {
          const progressPercentage = (audio.currentTime / audio.duration) * 100;
          setProgress(progressPercentage);
        } else {
          setProgress(0); // Default progress to 0 when duration is not available
        }
      };
  
      // Add event listener for time update
      audio.addEventListener('timeupdate', updateProgress);
      // Cleanup function to remove event listener when component unmounts or audioUrl changes
      return () => {
        audio.removeEventListener('timeupdate', updateProgress);
      };
    }
  }, [audioUrl]);
  
  // Handle manual progress bar change (seeking)
  const handleProgressChange = (event) => {
    const audio = audioRef.current;
    const newProgress = event.target.value; // Get the new progress percentage from the slider
    setProgress(newProgress); // Update the progress state
  
    // Calculate the new current time based on the progress percentage
    const newTime = (newProgress / 100) * audio.duration;
    audio.currentTime = newTime; // Set the new current time in the audio
  };

  return (
  <div>
    <div className="flex flex-col items-center p-6 rounded-xl shadow-lg w-full mt-6 bg-gray-600">
      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        className="mb-4 p-4 bg-gray-600 text-white rounded-full hover:bg-gray-900 transition duration-600 focus:outline-none focus:ring-2 focus:ring-gray-900"
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
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-white"
        />
        {/* Progress Time */}
        <div className="flex justify-between mt-2 text-sm text-gray-300">
          <span>{Math.floor(audioRef.current?.currentTime || 0)}s</span>
          <span>{Math.floor(duration)}s</span>
        </div>
      </div>
    </div>
    <Summary 
      summaryUrl={summaryUrl}/>
  </div>
  );
};


export default Player;