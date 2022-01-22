
import { Container } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { EmailProvider } from './contexts/emailContext';
import MainRoute from './pages/MainRoute';

function App() {
  return (
    <div className='App'>
      <EmailProvider>
        <BrowserRouter>
          <Container>
            <MainRoute />
          </Container>
        </BrowserRouter>
      </EmailProvider>
    </div>
  )
}

export default App;
