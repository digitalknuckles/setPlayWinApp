document.addEventListener('DOMContentLoaded', () => {
  console.log('Welcome to SetPlayWin!');
});
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Replace with your contract address and ABI
const CONTRACT_ADDRESS = "0xYourContractAddress";
const ABI = [
    "function donate() public payable",
];

async function donateCrypto() {
    if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
    }

    try {
        await provider.send("eth_requestAccounts", []); // Request wallet connection
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

        // Prompt user to input donation amount
        const amount = prompt("Enter donation amount in ETH:");
        if (!amount || isNaN(amount)) {
            alert("Invalid amount!");
            return;
        }

        // Send transaction
        const tx = await contract.donate({ value: ethers.utils.parseEther(amount) });
        alert(`Donation sent! Transaction hash: ${tx.hash}`);
    } catch (error) {
        console.error("Error:", error);
        alert("Transaction failed. Check console for details.");
    }
}

// Attach event listener to the button
document.getElementById("donate-button").addEventListener("click", donateCrypto);
