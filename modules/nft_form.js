import { Component } from "react";

class NftInputForm extends Component {
    constructor(props) {
        super(props);
		this.state = {
			preview: ''
		}
    }

	showPreview = () => {
		this.setState({preview: this.props.image});
	}

    render = () => {
		// If not on Polygon Mumbai Testnet, render "Please connect to Polygon Mumbai Testnet"
		if (this.props.network == 'Polygon Mumbai Testnet') {
			return (
				<div className="form-container">
					<div className="first-row">
						<input
							type="text"
							value={this.props.domain}
							placeholder='Who Are You?'
							onChange={e => this.props.setDomain(e.target.value)}
						/>
						<p className='tld'>.whoami</p>
					</div>

					<input
						type="text"
						value={this.props.image}
						placeholder='Define your image URL'
						onChange={e => this.props.setImage(e.target.value)}
					/>

					<div className="button-container">
						<button className='cta-button mint-button' disabled={null} onClick={this.showPreview}>
							Preview
						</button>  
						<button className='cta-button mint-button' disabled={null} onClick={this.props.mint}>
							Mint
						</button>  
						<button className='cta-button mint-button' disabled={null} onClick={this.props.updateImage}>
							Set data
						</button>  
					</div>

					
					{this.state.preview != '' && <div className="connect-wallet-container"><img src={this.state.preview} /></div>}

				</div>
			);
		}
		else {
			return (null);
		}
    }
}

export default NftInputForm;