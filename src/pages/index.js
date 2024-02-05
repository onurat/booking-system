import Bookings from "./Bookings-page/Bookings";
import Homepage from "./Homepage";


export const routes = [
    {
        path: "/Bookings",
        element: <Bookings/>
    },
    {
        path: "/",
        element: <Homepage />,
    }
]
