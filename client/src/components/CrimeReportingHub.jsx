import React, { useState } from "react";
import logo from "../imgs/loho1.jpg";
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import emailjs from "emailjs-com";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const CrimeReportingHub = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    crimeType: "",
    date: "",
    description: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const slides = [
    "https://wallpaperaccess.com/full/2015325.jpg",
    "https://www.thebluediamondgallery.com/wooden-tile/images/crime.jpg",
    "https://images.freeimages.com/images/large-previews/22e/crime-scene-1452689.jpg",
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    // Create template parameters object that matches your email template exactly
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      location: formData.location,
      crime_type: formData.crimeType,
      date: formData.date,
      description: formData.description
    };

    // Add debugging log
    console.log('Sending email with params:', templateParams);

    const response = await emailjs.send(
      "service_zp4snho",
      "template_6vqktlp",
      templateParams,
      "vMyMpzPERljGlEY8p"
    );

    console.log("SUCCESS!", response.status, response.text);
    toast.success("Crime reported successfully!");
    setSuccessMessage("Crime reported successfully!");

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      location: "",
      crimeType: "",
      date: "",
      description: "",
    });
  } catch (error) {
    console.error("FAILED...", error);
    toast.error(error.message || "Failed to send report. Please try again.");
    setSuccessMessage("");
  }

  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-gray-900 shadow-md text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src={logo} alt="CRH-logo" className="h-20 w-20" />
              <h1 className="text-3xl font-bold ml-4 text-white">
                Crime Reporting Hub
              </h1>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Navigation */}
            <nav className={`${isMenuOpen ? "block" : "hidden"} md:block`}>
              <ul className="md:flex space-y-2 md:space-y-0 md:space-x-6">
                <li>
                  <a href="#" className="text-white hover:text-slate-500">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#report" className="text-white hover:text-slate-500">
                    Report a Crime
                  </a>
                </li>
                <li>
                  <a
                    href="#emergency"
                    className="text-white hover:text-slate-500"
                  >
                    Emergency Numbers
                  </a>
                </li>
                <li>
                  <a
                    href="#emergency"
                    className="text-white hover:text-slate-500"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <Link
                    to="/signin"
                    className="text-white bg-blue-600 px-4 py-2 rounded-md"
                  >
                    logOut
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Carousel */}
      <div className="relative h-96 overflow-hidden">
        <div
          className="absolute w-full h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="absolute w-full h-full"
              style={{ left: `${index * 100}%` }}
            >
              <img
                src={slide}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full"
        >
          <ChevronLeft className="text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full"
        >
          <ChevronRight className="text-white" />
        </button>
      </div>

      {/* Report Crime Section */}
      <section id="report" className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Crime Reporting Form
          </h2>
          <form className="max-w-2xl mx-auto space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                name="name"
                type="text"
                placeholder="Your Name"
                className="w-full p-3 rounded bg-gray-800 border border-gray-700"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Your Email"
                className="w-full p-3 rounded bg-gray-800 border border-gray-700"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                className="w-full p-3 rounded bg-gray-800 border border-gray-700"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <input
                name="location"
                type="text"
                placeholder="Location"
                className="w-full p-3 rounded bg-gray-800 border border-gray-700"
                value={formData.location}
                onChange={handleChange}
                required
              />
              <select
                name="crimeType"
                className="w-full p-3 rounded bg-gray-800 border border-gray-700"
                value={formData.crimeType}
                onChange={handleChange}
                required
              >
                <option value="">Select Crime Type</option>
                <option value="murder">Murder</option>
                <option value="rape">Rape</option>
                <option value="suicide">Suicide</option>
                <option value="fraud">Fraud</option>
                <option value="other">Other</option>
              </select>
              <input
                name="date"
                type="date"
                className="w-full p-3 rounded bg-gray-800 border border-gray-700"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <textarea
              name="description"
              placeholder="Description"
              rows="4"
              className="w-full p-3 rounded bg-gray-800 border border-gray-700"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
            <button
              type="submit"
              className="w-full py-3 rounded bg-blue-600 hover:bg-blue-700 transition"
            >
              Submit Report
            </button>
          </form>

          {successMessage && (
            <p className="mt-4 text-green-400 text-center">{successMessage}</p>
          )}
        </div>
      </section>

      {/* Emergency Numbers Section */}
      <section id="emergency" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Emergency Numbers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-indigo-500 text-white p-6 rounded-lg text-center">
              <Phone size={32} className="mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Police</h3>
              <p className="text-2xl">100</p>
            </div>
            <div className="bg-orange-600 text-white p-6 rounded-lg text-center">
              <Phone size={32} className="mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Fire Engine</h3>
              <p className="text-2xl">101</p>
            </div>
            <div className="bg-green-600 text-white p-6 rounded-lg text-center">
              <Phone size={32} className="mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Ambulance</h3>
              <p className="text-2xl">108</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Phone className="mr-2" />
              <span>+1 234 567 890</span>
            </div>
            <div className="flex items-center mb-4 md:mb-0">
              <Mail className="mr-2" />
              <span>support@crimereportinghub.com</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2" />
              <span>123 Crime St, Criminal City</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CrimeReportingHub;
