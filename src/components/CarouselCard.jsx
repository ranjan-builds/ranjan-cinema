"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Card from "./Card";
import { Spinner } from "./ui/spinner";

const CarouselCard = ({ movies }) => {
  if (!movies || !movies.length) {
    return <Spinner/>
  }

  return (
    <div className="p-4">
      <Swiper
        pagination={{ clickable: true }}
        spaceBetween={5}
        slidesPerView={3}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 6 },
        }}
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <Card movie={movie} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CarouselCard;