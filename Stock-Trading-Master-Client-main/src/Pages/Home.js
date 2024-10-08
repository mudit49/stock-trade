import "../CSS/Home.css";
import SearchSection from "../Components/SearchSection";
import DetailedCard from "../Components/DetailedCard";
import { useNavigate } from "react-router-dom";


function Home({ isLoggedIn}) {

  const navigate = useNavigate();
  console.log(isLoggedIn);
  if(!isLoggedIn) {
    navigate("/")
  }
  return (
    <div className="home">
      <div className="my-20px w-full">
          <div className="flex w-full">
            <SearchSection/>
          </div>
          <div>
            <DetailedCard isLoggedIn={isLoggedIn} />
          </div>
      </div>
    </div>
  );
}

export default Home;
