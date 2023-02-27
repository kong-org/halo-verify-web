import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { arbitrum, mainnet, polygon } from 'wagmi/chains'

import './styles/style.scss'
import Home from './pages/Home'
import Width from './components/Width'
import Header from './components/Header'
import Footer from './components/Footer'
import Register from './pages/Register'
import Confirm from './pages/Confirm'
import Success from './pages/Success'

const chains = [arbitrum, mainnet, polygon]

// Wagmi client
const { provider } = configureChains(chains, [walletConnectProvider({ projectId: '1d1ddeb6fc217856443baa7ad6cf5091' })])

const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({
    projectId: '1d1ddeb6fc217856443baa7ad6cf5091',
    version: '1',
    appName: 'web3Modal',
    chains,
  }),
  provider,
})

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains)

function App() {
  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <Width>
          <BrowserRouter>
            <Header />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/confirm" element={<Confirm />} />
              <Route path="/success" element={<Success />} />
            </Routes>

            <Footer />
          </BrowserRouter>
        </Width>
      </WagmiConfig>

      <Web3Modal projectId="1d1ddeb6fc217856443baa7ad6cf5091" ethereumClient={ethereumClient} />
    </>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
