import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from './firebaseConfig';

import SignOutNav from './SignOutNav';

const Category = () => {
  const navigate = useNavigate();

  const [summaries, setSummaries] = useState({
    Sports: '',
    Technology: '',
    Music: '',
    News: ''
  });

  const fetchSummary = async (category) => {
    try {
      const rootRef = ref(storage, '');
      const allBuckets = await listAll(rootRef);

      const matchingFiles = allBuckets.prefixes.filter((prefix) =>
        prefix.name.startsWith(category) && /\d{4}_\d{2}_\d{2}_\d{2}_\d{2}_\d{2}/.test(prefix.name)
      );

      const sortedFiles = matchingFiles.sort((a, b) => {
        const timestampA = a.name.split('_').slice(1).join('_');
        const timestampB = b.name.split('_').slice(1).join('_');
        return new Date(timestampB.replace(/_/g, '-')) - new Date(timestampA.replace(/_/g, '-'));
      });

      if (sortedFiles.length > 0) {
        const mostRecentFile = sortedFiles[0];
        const summaryRef = ref(storage, `${mostRecentFile.fullPath}/smallsummary.txt`);
        const summaryUrl = await getDownloadURL(summaryRef);

        const response = await fetch(summaryUrl);
        const text = await response.text();

        setSummaries((prevSummaries) => ({ ...prevSummaries, [category]: text }));
      }
    } catch (err) {
      console.error(`Error fetching summary for ${category}:`, err);
      setSummaries((prevSummaries) => ({ ...prevSummaries, [category]: 'Summary not available' }));
    }
  };

  useEffect(() => {
    ['Sports', 'Technology', 'Music', 'News'].forEach(category => {
      fetchSummary(category);
    });
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/podcast/${category}`);
  };

  const renderSummary = (summaryText) => {
    if (!summaryText) return 'Loading...';
    return summaryText.split('\n').map((line, index) => (
      <p key={index} className="small-summary" style={{ textAlign: 'left', marginTop: '10px' }}>
        {line}
      </p>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-600">
      <SignOutNav />
      <div className="flex flex-col items-center p-6 w-full" style={{ marginTop: 0, paddingTop: '2rem' }}>
        <h2 style={{
          fontSize: 'clamp(1.5rem, 2.5vw + 1rem, 3.5rem)',
          fontWeight: 'bold',
          color: 'white',
          textAlign: 'center',
          marginBottom: '1.5rem',
        }}>
          Choose a Podcast Category
        </h2>
        <div className="flex flex-wrap gap-4 justify-center w-full max-w-4xl">
          {['Sports', 'Technology', 'Music', 'News'].map((category) => (
            <button
              key={category}
              className="btn text-black rounded-md hover:bg-blue-600 transition shadow-lg text-left"
              style={{
                backgroundColor: '#fefae0',
                padding: 'clamp(1rem, 2vw + 1rem, 2.5rem)',
                fontSize: 'clamp(0.9rem, 1.2vw + 0.5rem, 1.5rem)',
                whiteSpace: 'normal',
                width: '90%',
                maxWidth: '300px',
                height: 'auto',
                overflowWrap: 'break-word',
                display: 'inline-block',
              }}
              onClick={() => handleCategoryClick(category)}
            >
              <span style={{ fontSize: 'clamp(1.5rem, 2vw + 0.5rem, 2.5rem)', fontWeight: 'bold' }}>
                {category === 'Sports' ? '🏅 Sports' :
                 category === 'Technology' ? '🖥️ Technology' :
                 category === 'Music' ? '🎵 Music' :
                 '📰 News'}
              </span>
              {renderSummary(summaries[category])}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
