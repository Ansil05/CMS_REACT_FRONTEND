import React, { useEffect, useState } from "react";
import api from "../../services/api";
import StaffTable from "./StaffTable";
import { Button, Alert, Spinner,Toast } from "react-bootstrap";
import { addCredentials, addStaff, deleteStaff, fetchStaffs, updateStaff,addDoctorDetails, getDoctors} from "../../services/adminService";
import StaffFormModal from "./StaffFormModal";
import { FaPlus } from "react-icons/fa";
import { deleteUserByEmail } from "../../services/authService";
import DoctorTable from "./DoctorTable";

const StaffContainer = () => {
  const [staffSuccess, setStaffSuccess] = useState("");
  const [credentialsSuccess, setCredentialsSuccess] = useState("");
  const [doctorSuccess, setDoctorSuccess] = useState("");
   const [doctors, setDoctors] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [backerrs,setBackErrs] = useState({})
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("add");
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    DOB:"",
    Email: "",
    PhoneNumber: "",
    Gender: "",
    Role: "",
  });
  const [doctorData, setDoctorData] = useState({
    Specialization: "",
    ConsultationFee: 1,
    Availability: "",
    YearsOfExperience: "",
  });
  const [credentialsData, setCredentialsData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    role: ""
  });


  useEffect(() => {
    const loadStaffs = async () => {
      try {
        const data = await fetchStaffs();
        setStaffs(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

     const fetchDoctors = async () => {
      setLoading(true);
      try {
        const res = await getDoctors();
        if (!res.status === 200) throw new Error('Failed to fetch doctors');
        setDoctors(res);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();

    loadStaffs();
  }, []);

  
  const handleAdd = () => {
    setMode("add");
    setFormData({ FirstName: "", LastName: "", Email: "", PhoneNumber: "", Gender: "" });
    setDoctorData({ Specialization: "", ConsultationFee: 1, Availability: "", YearsOfExperience: "" });
    setCredentialsData({ username: "", email: "", password: "", password2: "", role: "" }); 
    setShowModal(true);
  };

  const handleEdit = (staff) => {
    setMode("edit");
    setFormData(staff);
    setShowModal(true);
  };

  const handleDelete = async (id, email) => {
    if (!window.confirm("Are you sure you want to delete this staff?")) return;
    try {
      console.log("Deleting user with email:", email);
      await deleteUserByEmail(email);
      await deleteStaff(id);
      setStaffs(staffs.filter((s) => s.StaffId !== id));
      setDoctors(doctors.filter((d) => d.StaffDetail.StaffId !== id));
    } catch {
      setError("Failed to delete staff");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDoctorChange = (e) => {
    setDoctorData({ ...doctorData, [e.target.name]: e.target.value });
  };
  const handleCredentialsChange = (e) => {
    setCredentialsData({ ...credentialsData, [e.target.name.toLowerCase()]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "add") {
        const userRes = await addCredentials(credentialsData);
        setCredentialsSuccess("credential added successfully!");
        setTimeout(() => {
          setCredentialsSuccess("");
        }, 3000);
        const newStaff = await addStaff(formData);
        setStaffSuccess("Staff added successfully!");
        setTimeout(() => {
          setStaffSuccess("");
        }, 3000);
        const payload = {
          Staff: newStaff.StaffId,
          Specialization: doctorData.Specialization, 
          ConsultationFee: Number(doctorData.ConsultationFee),
          YearsOfExperience: Number(doctorData.YearsOfExperience)
        };
        if (credentialsData.role === "doctor") {
          console.log("Adding doctor details");
          console.log("doctorData:", { payload });
          console.log("newStaff:", newStaff);
          const doctorDetails = await addDoctorDetails(payload);
          setDoctorSuccess("Doctor details added successfully!");
          setTimeout(() => {
            setDoctorSuccess("");
          }, 5000);
          console.log("Doctor details added:", doctorDetails);
          setDoctors([...doctors, doctorDetails]);
        }
        setStaffs([...staffs, newStaff]);
      } else {
        const payload = {
          StaffId: formData.StaffId,
          FirstName: formData.FirstName,
          LastName: formData.LastName,
          DOB: formData.DOB,
          PhoneNumber: formData.PhoneNumber,
          Gender: formData.Gender,
          Role: formData.RoleDetail.RoleId,
          Email: formData.Email,
          Address: formData.Address,
          HireDate: formData.HireDate,
          IsActive: true
        };
        const updatedStaff = await updateStaff(formData.StaffId, payload);
        setStaffs(staffs.map((s) => (s.StaffId === updatedStaff.StaffId ? updatedStaff : s)));
        setStaffSuccess("Staff updated successfully!");
        setTimeout(() => {
          setStaffSuccess("");
        }, 5000);
      }
      setShowModal(false);
    } catch(err){
      if (err.response?.data){
        setBackErrs(err.response?.data);
      }else{
      console.error(err)
    }
      
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      {credentialsSuccess && <Alert variant="success">{credentialsSuccess}</Alert>}
      {staffSuccess && <Alert variant="success">{staffSuccess}</Alert>}
      {doctorSuccess && <Alert variant="success">{doctorSuccess}</Alert>}
<div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Staff List</h4>
        <Button variant="success" onClick={handleAdd}>
          <FaPlus /> Add New Staff
        </Button>
      </div>

      <StaffTable staffs={staffs} onEdit={handleEdit} onDelete={handleDelete} />
</div>
<div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Doctor List</h4>
        {/* <Button variant="success" onClick={handleAdd}>
          <FaPlus /> Add New Staff
        </Button> */}
      </div>
      <DoctorTable doctors={doctors} onEdit={handleEdit} onDelete={handleDelete} />
</div>
      <StaffFormModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        staffs={staffs}
        formData={formData}
        error={error}
        handleChange={handleChange}
        doctorChange={handleDoctorChange}
        handleSubmit={handleSubmit}
        credentialsData={credentialsData}
        setCredentialsData={setCredentialsData}
        handleCredentialsChange={handleCredentialsChange}
        mode={mode}
        doctorData={doctorData}
      />
    </>
  );
};

export default StaffContainer;
