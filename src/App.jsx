import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createContext, useState } from 'react';


// Import your components
export const   TownContext=createContext()

function App() {
  const queryClient = new QueryClient();
  const[selectedTown,setSelectedTown]=useState(null)
  return (
    <QueryClientProvider client={queryClient}>
      <TownContext.Provider value={[selectedTown,setSelectedTown]}>

    <Router>
      <div id='root'>
        <Routes>
          <Route path="/" element={<Home />} />
         
        </Routes>
      </div>
    </Router>
    </TownContext.Provider>

    </QueryClientProvider>
  );
}

export default App;