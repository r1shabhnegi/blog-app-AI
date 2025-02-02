import { useAppDispatch } from "@/redux/hook";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { countFollowing, followerCount } from "@/api";
import { getUser } from "@/api/userApi";
import { useEffect } from "react";
import { setCurrentProfile } from "@/redux/profileSlice";
import Spinner from "@/components/Spinner";
import ProfileDropDown from "@/components/User/ProfileDropDown";

const ProfileLayout = () => {
  const { userId } = useParams();
  const { pathname } = useLocation();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data: followerCountData } = useQuery({
    queryKey: ["followerCount", userId],
    queryFn: () => followerCount(userId),
  });

  const { data: followingCountData } = useQuery({
    queryKey: ["followingCount", userId],
    queryFn: () => countFollowing(userId),
  });

  const { data: userData, isPending } = useQuery({
    queryKey: ["getUser", userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  });

  useEffect(() => {
    if (userData) {
      dispatch(setCurrentProfile(userData));
    }
  }, [userData]);

  const adminName = userData?.name
    ? userData.name.charAt(0).toUpperCase() + userData.name.slice(1)
    : "";

  const handleEditBtn = () => {
    navigate(`/settings/${userId}`, {
      state: {
        isOpenEditCard: true,
      },
    });
  };

  if (isPending) return <Spinner className='m-56' />;

  return (
    <div>
      <div className='flex flex-col justify-between h-32 mt-16 mb-10'>
        <div className='flex items-center justify-between px-5 mb-5 lg:px-0'>
          <div className='flex flex-col w-full'>
            <div className='flex items-center justify-between w-full'>
              <h1 className='text-xl font-semibold tracking-tight text-gray-800 sm:text-2xl md:text-3xl lg:text-4xl '>
                {adminName}
              </h1>
              <ProfileDropDown prop='lg:hidden' />
            </div>
            <span className='flex gap-4 mb-1 ml-1 lg:hidden'>
              <p
                className='my-2 text-xs font-medium text-gray-500 cursor-pointer sm:text-sm text- hover:underline'
                onClick={() => navigate(`/followers/${userId}`)}>
                {followerCountData?.followerCount} Followers
              </p>
              <p
                className='my-2 text-xs font-medium text-gray-500 cursor-pointer sm:text-sm text- hover:underline'
                onClick={() => navigate(`/followings/${userId}`)}>
                {followingCountData?.data?.followingCount} Followings
              </p>
            </span>
            <span
              className='ml-1 text-xs font-medium text-green-600 cursor-pointer lg:hidden '
              onClick={handleEditBtn}>
              Edit profile
            </span>
            <span className='m-1 mt-5 text-xs lg:hidden'>{userData?.bio}</span>
          </div>
          <ProfileDropDown prop='hidden lg:block' />
        </div>

        <div className='flex gap-7 border-b-[0.01rem] border-gray-200  justify-between lg:justify-start '>
          <span
            className={`text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px]  pb-2 md:pb-3  flex-1 lg:flex-none text-center text-gray-600 cursor-pointer ${
              pathname.startsWith("/profile") &&
              !pathname.includes("list") &&
              !pathname.includes("about")
                ? "border-b-[0.01rem] border-gray-600 font-medium"
                : ""
            }`}
            onClick={() => navigate(`/profile/${userId}`)}>
            Home
          </span>
          <span
            className={`text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px]  pb-2 md:pb-3  flex-1 lg:flex-none text-center  cursor-pointer  text-gray-600 ${
              pathname.startsWith("/profile/lists")
                ? "border-b-[0.01rem] border-gray-600 font-medium"
                : ""
            }`}
            onClick={() => navigate(`/profile/lists/${userId}`)}>
            Saved
          </span>
          <span
            className={`text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px]  pb-2 md:pb-3  flex-1 text-center lg:flex-none  cursor-pointer  text-gray-600 ${
              pathname.startsWith("/profile/about")
                ? "border-b-[0.01rem] border-gray-600 font-medium"
                : ""
            }`}
            onClick={() => navigate(`/profile/about/${userId}`)}>
            About
          </span>
        </div>
      </div>
      <div className='mt-20 lg:mt-0'>
        <Outlet />
      </div>
    </div>
  );
};
export default ProfileLayout;
