import { useContext, useState } from "react";
import { AppContext } from "../Context/AppContext";

function SearchSection() {

    const [searchBox,setSearchBox] = useState({searchBox:""})
    const {setSelectedStock} = useContext(AppContext);

    function changeHandler(event) {
        setSearchBox((prevData) => ({
            ...prevData,
            [event.target.name]: event.target.value,
        }));
    }

    const SubmitHandler = async(event) => {
        event.preventDefault();
        setSelectedStock(searchBox.searchBox);
    }

    return (
        <div className="w-[90%] mx-[40px]">
            <form className="w-full mx-auto " onSubmit={SubmitHandler}>
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-black dark:text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input type="search" name="searchBox" onChange={changeHandler} value={searchBox.searchBox} id="default-search" className="block w-full p-4 ps-10 text-sm text-black border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Stocks" required />
                    <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-white hover:bg-white focus:ring-4 focus:outline-none focus:ring-white font-medium rounded-lg text-sm px-4 py-2 dark:bg-black dark:hover:bg-black dark:focus:ring-white">Search</button>
                </div>
            </form>
        </div>
    );
}

export default SearchSection;