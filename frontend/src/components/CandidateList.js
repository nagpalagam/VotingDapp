import React, { useEffect, useState } from 'react';
import './styles/CandidateList.css'


const CandidateList = ({ contract }) => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [leader, setLeader] = useState(null);

    // Fetch candidates from the contract
    const fetchCandidates = async () => {
        if (!contract) {
            setError("Contract is not defined");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const count = await contract.candidatesCount();
            const candidatesArray = [];
            let maxVotes = 0;
            let leaderCandidate = null;

            for (let i = 0; i < count; i++) {
                const candidate = await contract.candidates(i);
                candidatesArray.push(candidate);

                // Check for the leader
                if (candidate.voteCount > maxVotes) {
                    maxVotes = candidate.voteCount;
                    leaderCandidate = candidate;
                }
            }

            setCandidates(candidatesArray);
            setLeader(leaderCandidate);
        } catch (err) {
            console.error("Error fetching candidates:", err);
            setError("Failed to fetch candidates. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch candidates when the contract is updated
    useEffect(() => {
        fetchCandidates();
    }, [contract]);

    return (
        <div className="candidate-list">
            <h2>Candidates</h2>
            {loading ? (
                <div>Loading candidates...</div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : (
                <>
                    <ul>
                        {candidates.map((candidate) => (
                            <li key={candidate.id.toString()}>
                                <span>{candidate.name}</span>
                                <span>Votes: {candidate.voteCount.toString()}</span>
                            </li>
                        ))}
                    </ul>
                    {leader && (
                        <div className="leader">
                            <h3>Current Leader</h3>
                            <p>
                                {leader.name} with {leader.voteCount.toString()} votes
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CandidateList;