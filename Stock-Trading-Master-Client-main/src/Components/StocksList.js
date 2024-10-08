import { useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import toast from "react-hot-toast";

function StocksList({ stocks }) {

    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const API_KEY = process.env.REACT_APP_API_KEY;
    const [cookies] = useCookies();
    const userId = cookies.userId;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);
    const [sellQuantity, setSellQuantity] = useState("");

    async function sellHandler(quantity, ticker) {
        try {
            const now = new Date();
            const formattedTimestamp = now.toLocaleString('en-GB', { hour12: false }).replace(',', '');
            const dataurl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=5min&apikey=${API_KEY}`;

            const { data } = await axios.get(dataurl);
            const timeSeriesData = data["Time Series (5min)"];
            const timeSeriesKeys = Object.keys(timeSeriesData);
            const firstIndexKey = timeSeriesKeys[0];
            const firstIndexObject = timeSeriesData[firstIndexKey];
            const price = parseFloat(firstIndexObject["4. close"]);

            const response = await axios.put(`${backendUrl}/sell`, {
                userId: userId,
                quantity: quantity,
                ticker: ticker,
                time: formattedTimestamp,
                price:price,
            });
            console.log(response);
            // Close the modal after successful sell
            setIsModalOpen(false);
            setSellQuantity("");
            toast.success("Selled");
        } catch (e) {
            console.log(e.response.data.msg);
            toast.error(e.response.data.msg);
        }
    }

    const openModal = (stock) => {
        setSelectedStock(stock);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedStock(null);
        setSellQuantity(""); // Reset the input field
    };

    return (
        <div className="border bg-white p-[30px] w-full rounded-md shadow-md">
            <header className="w-full border-[5px] p-3 uppercase text-center font-bold text-xl mb-5">
                Stock List
            </header>
            <div className="relative overflow-x-auto shadow-md sm:rounded-md">
                <div className="max-h-[250px] overflow-y-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-400">
                        <thead className="text-xs uppercase text-white">
                            <tr>
                                <th scope="col" className="px-6 py-3 bg-gray-800">
                                    Ticker
                                </th>
                                <th scope="col" className="px-6 py-3 text-black">
                                    Quantity
                                </th>
                                <th scope="col" className="px-6 py-3 bg-gray-800">
                                    Sell Stock
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.map((rowData, rowIndex) => (
                                <tr className="border-b border-gray-700" key={rowIndex}>
                                    <td className="px-6 py-4 bg-gray-800 text-white">{rowData.ticker}</td>
                                    <td className="px-6 py-4 text-[black]">{rowData.quantity}</td>
                                    <td className="px-6 py-4 bg-gray-800 text-white cursor-pointer">
                                        <button
                                            onClick={() => openModal(rowData)}
                                            className="border border-white rounded-md px-[10px] py-[2px]"
                                        >
                                            Sell
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && selectedStock && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="bg-white w-1/2 p-6 rounded shadow-md">
                            <div className="flex justify-end">
                                <button
                                    onClick={closeModal}
                                    className="text-gray-700 hover:text-red-500"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Sell {selectedStock.ticker}</h2>
                            <p>Available Quantity: {selectedStock.quantity}</p>
                            <input
                                type="number"
                                className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500 mb-4"
                                placeholder="Enter quantity to sell"
                                value={sellQuantity}
                                onChange={(e) => setSellQuantity(e.target.value)}
                            />
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => sellHandler(sellQuantity, selectedStock.ticker)}
                            >
                                Confirm Sell
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StocksList;
