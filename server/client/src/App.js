import React, { useContext, useEffect } from 'react';
import Navbar from './components/Navbar';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from 'react-router-dom';
import Home from './components/screens/Home';
import SignIn from './components/screens/SignIn';
import SignUp from './components/screens/SignUp';
import Profile from './components/screens/Profile';
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import SubscribedUserPosts from './components/screens/SubscribedUserPosts';
import Reset from './components/screens/Reset';
import NewPassword from './components/screens/NewPassword';
import UserContext from './context/userContext';
import { USER } from './context/userTypes';

const Routing = () => {
  const history = useHistory();
  const { dispatch } = useContext(UserContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      dispatch({ type: USER, payload: user });
    } else {
      if (!history.location.pathname.startsWith('/resetpassword'))
        history.push('/signin');
    }
  }, [history, dispatch]);

  return (
    <Switch>
      <Route path='/' exact component={Home} />
      <Route path='/signin' exact component={SignIn} />
      <Route path='/signup' exact component={SignUp} />
      <Route path='/profile' exact component={Profile} />
      <Route path='/create' exact component={CreatePost} />
      <Route path='/profile/:userId' exact component={UserProfile} />
      <Route
        path='/subscribedusersposts'
        exact
        component={SubscribedUserPosts}
      />
      <Route path='/resetpassword' exact component={Reset} />
      <Route path='/resetpassword/:token' exact component={NewPassword} />
    </Switch>
  );
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routing />
    </Router>
  );
}

export default App;
