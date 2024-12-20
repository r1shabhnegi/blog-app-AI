import { Newspaper, X } from "lucide-react";
import { useState } from "react";
import SignupCard from "../components/SignupCard";
import SigninCard from "../components/SigninCard";
import leftImg from "../assets/1P-ty-kpF sds.avif";
import rightImg1 from "../assets/DsFKTQbae.avif";
import rightImg2 from "../assets/SmU1TDZ0l.avif";
import { Button } from "@/components/ui/button";
const Landing = () => {
  const [onSignup, setOnSignup] = useState<boolean>(false);
  const [onSignin, setOnSignin] = useState<boolean>(false);

  const handleGetStartedBtn = () => {
    setOnSignup(!onSignup);
  };
  const handleSigninBtn = () => {
    setOnSignin(!onSignin);
  };

  const closeCardsModal = () => {
    setOnSignup(false);
    setOnSignin(false);
  };

  const handleSignInBtn = () => {
    setOnSignin(true);
    setOnSignup(false);
  };
  const handleSignupBtn = () => {
    setOnSignup(true);
    setOnSignin(false);
  };
  return (
    <main className='min-h-screen flex flex-col bg-[#ffffff]'>
      <div className='border-b[0.01rem] border-black px-6 sm:px-16 md:px-28 lg:px-48 shadow-2xl shadow-gray-200/35 drop-shadow-md'>
        <header className='flex items-center justify-between h-20'>
          <span className='flex items-end justify-center gap-2'>
            <Newspaper className='text-green-600 size-6 md:size-8' />
            <h1 className='-mb-0.5 text-lg md:text-2xl font-bold tracking-tighter text-gray-700 font-logo'>
              Readpool.AI
            </h1>
          </span>

          <nav className='flex gap-4'>
            <button
              className='font-semibold hover:text-green-700  text-[12px] md:px-3 md:text-[14px]'
              onClick={handleSigninBtn}>
              Sign in
            </button>
            <button
              className='px-2 md:px-5 py-1.5 md:py-2 text-[12px] md:text-[14px] font-semibold text-white bg-gray-900 hover:bg-green-600  rounded-full'
              onClick={handleGetStartedBtn}>
              Get started
            </button>
          </nav>
        </header>
      </div>
      <div className='flex flex-col items-center justify-center flex-1 gap-10 my-28'>
        <div className='flex flex-col text-center sm:flex-row'>
          <h1 className='text-5xl leading-normal tracking-tight text-center text-gray-900 lg:text-6xl font-logo'>
            Effortless
          </h1>
          <h1 className='text-5xl leading-normal tracking-tight text-center text-gray-900 lg:text-6xl font-logo'>
            Publishing
          </h1>
          .
        </div>
        <span className='flex flex-col items-center justify-center text-2xl md:text-3xl lg:text-4xl'>
          <h2 className='leading-relaxed text-gray-600 font-inter'>
            AI-assisted blogging for
          </h2>
          <h2 className='leading-relaxed text-gray-600 font-inter'>
            everyone.
          </h2>
        </span>
        <button
          className='px-5 md:px-8 lg:px-10 py-2 md:py-3 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] font-semibold text-white bg-gray-900 rounded-full hover:bg-green-600  drop-shadow-lg'
          onClick={handleGetStartedBtn}>
          Get started
        </button>
      </div>
      <div
        className='flex flex-col flex-wrap justify-between gap-6 mx-6 sm:mx-20 md:mx-36 lg:mx-44 lg:flex-row'
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}>
        <div className=' flex-1 border-[0.1rem] border-[#e4efff] flex items-end px-2 pt-20 pb-0 bg-[#F0F6FF] rounded-2xl'>
          <img
            src={leftImg}
            alt='Img'
          />
        </div>
        <div className='flex flex-col flex-1 gap-6'>
          <div className='h-full border-[0.1rem] flex border-[#ffeede] items-end pb-0 bg-[#FFF7EE] rounded-2xl'>
            <img
              src={rightImg1}
              alt='Img'
            />
          </div>
          <div className='border-[0.1rem] h-full flex border-[#e9e6ff] items-end pb-0 bg-[#EEECFE] rounded-2xl'>
            <img
              src={rightImg2}
              alt='Img'
            />
          </div>
        </div>
      </div>

      {onSignup || onSignin ? (
        <div
          className='fixed top-0 left-0 right-0 z-10 flex items-center justify-center min-h-screen overflow-hidden overflow-y-auto bg-white scroll-smooth drop-shadow-xl translate-sty md:bg-opacity-60'
          onClick={closeCardsModal}>
          <div
            className='relative flex flex-col items-center justify-center px-32 bg-white rounded-lg md:shadow-xl py-28 gap-14'
            onClick={(e) => {
              e.stopPropagation();
            }}>
            <X
              className='absolute hidden text-gray-400 cursor-pointer md:block top-4 right-4'
              onClick={closeCardsModal}
            />
            <h1 className='text-2xl tracking-tight font-logo'>
              {onSignin && !onSignup ? "Welcome back." : "Join readpool.ai"}
            </h1>
            {onSignup ? <SignupCard /> : null}
            {onSignin ? <SigninCard /> : null}
            <Button
              className='w-full -mt-10 bg-red-400 md:hidden'
              onClick={closeCardsModal}>
              Cancel
            </Button>
            {onSignin && !onSignup ? (
              <p className='font-semibold'>
                No account?
                <span
                  className='ml-1 font-bold text-green-600 cursor-pointer'
                  onClick={handleSignupBtn}>
                  Create one
                </span>
              </p>
            ) : null}
            {onSignup && !onSignin ? (
              <p className='font-semibold'>
                Already have an account?
                <span
                  className='ml-1 font-bold text-green-600 cursor-pointer'
                  onClick={handleSignInBtn}>
                  Sign in
                </span>
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </main>
  );
};
export default Landing;
