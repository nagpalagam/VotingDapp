import React from 'react';
import './ResultDisplay.css';


const ResultDisplay = ({ candidates, loading, error }) => {

    return (
        <div className="result-display">

            {loading ? (
                <div>Loading results...</div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : (
                <>
                    <h2>Voting Results</h2>

                    <ul>

                {candidates.map((candidate) => (
                    <li key={candidate.id.toString()}>
                        {candidate.name}: {candidate.voteCount.toString()} votes
                    </li>
                ))}
                    </ul>
                </>
            )}

        </div>
    );
};

export default ResultDisplay;
