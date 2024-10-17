import React, { useState, useEffect } from 'react';

export default function Summary({ summaryUrl }) {
    const [summaryContent, setSummaryContent] = useState('');
    const [error, setError] = useState(null); // State to manage errors

    // unpack summaryUrl - link to .txt summary in most recent
    // podcast category folder for specified category
    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await fetch(summaryUrl);
                const text = await response.text();

                if (text.startsWith('<!DOCTYPE html>')) {
                    throw new Error('No summary available'); // Push to catch block
                }
                setSummaryContent(text);
            }
            catch (err) {
                console.log(`Error: ${err}`);
            }
        };
        fetchSummary();
    }, [summaryUrl]);

    return (
    <div className='pt-6'>
        {/* Conditional rendering based on error state */}
        {error ? (
                <p>No summary available.</p> // Display the error message
            ) : (
                <p className='text-white text-2l'>{summaryContent}</p> // Display the fetched content
            )}
    </div>
    )
}
