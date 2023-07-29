import logo from './logo.svg';
import './App.css';
import Quiz from './components/Quiz';
import StartPage from './components/StartPage';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div>
    <h1 className='app-heading'>Quiz App</h1>
    <Routes>
      <Route path='/' element={<StartPage />}/>
      <Route path='/quiz' element={<Quiz />} />
    </Routes>
    {/* <Quiz /> */}
  </div>
  );
}

export default App;
