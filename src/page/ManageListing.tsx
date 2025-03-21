import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/Store.ts";
import {useEffect, useState} from "react";
import {getHostelsByUser} from "../reducers/HostelSlice.ts";
import SignIn from "../component/SignIn.tsx";
import ListingCardContainer from "../component/ListingCardContainer.tsx";

function ManageListing() {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.user.user?._id as string);
    const isLoading = useSelector((state: RootState) => state.hostel.isLoading);
    const { hostels } = useSelector((state: RootState) => state.hostel);
    const [isSignInOpen, setIsSignInOpen] = useState(false);

    useEffect(() => {
        if (user) {
            dispatch(getHostelsByUser(user));
        } else {
            setIsSignInOpen(true);
        }
    }, [dispatch, user]);



    return (
        <div className={'mt-[10vh] px-[4vw]'}>
            <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6 z-50">
                Manage Your Listings with Ease!
            </h2>
            <ListingCardContainer hostels={hostels} isLoading={isLoading} />
            <SignIn isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
        </div>
    );

}

export default ManageListing;
