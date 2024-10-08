import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import LiveChart from "./LiveChart";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import "../CSS/Cards.css";
import { AppContext } from "../Context/AppContext";

function Card({ data, removeFromScreen }) {

    const navigate = useNavigate();
    const { setSelectedStock } = useContext(AppContext);

    const [cookies, setCookie, removeCookie] = useCookies(['userId']);
    const [closePrice, setClosePrice] = useState(null);
    const [changePercentage, setChangePercentage] = useState(null);
    const [changePrice, setChangePrice] = useState(null);

    const userId = cookies.userId;
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const API_KEY = process.env.REACT_APP_API_KEY;
    //const dataurl = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo";
    const dataurl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${data}&interval=5min&apikey=${API_KEY}`;
    const [stockData, setStockData] = useState({});

    async function fetchStockData() {
        try {
            const { data } = await axios.get(dataurl);
            const timeSeriesData = data["Time Series (5min)"];
            setStockData(timeSeriesData);
            const timeSeriesKeys = Object.keys(timeSeriesData);
            const firstIndexKey = timeSeriesKeys[0];
            const firstIndexObject = timeSeriesData[firstIndexKey];

            if (firstIndexObject) {
                const open = parseFloat(firstIndexObject["1. open"]);
                const close = parseFloat(firstIndexObject["4. close"]);
                const changePerc = ((close - open) / open) * 100;
                const changePrc = close - open;

                setClosePrice(close);
                setChangePercentage(changePerc);
                setChangePrice(changePrc);
            }
        } catch (error) {
            console.error("Error fetching stock data:", error);
        }
    }

    useEffect(() => {
        fetchStockData();
    }, [])

    const wishHandler = async (symbol) => {
        try {
            console.log(symbol);
            const response = await axios.post(`${backendUrl}/removefromlist`, {
                userId: userId,
                symbol
            });
            if (response.status === 200) {
                toast.success("Removed from Wishlist")
                removeFromScreen(symbol);
                // Remove the card from the screen if it's removed from the wishlist
            } else {
                toast.error("Try Again");
            }
        } catch (error) {
            toast.error("Something Went Wrong");
        }
    };

    function viewHandler() {
            setSelectedStock(data);
            navigate("/");
    }

    return (
        <div className="card">
            <div className="live-chart-container">
                <LiveChart stockData={stockData} />
            </div>
            <div className="info">
                <div className="font-bold">
                    <h2>{data}</h2>
                </div>
                <div className="info-container">
                    <div className="change-cont">
                        <label><p>change_percentage<sup>*</sup></p></label>
                        <p>{changePercentage?.toFixed(3)}</p>

                        <label><p>change_amount<sup>*</sup></p></label>
                        <p>{changePrice?.toFixed(3)}</p>
                    </div>
                    <div className="price-cont">
                        <label><p>price<sup>*</sup></p></label>
                        <p>{closePrice?.toFixed(3)}</p>
                    </div>
                </div>
                <div className="flex flex-row justify-between">
                    <button className="Add" onClick={viewHandler}>View Details</button>
                    <button className={"Remove"} onClick={()=>{wishHandler(data)}}>{"Remove from Watchlist"}</button>
                </div>
            </div>
        </div>
    );
}

export default Card;
