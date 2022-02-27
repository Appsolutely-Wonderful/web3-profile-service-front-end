import React, { useState } from "react";
import Head from 'next/head'
import Wallet from '../modules/wallet';
import NftInputForm from '../modules/nft_form';
import {WhoAmI, CONTRACT_ADDRESS} from "../utilities/whoami";
import NftViewer from "../modules/nft_viewer";
import Loader from "../modules/loader";

export default function Home() {
  // Constants
  const TWITTER_HANDLE = '_buildspace';
  const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

  const [currentAccount, setCurrentAccount] = useState('');
  const [domain, setDomain] = useState('');
  const [image, setImage] = useState('');
  const [network, setNetwork] = useState('');
  const [mints, setMints] = useState([]);
  const [loading, setLoading] = useState(false);

  let resetInputField = () => {
    setDomain('');
    setImage('');
  }

  let mint = async () => {
    setLoading(true);
    let success = await WhoAmI.mint(currentAccount, domain, image);
    if (success) {
      resetInputField();
      setTimeout(() => {
        loadImages();
      }, 2000);
    }
    setLoading(false);
  }

  let updateImage = async () => {
    setLoading(true);
    await WhoAmI.updateImage(currentAccount, domain, image);
    resetInputField();
    setTimeout(() => {
      loadImages();
    }, 2000);
    setLoading(false);
  }

  let loadImages = async (force=false) => {
    console.log("load images called on network ", network);
      if (force || network === 'Polygon Mumbai Testnet') {
        let data = await WhoAmI.fetchMints();
        setMints(data);
      }
  }

  let editNft = (domain, image) => {
    setDomain(domain);
    setImage(image);
  }

  let onNetworkUpdated = (network) => {
    console.log("Updating network to", network)
    setNetwork(network);
    setTimeout(() => {
      loadImages(true);
    })
  }

  return (
    <div className="container">
      <Head>
        <title>Who Am I</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>

        <Loader loading={loading} />

        <h1 className="title">
        😎 WhoAmI Profile Service
        </h1>

        <p className="description">
          Your one and only Image ID
        </p>

        <div className="connect-wallet-container">
          <img src="https://media.giphy.com/media/3o7TKqrE93zMjfu4QU/giphy.gif" alt="Profile gif" />
        </div>
        

        <Wallet onWalletConnected={setCurrentAccount} onNetworkChanged={onNetworkUpdated} />
        {currentAccount != '' && (<NftInputForm network={network} domain={domain} setDomain={setDomain} image={image} setImage={setImage} mint={mint} updateImage={updateImage}/>)}
        
        <NftViewer account={currentAccount} mints={mints} edit={editNft} refresh={loadImages} contract={CONTRACT_ADDRESS}/>
      </main>

      <footer>
        <p>
        <a
          href="https://github.com/Appsolutely-Wonderful/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img alt="Twitter Logo" className="github-logo" src="/github.svg" />
          Created by Appsolutely Wonderful
        </a>  
        <a
						href={TWITTER_LINK}
						target="_blank"
						rel="noreferrer"
					><img alt="Twitter Logo" className="twitter-logo" src="/twitter-logo.svg" />{`Built with @${TWITTER_HANDLE}`}</a>
        </p>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 4rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }

        .twitter-logo {
          width: 35px;
          height: 35px;
        }

        .github-logo {
          width: 35px;
          height: 35px;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
