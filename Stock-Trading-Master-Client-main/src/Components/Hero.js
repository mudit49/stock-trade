import bgImg from '../Images/heroImage.svg'
import { useNavigate } from 'react-router-dom';

function Hero() {
    const navigate = useNavigate();


    return (<div className='hero'>
        <div className='w-full'>

        </div>
        <div className='flex flex-col w-full items-end'>
            <div className='flex flex-row items-end  mr-[10px] lg:mr-[50px]'>
                <button className='text-[20px] mr-[10px]' onClick={() => { navigate("/login") }}>
                    Log In
                </button>
                <button className='text-[20px] pl-[10px] border-l border-black' onClick={() => { navigate("/signup") }}>
                    Sign Up
                </button>
            </div>
            <p className='hidden lg:text-[45px] mt-[170px] lg:flex items-end lg:pl-[150px]'>Stocks Market Is Simplefied Now With Stock Trading Master</p>
        </div>
    </div>)
}

export default Hero;