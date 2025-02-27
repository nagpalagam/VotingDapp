import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './Voting.css';
import VotingContract from '../contractABI';

const VotingForm = ({ candidates, onVote }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    // Check if MetaMask is installed and request account access
    useEffect(() => {
        const checkMetaMask = async () => {
            if (!window.ethereum) {
                alert('Please install MetaMask to use this app.');
            } else {
                try {
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                } catch (err) {
                    console.error("Error connecting to MetaMask:", err);
                }
            }
        };
        checkMetaMask();
    }, []);

    // Handle the voting process
    const handleVote = async () => {
        if (!window.ethereum) {
            alert('MetaMask is not installed. Please install it to vote.');
            return;
        }

        if (selectedCandidate === null) {
            alert('Please select a candidate to vote.');
            return;
        }

        setLoading(true);
        setError(null);
        setConfirmationMessage('');

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(VotingContract.address, VotingContract.abi, signer);

            // Submit the vote
            const tx = await contract.vote(selectedCandidate);
            await tx.wait(); // Wait for the transaction to be mined

            setConfirmationMessage('Vote submitted successfully!');
            onVote(); // Refresh the candidates list
        } catch (err) {
            console.error("Error submitting vote:", err);
            console.error(err); // Log the actual error for debugging
            setError('Error submitting vote. Please try again.');

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="voting-form">
            <h2>Vote for a Candidate</h2>
            {candidates && candidates.length > 0 ? (
                candidates.map((candidate, index) => (
                    <div key={index} className="candidate-item">
                        <input
                            type="radio"
                            name="candidate"
                            value={index}
                            checked={selectedCandidate === index}
                            onChange={() => setSelectedCandidate(index)}
                        />
                        <label>{candidate.name}</label>
                    </div>
                ))
            ) : (
                <div>No candidates available</div>
            )}

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <>
                    <button onClick={handleVote} disabled={loading}>
                        Submit Vote
                    </button>
                    {error && <div className="error">{error}</div>}
                    {confirmationMessage && <div className="confirmation">{confirmationMessage}</div>}
                </>
            )}
        </div>
    );
};

export default VotingForm;
