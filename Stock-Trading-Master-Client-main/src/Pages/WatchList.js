import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";
import axios from "axios";
import Card from "../Components/Card";
import "../CSS/Watchlist.css"

function WatchList() {
  const [cookies, setCookie, removeCookie] = useCookies(["userId"]);
  const [userData, setUserData] = useState("");

  
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const userId = cookies.userId;


  const getUserData = async () => {
    try {
      const response = await axios.post(`${backendUrl}/getUserData`, {
        userId: userId,
      });
      setUserData(response.data.data.watchList);
    } catch (error) {
      toast.error("An error occurred while fetching user data");
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const removeFromScreen = (symbol) => {
    setUserData(prevData => prevData.filter(item => item !== symbol));
  };


  return (
    <div className="Wishlist">
        <div className="card-container">
          {userData.length > 0 ? (
            userData.map((item, index) => (
              <Card key={index} data={item}  removeFromScreen={removeFromScreen} />
            ))
          ) : (
            <div className="flex self-center font-bold text-[30px] text-black">Please add some cards to your Watchlist.</div>
          )}
        </div>
    </div>
  );
}

export default WatchList;
