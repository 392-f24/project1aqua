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
  const [audioUrl, setAudioUrl] = useState('/combined_audio.mp3'); // Set default if no URL
  const audioRef = useRef(null); 

  // get most recent podcast in {category}
  useEffect(() => {
    const fetchMostRecentPodcast = async () => {
      try {
        const rootRef = ref(storage, ''); 
        console.log(rootRef );
        const all_buckets = await listAll(rootRef ); // list all files in root
        console.log(all_buckets);

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
          console.log(sortedFiles);
          const mostRecentFile = sortedFiles[0];
          console.log(mostRecentFile);
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
            audioRef.current.addEventListener('timeupdate', () => {
              const progressPercentage = (audioRef.current.currentTime / audioRef.current.duration) * 100;
              setProgress(progressPercentage);
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


  // Handle manual progress bar change
  const handleProgressChange = (event) => {
    const audio = audioRef.current;
    const newTime = (event.target.value / 100) * audio.duration;
    audio.currentTime = newTime;
    setProgress(event.target.value);
  };


  return (
  <div>
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