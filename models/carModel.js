const createCarDocument = ({
  carName,
  dailyRentPrice,
  carType,
  image,
  seatCapacity,
  pickupLocation,
  description,
  availabilityStatus,
  ownerName,
  ownerEmail,
}) => {
  return {
    carName: carName.trim(),
    dailyRentPrice: Number(dailyRentPrice),
    carType,
    image: image.trim(),
    seatCapacity: Number(seatCapacity),
    pickupLocation: pickupLocation.trim(),
    description: description.trim(),
    availabilityStatus,

    // Owner information
    ownerName,
    ownerEmail,

    // Booking information
    bookingCount: 0,

    // Created time
    createdAt: new Date(),
  };
};

export default createCarDocument;