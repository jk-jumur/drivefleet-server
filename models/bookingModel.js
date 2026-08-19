const createBookingDocument = ({
  carId,
  userEmail,
  carName,
  image,
  totalPrice,
  driverNeeded,
  specialNote,
}) => {
  return {
    carId: carId.trim(),
    userEmail: userEmail.trim().toLowerCase(),
    carName: carName.trim(),
    image: image.trim(),
    totalPrice: Number(totalPrice),
    driverNeeded,
    specialNote: specialNote ? specialNote.trim() : "",
    
    // Booking time
    bookingDate: new Date(),
  };
};

export default createBookingDocument;