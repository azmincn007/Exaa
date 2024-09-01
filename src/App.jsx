import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createContext, useState } from 'react';
import { AuthProvider } from './Hooks/AuthContext';


// Import your components
export const   TownContext=createContext()

function App() {
  const queryClient = new QueryClient();
  const[selectedTown,setSelectedTown]=useState(null)
  return (
    <QueryClientProvider client={queryClient}>
          <AuthProvider> 
      <TownContext.Provider value={[selectedTown,setSelectedTown]}>

    <Router>
      <div id='root'>
        <Routes>
          <Route path="/" element={<Home />} />
         
        </Routes>
      </div>
    </Router>
    </TownContext.Provider>
    </AuthProvider> 

    </QueryClientProvider>
  );
}

export default App;