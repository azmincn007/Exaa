import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import './index.css'
import theme from './theme'
import App from './App'
import { HelmetProvider } from 'react-helmet-async'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
    <ChakraProvider  theme={theme}>
      <App />
    </ChakraProvider>
    </HelmetProvider>
  </React.StrictMode>,
)