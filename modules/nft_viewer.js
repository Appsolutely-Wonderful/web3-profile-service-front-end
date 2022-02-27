import { Component } from "react";
import WhoAmI from "../utilities/whoami";

class NftViewer extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        setTimeout(() => {
            this.props.refresh();            
        }, 1000);
    }

    render = () => {
        let currentAccount = this.props.account;
        let mints = this.props.mints;
        let CONTRACT_ADDRESS = this.props.contract;
        if (currentAccount && mints && mints.length > 0) {
            return (
                <div className="mint-container">
                    <p className="subtitle" style={{'textAlign': 'center'}}> Recently minted domains!</p>
                    <div className="mint-list">
                        { mints.map((mint, index) => {
                            return (
                                <div className="mint-item" key={index}>
                                    <div className='mint-row'>
                                        <div>
                                        <a className="link" href={`https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}/${mint.id}`} target="_blank" rel="noopener noreferrer">
                                            <p className="underlined">{' '}{mint.name}{'.whoami'}{' '}</p>
                                        </a>
                                        <img className="nft-image" src={mint.image} />
                                        </div>
                                        {/* If mint.owner is currentAccount, add an "edit" button*/}
                                        { mint.owner.toLowerCase() === currentAccount.toLowerCase() ?
                                            <button className="edit-button" onClick={() => this.props.edit(mint.name, mint.image)}>
                                                <img className="edit-icon" src="https://img.icons8.com/metro/26/000000/pencil.png" alt="Edit button" />
                                            </button>
                                            :
                                            null
                                        }
                                    </div>
                        <p> {mint.record} </p>
                    </div>)
                    })}
                </div>
            </div>);
        } else {
            return (null);
        }
    }
}

export default NftViewer;