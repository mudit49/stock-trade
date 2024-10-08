import { useContext, useEffect, useState } from "react";
import { SiMinutemailer } from "react-icons/si";
import TradeHistory from "../Components/TradeHistory";
import { FaUser } from "react-icons/fa";
import StocksList from "../Components/StocksList";
import { AppContext } from "../Context/AppContext";
import toast from "react-hot-toast";
import { useCookies } from "react-cookie";
import axios from "axios";


function UserProfile({ isLoggedIn }) {

    
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const [cookies, setCookie, removeCookie] = useCookies();
    const userId = cookies.userId;
    const { getUserData } = useContext(AppContext);
    const [quantity, setQuantity] = useState("");
    const [stocks, setStocks] = useState([]);
    const [userTradeData, setUserTradeData] = useState([]);
    const [balance, setBalance] = useState(1000);
    const [userName, setUserName] = useState()
    const [email, setEmail] = useState();

    useEffect(() => {
        const fetchData = async () => {
            const data = await getUserData();
            if (data) {
                setStocks(data.stocks);
                const backendData = data.trade;
                const formattedData = backendData.map(item => [
                    item.ticker,
                    item.action,
                    item.price,
                    item.quantity,
                    item.timestamp
                ]);
                setUserTradeData(formattedData);
                setBalance(data.Balance);
                setUserName(data.userName);
                setEmail(data.email);
            }
        };
        fetchData();
    }, [getUserData]);


    function changeHandler(event) {
        const value = event.target.value;
        setQuantity(value);
        // setQuantity(value === "" || value < 1 ? 1 : parseInt(value));
    }

    async function addHandler() {
        try {
            const { data } = await axios.put(`${backendUrl}/addbalance`,
                {
                    userId: userId,
                    balance: quantity,
                }
            )
            setBalance(data.balance);
            toast.success("Amount Added");
        } catch (e) {
            toast.error("some error occured");
        }
    }
    return (
        <div>
            {!isLoggedIn ? (
                <div className="flex items-center justify-center">
                    <div role="status">
                        <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>) :
                (<div className=" text-black flex flex-col w-full px-[10px] lg:px-[50px] gap-[20px] lg:gap-[50px] mb-[20px]">
                    <p className="text-[25px] lg:text-[60px] flex flex-row gap-[20px] items-center font-semibold"> Welcome To Profile Section <FaUser className="text-[20px] lg:text-[35px]" /></p>
                    <div className="flex flex-row justify-between w-full gap-[40px]">
                        <div className="w-full rounded-lg px-[0px] lg:p-[20px] flex flex-col lg:flex-row  justify-between gap-[10px]">
                            <div>
                                <p className="text-[20px] lg:text-[50px] font-medium uppercase">{userName}</p>
                                <p className=" text-[20px] lg:text-[35px] font-medium mt-[20px] flex flex-row items-center gap-[10px]">Email: {email}<SiMinutemailer /></p>
                                <p className="text-[18px] lg:text-[22px] mt-[40px] lg:mr-[30px]">Stock Trading Master is a stock trading platform for entrepneurs, stock
                                    market enthusiasts! <br />
                                    It's a free and easy way to invest your money into the stock
                                    market.</p>
                            </div>
                            <div>
                                <div className="border bg-white p-[30px] w-full rounded-md shadow-md mt-[20px] lg:mt-[0px]">
                                    <p className="w-full p-1 uppercase text-center font-bold text-xl mb-5 rounded-md ">Wallet</p>
                                    <div className="flex flex-row  mt-[20px] mb-[20px]">
                                        <p className="text-[20px]">Balance:</p>
                                        <p className="text-[20px]">$ {balance.toFixed(3)}</p>
                                    </div>
                                    <label>
                                        <p className="text-gray-500 mb-[10px]">
                                            Add Amount<sup className="text-[10px] align-super">*</sup>
                                        </p>
                                        <input
                                            required
                                            type="number"
                                            name="quantity"
                                            onChange={changeHandler}
                                            placeholder="Enter Amount"
                                            value={quantity}
                                            className="bg-gray-200 rounded-md p-[5px] w-full"
                                        />
                                    </label>
                                    <button className="w-full mt-[20px] border border-gray-800 p-[5px] rounded-md px-[10px] bg-[green] text-[white] hover:text-[black] hover:bg-[white]" onClick={addHandler}>Add to Wallet</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full">
                        <StocksList stocks={stocks} />
                    </div>
                    <div>
                        <TradeHistory userData={userTradeData} />
                    </div>
                </div>)}
        </div>
    );
}

export default UserProfile;