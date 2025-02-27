import { create } from 'ipfs-http-client';

// Connect to IPFS (Infura or your own IPFS node)
const ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0' });

// Function to upload data to IPFS
export const uploadToIPFS = async (data) => {
    try {
        const { path } = await ipfs.add(JSON.stringify(data)); // Convert data to JSON
        return path; // Return the IPFS hash
    } catch (error) {
        console.error("Error uploading to IPFS:", error);
        throw new Error("IPFS upload failed");
    }
};
