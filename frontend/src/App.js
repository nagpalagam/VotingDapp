import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import VotingForm from './components/Voting';
import CandidateList from './components/CandidateList';
import VotingContract from './contractABI.json';
import { uploadToIPFS } from './ipfs'; // Import IPFS function
import './App.css';

const App = () => {
    const [contract, setContract] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [ipfsHash, setIpfsHash] = useState(null);
    const [votingHistory, setVotingHistory] = useState(null); // Store fetched data

    // Connect MetaMask
    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                setLoading(true);
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]);

                const votingContract = new ethers.Contract(VotingContract.address, VotingContract.abi, signer);
                setContract(votingContract);

                const candidatesList = await votingContract.getCandidates();
                setCandidates(candidatesList);
            } catch (err) {
                console.error("Error connecting wallet:", err);
                setError("Failed to connect wallet.");
            } finally {
                setLoading(false);
            }
        } else {
            alert("MetaMask is required.");
        }
    };

    // Store Voting History in IPFS
    const saveVotingDataToIPFS = async () => {
        if (!account) return;

        try {
            const userData = {
                wallet: account,
                votes: candidates.map(candidate => ({
                    name: candidate.name,
                    votes: candidate.voteCount.toString()
                })),
                timestamp: new Date().toISOString()
            };

            const hash = await uploadToIPFS(userData);
            setIpfsHash(hash);
            console.log("Data stored on IPFS:", hash);
        } catch (error) {
            console.error("IPFS upload error:", error);
            setError(error.message);
        }
    };

    // Handle Vote and Save to IPFS
    const handleVote = async () => {
        if (contract) {
            try {
                const candidatesList = await contract.getCandidates();
                setCandidates(candidatesList);
                await saveVotingDataToIPFS();
            } catch (err) {
                console.error("Error fetching candidates:", err);
                setError("Failed to fetch candidates.");
            }
        }
    };

    // Fetch Voting History from IPFS
    const fetchVotingHistory = async () => {
        if (!ipfsHash) {
            setError("No IPFS hash found.");
            return;
        }

        try {
            const response = await fetch(`https://ipfs.io/ipfs/${ipfsHash}`);
            const data = await response.json();
            setVotingHistory(data);
            console.log("Fetched Voting Data:", data);
        } catch (error) {
            console.error("Error fetching from IPFS:", error);
            setError("Failed to fetch data from IPFS.");
        }
    };

    // Check Wallet Connection on Load
    useEffect(() => {
        const checkWalletConnection = async () => {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const signer = await provider.getSigner();
                    const votingContract = new ethers.Contract(VotingContract.address, VotingContract.abi, signer);
                    setContract(votingContract);

                    const candidatesList = await votingContract.getCandidates();
                    setCandidates(candidatesList);
                }
            }
        };
        checkWalletConnection();
    }, []);

    return (
        <div className="app">
            <div className="header">
                <h1>Voting DApp</h1>
                {!account ? (
                    <button onClick={connectWallet} disabled={loading} className="connect-button">
                        {loading ? "Connecting..." : "Connect Wallet"}
                    </button>
                ) : (
                    <p className="wallet-info">
                        Connected: {account.substring(0, 6)}...{account.slice(-4)}
                    </p>
                )}
            </div>

            {error && <p className="error-message">{error}</p>}

            {contract && (
                <div className="content">
                    <VotingForm candidates={candidates} onVote={handleVote} />
                    <CandidateList contract={contract} />
                </div>
            )}

            {/* Display IPFS Hash & Fetch Data */}
            {ipfsHash && (
                <div className="ipfs-hash">
                    <h3>Voting Data Stored on IPFS:</h3>
                    <p>
                        <a href={`https://ipfs.io/ipfs/${ipfsHash}`} target="_blank" rel="noopener noreferrer">
                            {ipfsHash}
                        </a>
                    </p>
                    <button onClick={fetchVotingHistory}>Fetch Voting History</button>
                </div>
            )}

            {/* Display Fetched Data */}
            {votingHistory && (
                <div className="history">
                    <h3>Fetched Voting History:</h3>
                    <p><strong>Wallet:</strong> {votingHistory.wallet}</p>
                    <p><strong>Timestamp:</strong> {votingHistory.timestamp}</p>
                    <h4>Candidates & Votes:</h4>
                    <ul>
                        {votingHistory.votes.map((vote, index) => (
                            <li key={index}>{vote.name}: {vote.votes} votes</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default App;
