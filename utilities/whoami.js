import { ethers } from "ethers";
import DomainsAbi from './Domains.json';

const CONTRACT_ADDRESS = '0xd5A6A203eA8de47718C452Ab08E8444807590434'

const WhoAmI = {
    _is_valid_domain: function (domain) {
        if (!domain) {
            alert("Domain can't be empty");
            return false;
        }

        if (domain.length > 8) {
            alert("Domain must be 8 characters or less");
            return false;
        }

        return true;
    },

    _get_domain_price: function (domain) {
        return (domain.length * 0.002).toString();
    },

    mint: async function (address, domain, image) {
        if (!this._is_valid_domain(domain)) {
           return false;
        }

        const price = this._get_domain_price(domain);
	    console.log("Minting domain", domain, "with price", price);

        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(CONTRACT_ADDRESS, DomainsAbi.abi, signer);
                
                console.log("Going to pop wallet now to pay gas...")
                console.log("Paying ", price);
                let tx = await contract.register(domain, {value: ethers.utils.parseEther(price)});
                // Wait for the transaction to be mined
                const receipt = await tx.wait();
    
                // Check if the transaction was successfully completed
                if (receipt.status === 1) {
                    console.log("Domain minted! https://mumbai.polygonscan.com/tx/"+tx.hash);
                    
                    // Set the record for the domain
                    tx = await contract.setImage(domain, image);
                    await tx.wait();
    
                    console.log("Record set! https://mumbai.polygonscan.com/tx/"+tx.hash);
                    
                    return true;
                }
                else {
                    alert("Transaction failed! Please try again");
                    return false;
                }
            }
        }
        catch(error){
            console.log(error);
        }
    },

    updateImage: async function (account, domain, image) {
        if (!image || !domain) { return }
        console.log("Updating domain", domain, "with image", image);
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(CONTRACT_ADDRESS, DomainsAbi.abi, signer);
    
                let tx = await contract.setImage(domain, image);
                await tx.wait();
                console.log("Image set https://mumbai.polygonscan.com/tx/"+tx.hash);
            }
        } catch(error) {
            console.log(error);
        }
    },

    // Add this function anywhere in your component (maybe after the mint function)
    fetchMints: async function () {
        try {
            const { ethereum } = window;
            if (ethereum) {
                // You know all this
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(CONTRACT_ADDRESS, DomainsAbi.abi, signer);
                    
                console.log("Fetching mints!");
                // Get all the domain names from our contract
                // console.log(contract);
                const names = await contract.getAllNames();
                    
                // For each name, get the record and the address
                const mintRecords = await Promise.all(names.map(async (name) => {
                    const image = await contract.images(name);
                    const owner = await contract.domains(name);
                    return {
                        id: names.indexOf(name),
                        name: name,
                        image: image,
                        owner: owner,
                    };
                }));

                console.log("MINTS FETCHED ", mintRecords);
                return mintRecords;
            }
        } catch(error){
            console.log(error);
        }
    }
}

export {CONTRACT_ADDRESS, WhoAmI};