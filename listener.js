
// listener.js
const ethers = require('ethers');

async function main() {
    const provider = new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org/");

    provider.on("pending", async (txHash) => {
        try {
            const tx = await provider.getTransaction(txHash);
            if (tx) {
                console.log("New transaction:", tx.hash);
                // Save tx details or sync with storage here
            }
        } catch (err) {
            console.error("Error fetching tx:", err);
        }
    });
}

main();
