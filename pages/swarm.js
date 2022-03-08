import React, { useState } from "react";
import Head from 'next/head'
import Loader from "../modules/loader";
import Link from "next/link";

export default function Swarm() {
  // Constants
  const TWITTER_HANDLE = '_buildspace';
  const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

  const [selectedImage, setImage] = useState('');
  const [isImageSelected, setImageSelected] = useState(false);
  const [fileHash, setHash] = useState('');
  const [loading, setLoading] = useState(false);
  const onFileSelected = (e) => {
    setImage(e.target.files[0]);
    setImageSelected(true);
  }

  const hashDisplay = () => {
    if (fileHash != '') {
      return (<p className="swarm-hash">Uploaded file hash
      <br/>
      Copy This!
      <br/>
      {fileHash}
      <br/>
      <Link href="/">Back to app</Link>
      </p>)
    } else {
      return (null)
    }
  }

  const onSubmit = (e) => {
    const formData = new FormData();
		formData.append('file', selectedImage);
    let endpoint = "http://swarm.appsolutelywonderful.com:5000"
    let headers = new Headers();
    setLoading(true);
    fetch(endpoint, {
      method: "POST",
      body: formData,
      headers: headers
    }).then(async (result) => {
      setLoading(false);
      console.log(result)
      let response = await result.json();
      console.log(response);
      if ('error' in response) {
        alert(response.error);
      } else if ('hash' in response) {
        setHash(response.hash);
      } else {
        alert("Got unknown response!");
      }
    });
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
          <img id="swarm-img" src="https://docs.ethswarm.org/img/swarm-logo-2.svg"/> Swarm Gateway
        </h1>
        
        {fileHash == '' && <p>Select a file to upload to the swarm</p>}
        {fileHash == '' && <input onChange={onFileSelected} className="file-input" type="file" />}
        {fileHash == '' && <button disabled={!isImageSelected} onClick={onSubmit} type="submit">Upload To Swarm!</button>}

        {hashDisplay()}
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
      

        #swarm-img {
          display: inline;
          max-height: 50px;
        }

        p {
          margin-top: 15px;
          font-size: 1.5em;
          margin-bottom: 15px;
        }

        .file-input {
          border: none;
        }

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
          min-width: 800px;
          vertical-align: middle;
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
