import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LiveChart from "./LiveChart";
import { AppContext } from "../Context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import { useCookies } from "react-cookie";
import StocksList from "./StocksList";

function DetailedCard({ isLoggedIn }) {
    const [cookies, setCookie, removeCookie] = useCookies();
    const userId = cookies.userId;
    const navigate = useNavigate();
    const { selectedStock, getUserData } = useContext(AppContext);
    const [quantity, setQuantity] = useState("");
    const [loading, setLoading] = useState(true);
    const [stockData, setStockData] = useState({});
    const [closePrice, setClosePrice] = useState(null);
    const [changePercentage, setChangePercentage] = useState(null);
    const [changePrice, setChangePrice] = useState(null);
    const [stocks, setStocks] = useState([]);

    function changeHandler(event) {
        const value = event.target.value;
        setQuantity(value);
    }
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
   // const url = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo";
    const API_KEY = process.env.REACT_APP_API_KEY;
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${selectedStock}&interval=5min&apikey=${API_KEY}`;

    async function fetchStockData() {
        try {
            setLoading(true);
            const { data } = await axios.get(url);
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
            setLoading(false);
        } catch (error) {
            console.error("Error fetching stock data:", error);
        }
    }

    useEffect(() => {
        if (!selectedStock) {
            navigate("/home");
        } else {
            fetchStockData();
        }
    }, [selectedStock, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getUserData();
            if (data) {
                setStocks(data.stocks);
            }
        };
        fetchData();
    }, [getUserData]);

    async function buyHandler() {
        if (!isLoggedIn) {
            toast.error("please log in");
        } else {
            try {
                const now = new Date();
                const formattedTimestamp = now.toLocaleString('en-GB', { hour12: false }).replace(',', '');
                if (quantity > 0) {
                    const { data } = await axios.put(`${backendUrl}/buy`, {
                        userId: userId,
                        quantity: quantity,
                        price: closePrice,
                        symbol: selectedStock,
                        timestamp: formattedTimestamp
                    });
                    if (data.message === "Purchased") {
                        toast.success("Purchased");
                    } else {
                        toast.error("An error occurred");
                    }
                }
            } catch (e) {
                console.log(e.response.data.msg);
                toast.error(e.response.data.msg);
            }
        }
    }
    const wishHandler = async (symbol) => {
        try {
            console.log(symbol);
            const response = await axios.post(`${backendUrl}/addtolist`, {
                userId: userId,
                symbol
            });
            if (response.status === 200) {
                toast.success("Added to Wishlist");
            } else {
                toast.error("Try Again");
            }
        } catch (error) {
            toast.error("Something Went Wrong");
        }
    };
    return (
        <div className="flex items-center justify-center my-[30px]">
            {
                loading ?
                    (<div role="status">
                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>) :
                    (<div className="w-[100%] flex items-center lg:items-start flex-col mx-[10px] lg:mx-[40px] lg:mr-[100px]">
                        <div className="flex flex-col lg:flex-row justify-between w-full h-max gap-[50px]">
                            <div className="flex flex-col w-[full] lg:w-[70%] bg-white lg:mt-[50px] rounded-md shadow-md">
                                <div className="font-bold text-[30px] underline flex flex-row justify-between mb-[10px] mt-[20px] px-[10px]">
                                    <h1>{selectedStock}</h1>
                                </div>
                                <div className="w-[95%]">
                                    <LiveChart stockData={stockData} />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="border bg-white p-[30px] w-full rounded-md shadow-md lg:mt-[50px]">
                                    <p className="w-full p-1 uppercase text-center font-bold text-xl mb-5 rounded-md ">Buy</p>
                                    <label>
                                        <p className="text-gray-500 mb-[10px]">
                                            Set Quantity<sup className="text-[10px] align-super">*</sup>
                                        </p>
                                        <input
                                            required
                                            type="number"
                                            name="quantity"
                                            onChange={changeHandler}
                                            placeholder="Enter Quantity"
                                            value={quantity}
                                            className="bg-gray-200 rounded-md p-[5px] w-full"
                                        />
                                    </label>
                                    <button className="w-full mt-[20px] border border-gray-800 p-[5px] rounded-md px-[10px] bg-[green] text-[white] hover:text-[black] hover:bg-[white]" onClick={buyHandler}>Buy</button>
                                </div>

                                <div className=" flex flex-col pb-[20px] mt-[30px] lg:mt-[70px] bg-white p-[30px] rounded-md shadow-md">
                                    <div className="flex flex-row justify-between gap-[15px]">
                                        <div>
                                            <label><p>change percentage<sup>*</sup></p></label>
                                            <p className="mb-[20px]">{changePercentage ? changePercentage.toFixed(2) : 'N/A'}%</p></div>

                                        <div>
                                            <label><p>change amount<sup>*</sup></p></label>
                                            <p>{changePrice ? changePrice.toFixed(4) : 'N/A'}</p></div>
                                    </div>
                                    <div className="">
                                        <label><p>price<sup>*</sup></p></label>
                                        <p>{closePrice ? closePrice.toFixed(4) : 'N/A'}</p>
                                    </div>
                                    <button className="w-full mt-[20px] border border-gray-800 p-[5px] rounded-md px-[10px] bg-[green] text-[white] hover:text-[black] hover:bg-[white]" onClick={()=>wishHandler(selectedStock)}>Add to WatchList</button>
                                </div>
                            </div>
                        </div>
                        <div className="w-full mt-[50px]">
                            {stocks && <StocksList stocks={stocks} />}
                        </div>
                    </div>)
            }
        </div>
    );
}

export default DetailedCard;
