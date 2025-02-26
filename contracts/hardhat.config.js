require("@nomicfoundation/hardhat-toolbox");
module.exports = {
    solidity: "0.8.24",
    networks: {
      sepolia: {
        url: "https://eth-sepolia.g.alchemy.com/v2/zNGNk5x-t71rRCGxc7rJCgkGaRbXM0x7", 
        accounts: [
          "cc9fa407d6f8a28081b295db8d28027af4c5f18613cf97281a24a83b099a4ca4", 
        ],
        chainId: 11155111,
      },
    },
};