import React from "react";
import "./testimonials.css";
import Slider from "react-slick";
import ava01 from "../../assets/images/ava-1.jpg";
import ava02 from "../../assets/images/ava-2.jpg";
import ava03 from "../../assets/images/ava-3.jpg";

const testimonialsData = [
  {
    text: "Booking was smooth from start to finish. The tour guide was knowledgeable and every stop exceeded our expectations. Highly recommend!",
    img: ava01,
    name: "John Doe",
  },
  {
    text: "Amazing experience! Beautiful scenery, well-organized itinerary, and friendly staff. This is now my go-to site whenever I plan a vacation.",
    img: ava02,
    name: "Lia Franklin",
  },
  {
    text: "Great value for money. The booking process was quick, prices were transparent, and the tour matched exactly what was described online.",
    img: ava03,
    name: "John Doe",
  },
  {
    text: "Traveled with family and everyone loved it. Safe, comfortable, and full of memorable moments. We will definitely book again next season!",
    img: ava02,
    name: "Lia Franklin",
  },
];

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    swipeToSlide: true,
    autoplaySpeed: 2000,
    slidesToShow: 3,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slideToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slideToScroll: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {testimonialsData.map((item, index) => (
        <div className="testimonial py-4 px-3" key={index}>
          <p>{item.text}</p>
          <div className="d-flex align-items-center gap-4 mt-3">
            <img
              src={item.img}
              className="w-25 h-25 rounded-2"
              alt={item.name}
            />
            <div>
              <h6 className="mb-0 mt-3">{item.name}</h6>
              <p>Customer</p>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default Testimonials;
