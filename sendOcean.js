const { SuiKit } = require('@scallop-io/sui-kit');
const fs = require('fs');
const readline = require('readline');

const recipient = "";
const oceanCt = '0xa8816d3a6e3136e86bc2873b1f94a15cadc8af2703c075f2d546c2ae367f4df9::ocean::OCEAN';

async function transferCoin() {
    const fileStream = fs.createReadStream('wallets.csv');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        const [mnemonics] = line.trim().split(','); 
        if (mnemonics) {
            try {
                const suiKit = new SuiKit({ mnemonics });
                let b = await suiKit.getBalance(oceanCt);
                let oceanAmount = b["totalBalance"];
                if (oceanAmount > 0) {
                    await suiKit.transferCoin(recipient, oceanAmount, oceanCt);
                }
                console.log(`Send from ${suiKit.currentAddress()}: ${oceanAmount / 1000000000}`);
            } catch (error) {
                console.log("Error", error);
            }
        }
    }
}

transferCoin().catch(console.error);
