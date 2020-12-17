import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './components/screens/Home';
import SignIn from './components/screens/SignIn';
import SignUp from './components/screens/SignUp';
import Profile from './components/screens/Profile';
import CreatePost from './components/screens/CreatePost';

function App() {
  return (
    <Router>
      <Navbar />
      <Route path='/' exact component={Home} />
      <Route path='/signin' exact component={SignIn} />
      <Route path='/signup' exact component={SignUp} />
      <Route path='/profile' exact component={Profile} />
      <Route path='/create' exact component={CreatePost} />
    </Router>
  );
}

export default App;
