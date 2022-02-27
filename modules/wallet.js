import React, { Component } from "react";
import { networks } from "../utilities/networks";

class Wallet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentAccount: '',
			network: ''
        }
    }

	_checkNetworkChain = async () => {
		// This is the new part, we check the user's network chain ID
		const chainId = await ethereum.request({ method: 'eth_chainId' });
		this.props.onNetworkChanged(networks[chainId]);
		this.setState({
			network: networks[chainId]
		});

		ethereum.on('chainChanged', handleChainChanged);

		// Reload the page when they change networks
		function handleChainChanged(_chainId) {
			window.location.reload();
		}
	}

	switchToPolygonTestnet = async () => {
		if (window.ethereum) {
			try {
				// Try to switch to the Mumbai testnet
				await window.ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: '0x13881' }], // Check networks.js for hexadecimal network ids
				});
			} catch (error) {
				// This error code means that the chain we want has not been added to MetaMask
				// In this case we ask the user to add it to their MetaMask
				if (error.code === 4902) {
					try {
						await window.ethereum.request({
							method: 'wallet_addEthereumChain',
							params: [
								{	
									chainId: '0x13881',
									chainName: 'Polygon Mumbai Testnet',
									rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
									nativeCurrency: {
											name: "Mumbai Matic",
											symbol: "MATIC",
											decimals: 18
									},
									blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
								},
							],
						});
					} catch (error) {
						console.log(error);
					}
				}
				console.log(error);
			}
		} else {
			// If window.ethereum is not found then MetaMask is not installed
			alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
		} 
	}

    // Gotta make sure this is async.
	checkIfWalletIsConnected = async () => {
		// First make sure we have access to window.ethereum
		const { ethereum } = window;

		if (!ethereum) {
			console.log("Make sure you have MetaMask!");
			return;
		} else {
			console.log("We have the ethereum object", ethereum);
		}

        // Check if we're authorized to access the user's wallet
		const accounts = await ethereum.request({ method: 'eth_accounts' });

        // Users can have multiple authorized accounts, we grab the first one if its there!
		if (accounts.length !== 0) {
			const account = accounts[0];
			console.log('Found an authorized account:', account);
            this.setState({currentAccount: accounts[0]});
            this.props.onWalletConnected(accounts[0]);
		} else {
			console.log('No authorized account found');
			return;
		}

		this._checkNetworkChain();
	}

    connectWallet = async () => {
        try {
			const { ethereum } = window;

			if (!ethereum) {
				alert("Get MetaMask -> https://metamask.io/");
				return;
			}

			// Fancy method to request access to account.
			const accounts = await ethereum.request({ method: "eth_requestAccounts" });
		
			// This should print out public address once we authorize Metamask.
			console.log("Connected", accounts[0]);
			this.setState({currentAccount: accounts[0]});
            this.props.onWalletConnected(accounts[0]);
			this._checkNetworkChain();
		} catch (error) {
			console.log(error)
		}
    }

	// Create a function to render if wallet is not connected yet
	renderNotConnectedContainer = () => {
        return (
		<div className="connect-wallet-container">
			<button onClick={this.connectWallet} className="cta-button connect-wallet-button">
				Connect Wallet
			</button>
		</div>
  	)}

    componentDidMount = () => {
        this.checkIfWalletIsConnected();
    }

	renderConnectedContainer = () => {
		return (
		<div className="connected-wallet-container">
			<button className="cta-button connect-wallet-button">
				<img alt="Network logo" className="logo" src={ this.state.network.includes("Polygon") ? '/polygonlogo.png' : '/ethlogo.png'} />
				{ this.state.currentAccount ? <p> Wallet: {this.state.currentAccount.slice(0, 6)}...{this.state.currentAccount.slice(-4)} </p> : <p> Not connected </p> }
			</button>
		</div>);
	}

	renderTestnetSwitchButton = () => {
		if (this.state.network != 'Polygon Mumbai Testnet') {
			return (
				<div className="connect-wallet-container">
					<p>Please connect to the Polygon Mumbai Testnet</p>
					<button className='cta-button mint-button' onClick={this.switchToPolygonTestnet}>Click here to switch</button>
				</div>
			);
		}
	}

    render = () => {
		if (this.state.currentAccount == '')
		{
			return <div>{this.renderNotConnectedContainer()}</div>
		} else {
			return (<div>
				{this.renderConnectedContainer()}
				{this.renderTestnetSwitchButton()}
			</div>);
		}
    }
}

export default Wallet;