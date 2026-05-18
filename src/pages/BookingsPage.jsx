
import React from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/config";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { Container } from 'reactstrap';
import BookingDates from "../components/Booking/BookingDate";
import '../styles/bookingspage.css';
import CommonSection from "../shared/CommonSection";


const BookingsPage = () => {
    const _id = useParams();
    const { data: userBooking, loading, error } = useFetch(`${BASE_URL}/users/${_id.id}`)
    console.log(userBooking, 'dataUserBooking');
    // const { fullName, guestSize, phone, bookAt, tours } = userBooking;

    return (
        <div>
            <CommonSection title={"Your Booking"} />
            <Container>
                {loading && <h4 className="text-center pt-5">Loading............</h4>}
                {error && <h4 className="text-center pt-5">{error}</h4>}
                {userBooking?.length > 0 && userBooking.map(booking => (
                    <Link to={`/userinfo/booking/${booking._id}`}  className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden mb-2 no-underline bookingsPage__a mt-4" >
                        {
                            booking.tours.map(tour => (
                                <div className="w-64 m-auto h-full">
                                    <img src={tour.photo} alt="tour-img" />
                                </div>
                            ))
                        }
                        <div className="py-3 pr-3 grow" key={booking._id}>
                            <h2 className="text-xl">{booking.tourName}</h2>
                            <div className="text-xl">
                                <BookingDates booking={booking} className="mb-2 mt-2 text-gray-500" />
                            </div>
                        </div>
                    </Link>
                ))}
            </Container>

        </div>
    )
}

export default BookingsPage;