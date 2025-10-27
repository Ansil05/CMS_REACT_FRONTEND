
// A simple email validation function
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// A mock function to simulate sending a bill receipt
export const sendBillReceipt = async (billData) => {
  console.log("Sending email with the following data:", billData);

  // Simulate an API call
  await new Promise(resolve => setTimeout(resolve, 2000));

  // In a real application, you would make an API call to your backend to send the email.
  // For now, we'll just return a success message.
  
  if (billData.patientEmail) {
    return {
      success: true,
      message: `Bill receipt sent to ${billData.patientEmail} successfully!`
    };
  } else {
    return {
      success: false,
      message: "Failed to send email. Patient email not provided."
    };
  }
};
