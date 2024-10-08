//beacause we have limited amount of api calls ie. 25 per day so i am using demo api
import { Route,Routes } from "react-router-dom";
import Home from "./Pages/Home";
import LogIn from "./Pages/LogIn";
import SignUp from "./Pages/SignUp";
import Nav from "./Components/Nav";
import { useState,useEffect} from "react";
import "./CSS/App.css"
import UserProfile from "./Pages/UserProfile";
import { useCookies } from "react-cookie";
import LandingPage from "./Pages/LandingPage";
import WatchList from "./Pages/WatchList";


function App() {
  
  const [isLoggedIn,setIsLoggedIn]=useState(false);
  const [cookies,setCookie,removeCookie] = useCookies();

  const userId = cookies.userId;
  

  useEffect(() => {
    if(userId){
    setIsLoggedIn(true);
    }else {
      setIsLoggedIn(false);
    }
  }, []);
  return (
    <div className="app">
      <div>
        <Nav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
      </div>
        <div>
          <Routes>
            <Route path="/" element={<LandingPage isLoggedIn={isLoggedIn}/>}/>
            <Route path="/home" element={<Home isLoggedIn={isLoggedIn} />}/>
            <Route path="/login" element={<LogIn setIsLoggedIn={setIsLoggedIn}/>}/>
            <Route path="/signup" element={<SignUp setIsLoggedIn={setIsLoggedIn}/>}/>
            <Route path="/userProfile" element={<UserProfile isLoggedIn={isLoggedIn} />}/>
            <Route path="/watchlist" element={<WatchList/>}/>
          </Routes>
        </div>
    </div>
  );
}

export default App;
