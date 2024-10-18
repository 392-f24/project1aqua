import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from './firebaseConfig'; // Import Firebase configuration

import SignOutNav from './SignOutNav';

const Category = () => {
  const navigate = useNavigate();

  // State to store small summary URLs or content for each category
  const [summaries, setSummaries] = useState({
    Sports: '',
    Technology: '',
    Music: '',
    News: ''
  });

  // Function to fetch the most recent smallsummary.txt for each category
  const fetchSummary = async (category) => {
    try {
      const rootRef = ref(storage, ''); // Reference to the root of Firebase storage
      const allBuckets = await listAll(rootRef); // List all files in the root directory

      // Filter the files that match the category and a timestamp format
      const matchingFiles = allBuckets.prefixes.filter((prefix) =>
        prefix.name.startsWith(category) && /\d{4}_\d{2}_\d{2}_\d{2}_\d{2}_\d{2}/.test(prefix.name)
      );

      // Sort the matching files to get the most recent one
      const sortedFiles = matchingFiles.sort((a, b) => {
        const timestampA = a.name.split('_').slice(1).join('_'); // Extract the timestamp
        const timestampB = b.name.split('_').slice(1).join('_');
        return new Date(timestampB.replace(/_/g, '-')) - new Date(timestampA.replace(/_/g, '-')); // Sort by date
      });

      if (sortedFiles.length > 0) {
        const mostRecentFile = sortedFiles[0];

        // Get the smallsummary.txt URL from the most recent folder
        const summaryRef = ref(storage, `${mostRecentFile.fullPath}/smallsummary.txt`);
        const summaryUrl = await getDownloadURL(summaryRef);

        // Fetch the text content from the URL
        const response = await fetch(summaryUrl);
        const text = await response.text();

        // Update the summaries state with the fetched text
        setSummaries((prevSummaries) => ({ ...prevSummaries, [category]: text }));
      }
    } catch (err) {
      console.error(`Error fetching summary for ${category}:`, err);
      setSummaries((prevSummaries) => ({ ...prevSummaries, [category]: 'Summary not available' }));
    }
  };

  // Fetch summaries when the component mounts
  useEffect(() => {
    fetchSummary('Sports');
    fetchSummary('Technology');
    fetchSummary('Music');
    fetchSummary('News');
  }, []);

  // Functions to handle navigation
  const handleCategoryClick = (category) => {
    navigate(`/podcast/${category}`);
  };

  return (
    <div className="min-h-screen bg-gray-600">
      <SignOutNav /> 
      <div className="flex flex-col items-center p-6 w-full" style={{ marginTop: 0, paddingTop: '2rem' }}>
        <h2 style={{
          fontSize: 'clamp(1.5rem, 2.5vw + 1rem, 3.5rem)',  // Scalable font size for heading
          fontWeight: 'bold',
          color: 'white',
          textAlign: 'center',
          marginBottom: '1.5rem',
        }}>
          Choose a Podcast Category
        </h2>
        <div className="flex flex-wrap gap-8 justify-center">
          {/* Sports Button */}
          <button
            className="btn text-black rounded-md hover:bg-blue-600 transition shadow-lg text-left"
            style={{
              backgroundColor: '#fefae0',
              padding: 'clamp(1rem, 2vw + 1rem, 2.5rem)',  // Responsive padding
              fontSize: 'clamp(0.9rem, 1.2vw + 0.5rem, 1.5rem)',  // Scalable font size for text
              whiteSpace: 'normal',  // Allow text to wrap within the button
              overflowWrap: 'break-word',  // Ensure long words break correctly
              height: 'auto',  // Dynamic height based on content
              display: 'inline-block',  // Ensure buttons expand based on content
            }}
            onClick={() => handleCategoryClick('Sports')}
          >
            <span style={{ fontSize: 'clamp(1.5rem, 2vw + 0.5rem, 2.5rem)', fontWeight: 'bold' }}>Sports</span> {/* Larger font for category name */}
            <pre style={{ textAlign: 'left', marginTop: '10px' }}>{summaries.Sports || 'Loading...'}</pre>
          </button>

          {/* Technology Button */}
          <button
            className="btn text-black rounded-md hover:bg-green-600 transition shadow-lg text-left"
            style={{
              backgroundColor: '#fefae0',
              padding: 'clamp(1rem, 2vw + 1rem, 2.5rem)',  // Responsive padding
              fontSize: 'clamp(0.9rem, 1.2vw + 0.5rem, 1.5rem)',  // Scalable font size for text
              whiteSpace: 'normal',  // Allow text to wrap within the button
              overflowWrap: 'break-word',  // Ensure long words break correctly
              height: 'auto',  // Dynamic height based on content
              display: 'inline-block',  // Ensure buttons expand based on content
            }}
            onClick={() => handleCategoryClick('Technology')}
          >
            <span style={{ fontSize: 'clamp(1.5rem, 2vw + 0.5rem, 2.5rem)', fontWeight: 'bold' }}>Technology</span> {/* Larger font for category name */}
            <pre style={{ textAlign: 'left', marginTop: '10px' }}>{summaries.Technology || 'Loading...'}</pre>
          </button>

          {/* Music Button */}
          <button
            className="btn text-black rounded-md hover:bg-purple-600 transition shadow-lg text-left"
            style={{
              backgroundColor: '#fefae0',
              padding: 'clamp(1rem, 2vw + 1rem, 2.5rem)',  // Responsive padding
              fontSize: 'clamp(0.9rem, 1.2vw + 0.5rem, 1.5rem)',  // Scalable font size for text
              whiteSpace: 'normal',  // Allow text to wrap within the button
              overflowWrap: 'break-word',  // Ensure long words break correctly
              height: 'auto',  // Dynamic height based on content
              display: 'inline-block',  // Ensure buttons expand based on content
            }}
            onClick={() => handleCategoryClick('Music')}
          >
            <span style={{ fontSize: 'clamp(1.5rem, 2vw + 0.5rem, 2.5rem)', fontWeight: 'bold' }}>Music</span> {/* Larger font for category name */}
            <pre style={{ textAlign: 'left', marginTop: '10px' }}>{summaries.Music || 'Loading...'}</pre>
          </button>

          {/* News Button */}
          <button
            className="btn text-black rounded-md hover:bg-red-600 transition shadow-lg text-left"
            style={{
              backgroundColor: '#fefae0',
              padding: 'clamp(1rem, 2vw + 1rem, 2.5rem)',  // Responsive padding
              fontSize: 'clamp(0.9rem, 1.2vw + 0.5rem, 1.5rem)',  // Scalable font size for text
              whiteSpace: 'normal',  // Allow text to wrap within the button
              overflowWrap: 'break-word',  // Ensure long words break correctly
              height: 'auto',  // Dynamic height based on content
              display: 'inline-block',  // Ensure buttons expand based on content
            }}
            onClick={() => handleCategoryClick('News')}
          >
            <span style={{ fontSize: 'clamp(1.5rem, 2vw + 0.5rem, 2.5rem)', fontWeight: 'bold' }}>News</span> {/* Larger font for category name */}
            <pre style={{ textAlign: 'left', marginTop: '10px' }}>{summaries.News || 'Loading...'}</pre>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Category;
