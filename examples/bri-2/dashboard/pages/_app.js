import React from "react";
import App from "next/app";
import Head from "next/head";
import Router from "next/router";
import NProgress from 'nprogress'
import { UseWalletProvider } from 'use-wallet';
import detectEthereumProvider from '@metamask/detect-provider';

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";

Router.events.on("routeChangeStart", (url) => {
  console.log(`Loading: ${url}`);
  NProgress.start()
});
Router.events.on("routeChangeComplete", () => {
  NProgress.done()
});
Router.events.on("routeChangeError", () => {
  NProgress.done()
});

const getEthChainId = async () => {
  const wallet_provider = typeof window !== 'undefined' && await detectEthereumProvider();

  if (wallet_provider) {
    console.log('Ethereum successfully detected!')
    // From now on, this should always be true:
    // provider === window.ethereum
    // Access the decentralized web!
    // Legacy providers may only have ethereum.sendAsync
    let current_provider = await wallet_provider.request({
      method: 'eth_chainId'
    });
    return parseInt(current_provider, 16);
  } else {
    // if the provider is not detected, detectEthereumProvider resolves to null
    console.error('Please install MetaMask!');
  }
}

export default class MyApp extends App {
  componentDidMount = async () => {
    this.setState({
      ...this.state,
      chainId: await getEthChainId(),
    }, () => {
        //finished
    });
  }

  shouldComponentUpdate = async (nextProps, nextState) => {
    //console.log("nextState ==> ", nextState.chainId, this.state.chainId);
    if (this.state.chainId !== nextState.chainId) {
      this.setState({chainId: nextState.chainId});
      return true;
    } else if (this.state.chainId === nextState.chainId){
      return false;
    } else {
      return false;
    }
    
  }

  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    
    return { pageProps };
  }

  state = {
    chainId: 1,
  }


  render() {
  
    const { Component, pageProps } = this.props;
    const Layout = Component.layout || (({ children }) => <>{children}</>);

    return (
      <React.Fragment>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <title>Baseline Dashboard</title>
        </Head>
        <UseWalletProvider
          chainId={this.state.chainId}
          connectors={{
            // This is how connectors get configured
            portis: { dAppId: 'baseline-dashboard-id-1-0' },
          }}
        >
        <Layout>
          <Component {...pageProps} />
        </Layout>
        </UseWalletProvider>
      </React.Fragment>
    );
  }
}
