import { useState } from "react";
import api from "../services/api";

const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  // 🧩 1. Validate fields locally
  const validateField = (name, value, allValues) => {
    let error = "";

    switch (name) {
      case "FirstName":
        if (!value) error = "First name is required.";
        else if (!/^[A-Za-z]+$/.test(value))
          error = "First name should contain only letters.";
        else if (value.length < 3) {
          error = "First name should be at least 3 characters long.";
        }
        break;

      case "LastName":
        if (value && !/^[A-Za-z]+$/.test(value))
          error = "Last name should contain only letters.";
        break;

      case "DOB":
        if (!value) error = "Date of birth is required.";
        else {
          const dob = new Date(value);
          const age =
            new Date().getFullYear() -
            dob.getFullYear() -
            (new Date().getMonth() < dob.getMonth() ||
            (new Date().getMonth() === dob.getMonth() &&
              new Date().getDate() < dob.getDate())
              ? 1
              : 0);

          // Different min age based on role
          const role = allValues.role || allValues.Role;
          const minAge = role === "doctor" ? 25 : 18;

          if (age < minAge)
            error = `Staff must be at least ${minAge} years old.`;
        }
        break;

      case "PhoneNumber":
        if (!/^\d{10}$/.test(value))
          error = "Phone number must contain exactly 10 digits.";
        break;

      case "Email":
      case "email":
        if (!value) error = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Invalid email format.";

        break;

      case "Address":
        if (!value) error = "Address is required.";
        break;

      case "password":
        if (!value) error = "Password is required.";
        else if (value.length < 8) error = "Password must be at least 8 characters long.";
        break;

      case "password2":
        if (value !== allValues.password)
          error = "Passwords do not match.";
        break;

      case "ConsultationFee":
        if (Number(value) < 0)
          error = "Consultation fee cannot be negative.";
        break;

      case "YearsOfExperience":
        if (Number(value) < 0)
          error = "Years of experience cannot be negative.";
        break;

      case "Specialization":
        if (
          (allValues.role === "doctor" || allValues.Role === "doctor") &&
          !value
        )
          error = "Specialization is required for doctors.";
        break;

      case "Role":
      case "role":
        if (!value) error = "Role is required.";
        break;

      case "username":
        if (!value) error = "Username is required.";
        break;

      default:
        break;
    }

    // 🧩 Update global errors state
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return error;
  }

  // 🧩 2. Check username availability from backend
  const checkUsernameExists = async (username) => {
    try {
      const res = await api.post("auth/check-username/", { username });
      // Suppose backend returns { exists: true }
      if (res.data.exists) {
        setErrors((prev) => ({
          ...prev,
          username: "Username already exists.",
        }));
        return true;
      } else {
        setErrors((prev) => {
          const newErr = { ...prev };
          delete newErr.username;
          return newErr;
        });
        return false;
      }
    } catch (error) {
      console.error("Error checking username:", error);
      return false;
    }
  };

  const checkEmailExists = async (email) => {
    try {
      const res = await api.post("auth/check-email/", { email });
      // Suppose backend returns { exists: true }
      if (res.data.exists) {
        setErrors((prev) => ({
          ...prev,
          email: "Email already exists.",
        }));
        return true;
      } else {
        setErrors((prev) => {
          const newErr = { ...prev };
          delete newErr.email;
          return newErr;
        });
        return false;
      }
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  // 🧩 3. Validate all fields (before submit)
  const validateAll = (values) => {
    const newErrors = {};
    for (const [name, value] of Object.entries(values)) {
      const error = validateField(name, value, values);
      if (error) newErrors[name] = error;
    }
    setErrors(newErrors);
    return newErrors;
  };

  return { errors, validateField, validateAll, checkUsernameExists, setErrors, checkEmailExists };
};

export default useFormValidation;
