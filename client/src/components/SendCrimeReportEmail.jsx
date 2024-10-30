// email.js
import emailjs from "emailjs-com";

// Function to send email for crime report
export const sendCrimeReportEmail = (reportDetails) => {
  // Destructure report details
  const { name, email, description, location } = reportDetails;

  const templateParams = {
    from_name: name,
    from_email: email,
    message: description,
    location: location, 
  };

  return emailjs.send(
    process.env.EMAILJS_SERVICE_ID, // Your EmailJS service ID
    process.env.EMAILJS_TEMPLATE_ID, // Your EmailJS template ID
    templateParams,
    process.env.EMAILJS_USER_ID // Your EmailJS user ID
  );
};

// Example usage
// const reportDetails = {
//   name: "John Doe",
//   email: "john@example.com",
//   description: "I saw suspicious activity near the park.",
//   location: "Central Park, NY",
// };
// sendCrimeReportEmail(reportDetails)
//   .then((response) => console.log("Email sent successfully!", response))
//   .catch((error) => console.error("Failed to send email:", error));
