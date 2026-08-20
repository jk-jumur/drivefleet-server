const createBookingDocument = ({
  carId,
  userName,
  userEmail,
  carName,
  image,
  dailyRentPrice,
  driverNeeded,
  specialNote,
}) => {
  return {
    carId,
    userName,
    userEmail: userEmail.trim().toLowerCase(),

    carName,
    image,
    dailyRentPrice: Number(dailyRentPrice),

    driverNeeded,
    specialNote: specialNote?.trim() || "",

    bookingStatus: "Pending",

    bookingDate: new Date(),
  };
};

export default createBookingDocument;