import { Component } from "react";
import { InfinitySpin } from "react-loader-spinner";

class Loader extends Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        return this.props.loading ? (<div className="loader-overlay">
            <div className="loader-object">
                <p>Interacting with the Blockchain</p>
                <InfinitySpin color="purple" />
            </div>
        </div>) : (null);
    }
}

export default Loader;