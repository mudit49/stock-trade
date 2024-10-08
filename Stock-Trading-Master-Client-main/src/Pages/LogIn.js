import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../CSS/LoginForm.css";
import { useCookies } from "react-cookie";
import axios from "axios";

function LogIn({ setIsLoggedIn }) {
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [cookies, setCookie, removeCookie] = useCookies(['user'])

  function changeHandler(event) {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }

  const submitHandler = async (event) => {
    event.preventDefault();
    console.log(formData);
    try {
      const response = await axios.post(`${backendUrl}/login`, formData);
      //console.log(response);
      if (response.status === 200) {
        setCookie("userId", response.data.data);
        setIsLoggedIn(true);
        toast.success("Welcome Again");
        navigate("/home");
      }
    } catch (error) {
      console.error(error);

      // Check if the error response contains a status property
      if (error.response && error.response.status === 404) {
        toast.error("User Not Found");
      } else if (error.response && error.response.status === 401) {
        toast.error("Invalid Password");
      } else {
        // Handle other errors
        toast.error("An error occurred");

      }
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              Log In
            </h1>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs">
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  name="email" type="email" placeholder="Email" value={formData.email}  onChange={changeHandler} />
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  name="password" type="password" placeholder="Password" value={formData.password}  onChange={changeHandler} />
                <button onClick={submitHandler}
                  className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                  <svg className="w-6 h-6 -ml-2" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <path d="M20 8v6M23 11h-6" />
                  </svg>
                  <span className="ml-3">
                    Log In
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
        <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
    style={{backgroundImage: "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')"}}>
</div>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
