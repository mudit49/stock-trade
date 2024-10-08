import Hero from '../Components/Hero';
import Layers from "@material-ui/icons/Layers";
import Phonelink from "@material-ui/icons/Phonelink";
import Comment from "@material-ui/icons/Comment"
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
function LandingPage({isLoggedIn}) {

    const navigate = useNavigate();
    useEffect(() => {
        if (isLoggedIn) {
            navigate("/home");
        }
    }, [isLoggedIn, navigate]);
    console.log(isLoggedIn);
    return (
        <div>
            <div>
                <Hero />
            </div>
            <div className='bg-gray-500 h-[800px] lg:h-[400px] w-full mt-[0] lg:mt-[100px] flex flex-col items-center justify-center text-center'>
                <p className='text-[50px] font-bold text-[white]'>Our Perks</p>
                <div className='flex flex-col lg:flex-row gap-[50px] lg:gap-[80px] mt-[40px]'>
                    <div className='flex flex-col items-center justify-center text-center'>
                        <Layers style={{ fontSize: 48, color: 'white' }} />
                        An hand-crafted<br />application just<br />for you.
                    </div>
                    <div className='flex flex-col items-center justify-center text-center'>
                        <Phonelink style={{ fontSize: 48, color: 'white' }} />
                        Available on both PC and<br />mobile by 2020.
                    </div>
                    <div className='flex flex-col items-center justify-center text-center'>
                        <Comment style={{ fontSize: 48, color: 'white' }} />
                        24/7 support.<br />We will always be here for<br />you.
                    </div>
                </div>
            </div>
            <div className='bg-gray-50 h-[400px] flex flex-col items-center justify-center text-center'>
                <p className='text-[60px] font-semibold text-[red]'>Attention</p>
                <p className='text-[20px] px-[10px] lg:px-[100px] mt-[30px]'>This is a paper-trading stock trading web site.
                    This means no money is taken or given on the website.
                    This project was merely for fun and is constantly being worked on.
                    Thanks for visting!</p>
            </div>
        </div>
    );
}

export default LandingPage;