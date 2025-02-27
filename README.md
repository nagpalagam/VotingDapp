🏢 #Decentralized Voting DApp
This is a decentralized voting application built with React, Solidity, and IPFS, deployed on Sepolia Testnet. Users can connect their wallet, vote for candidates, and store voting history securely on IPFS.

🚀 Features
🔹 MetaMask Integration for secure authentication.
🔹 Ethereum Smart Contract (Deployed on Sepolia Testnet).
🔹 IPFS Storage for decentralized voting records.
🔹 Vercel Deployment for frontend hosting.
📌 Prerequisites
Make sure you have the following installed:

Node.js (v16 or later) – Download
MetaMask Extension – Download
Git – Download
Infura or Pinata API Key (for IPFS storage)
⚙️ Installation & Setup
1⃣ Clone the Repository
git clone https://github.com/Agam1708/VotingDapp.git
cd VotingDapp
2⃣ Install Dependencies
npm install
3⃣ Set Up Environment Variables
Create a .env file in the root directory and add:

VITE_INFURA_PROJECT_ID=your_infura_project_id
VITE_CONTRACT_ADDRESS=0x6AeD57D577542A04646eA9b1780adB6288768242
4⃣ Start the Development Server
cd frontend
npm run
Now, open http://localhost:3000 in your browser.

📜 Smart Contract Deployment (Optional)
If you want to redeploy the contract:

Install Hardhat

npm install --save-dev hardhat
Compile the Contract

npx hardhat compile
Deploy the Contract

npx hardhat run scripts/deploy.js --network sepolia
🛠️ Deployment on Vercel
To deploy the frontend on Vercel:

Install Vercel CLI

npm install -g vercel
Deploy

vercel --prod
⚡ Usage
Open the application in your browser.
Connect your MetaMask wallet.
View the list of candidates.
Cast your vote.
Voting history is stored securely on IPFS.
📝 Code Structure & Comments
The code is well-commented to explain each function.
Key files:
frontend/src/App.js – Main React component.
frontend/src/components/VotingForm.js – Voting form UI.
frontend/src/ipfs.js – Handles IPFS storage.
contracts/Voting.sol – Smart contract.
