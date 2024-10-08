import { useEffect, useState } from "react";

function TradeHistory({ userData }) {
    const [totalIncome, setTotalIncome] = useState([]);

    useEffect(() => {
        let incomearr = [];
        userData.forEach(rowData => {
            var income = rowData[2] * rowData[3];
            income = income.toFixed(3);
            incomearr.push(income);
        });
        setTotalIncome(incomearr);
    }, [userData]);

    return (
        <div className=" border bg-white p-[30px] w-full rounded-xl shadow-xl ">
            <header className="w-full border-[5px] p-3 uppercase text-center font-bold text-xl mb-5">Trade History</header>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
                <div className="max-h-[250px] overflow-y-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-400">
                        <thead className="text-xs  uppercase  text-white">
                            <tr>
                                <th scope="col" className="px-6 py-3 bg-gray-800">
                                    Ticker
                                </th>
                                <th scope="col" className="px-6 py-3 text-black">
                                    Actions
                                </th>
                                <th scope="col" className="px-6 py-3 bg-gray-800">
                                    Price
                                </th>
                                <th scope="col" className="px-6 py-3 text-black">
                                    Quantity
                                </th>
                                <th scope="col" className="px-6 py-3 bg-gray-800">
                                    Time
                                </th>
                                <th scope="col" className="px-6 py-3  text-black">
                                    Total Expanse
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {userData.map((rowData, rowIndex) => (
                                <tr className="border-b border-gray-700" key={rowIndex}>
                                    {rowData.map((colData, colIndex) => (
                                        <td key={colIndex} className={`px-6 py-4 ${colIndex % 2 === 0 ? ' bg-gray-800 text-white' : ' text-black'}`}>
                                            {colData}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 text-black">
                                        {totalIncome[rowIndex]}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default TradeHistory;
