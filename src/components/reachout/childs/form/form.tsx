import { useState, useRef } from "react";
// import styles from "./form.module.css";
import ReCAPTCHA from "react-google-recaptcha";

const ReachOutForm = () => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isChecked, setIsChecked] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    privacy: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
    setErrors({ ...errors, privacy: "" }); // Clear error when checkbox is checked
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newErrors = { name: "", email: "", subject: "", message: "", privacy: "" };

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email address";
    if (!formData.subject) newErrors.subject = "Subject is required";
    if (!formData.message) newErrors.message = "Message cannot be empty";
    if (!isChecked) newErrors.privacy = "You must accept the Privacy Policy";

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      console.log("Form submitted:", formData);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsChecked(false);
      setErrors({ name: "", email: "", subject: "", message: "", privacy: "" });
    }
  };

  const onReCAPTCHAChange = (token: string | null) => {
    console.log("ReCAPTCHA token:", token);
    recaptchaRef.current?.reset();
  };


  return (
    <div className="relative mx-auto p-6 w-full" style={{ fontFamily: "Calibri, Arial, sans-serif", fontWeight: 400 }}>
      {/* Form Container */}
      <div className="relative p-2">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-1 md:p-8 shadow-lg bg-transparent rounded-lg"
        >
          {/* Name Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full sm:p-3 md:p-1 rounded-md border focus:outline-none text-white tracking-wide bg-transparent 
                focus:bg-[#A9A9A9]/50 
                text-sm sm:text-base md:text-lg 
                ${errors.name ? "border-red-500" : "border-[#ADFF00]"}`}
            />
            {errors.name && (
              <div className="text-red-500 text-xs">{errors.name}</div>
            )}
          </div>

          {/* Email Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full sm:p-3 md:p-1 rounded-md border focus:outline-none text-white tracking-wide bg-transparent focus:bg-[#A9A9A9]/50 ${errors.email ? "border-red-500" : "border-[#ADFF00]"
                }`}
            />
            {errors.email && (
              <div className="text-red-500 text-xs">{errors.email}</div>
            )}
          </div>

          {/* Subject Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full sm:p-3 md:p-1 rounded-md border focus:outline-none text-white bg-transparent focus:bg-[#A9A9A9]/50 ${errors.subject ? "border-red-500" : "border-[#ADFF00]"
                }`}
            />
            {errors.subject && (
              <div className="text-red-500 text-xs">{errors.subject}</div>
            )}
          </div>

          {/* Message Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className={`w-full sm:p-3 md:p-1 rounded-md border focus:outline-none text-white bg-transparent tracking-wide focus:bg-[#A9A9A9]/50 ${errors.message ? "border-red-500" : "border-[#ADFF00]"
                }`}
            />
            {errors.message && (
              <div className=" text-red-500 text-xs">{errors.message}</div>
            )}
          </div>

          {/* Privacy Policy Checkbox */}
          <div className="relative">
            <label className="flex items-center gap-2 text-gray-400">
              <input
                type="checkbox"
                name="privacy"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="rounded border-gray-700 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-xs">
                I have read and accept the <span className="underline">Privacy Policy</span>.
              </span>
            </label>
            {errors.privacy && (
              <div className="text-red-500 text-xs">{errors.privacy}</div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="relative px-6 py-1
            text-lg font-bold text-black 
            bg-[#ADFF00] rounded-md hover:bg-black hover:text-white transition-all duration-300 overflow-hidden"
          >
            Reach Out
            <div className="absolute inset-0 border-2 border-[#ADFF00] animate-border pointer-events-none"></div>
          </button>
        </form>
      </div>

      <div className="fixed bottom-16 lg:bottom-20 max-sm:bottom-15 right-0.5 -translate-x-1/2 z-[999999]">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey="6LdWstkqAAAAAKexIR0vyC4KcXzhjhTYpdqohU7w"
          size="invisible"
          onChange={onReCAPTCHAChange}
        />
      </div>
    </div >
  );
};

export default ReachOutForm;
