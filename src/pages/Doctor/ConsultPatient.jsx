import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAppointmentForConsultation, createConsultation } from '../../services/doctorService';
import LoadingSpinner from '../../ui/LoadingSpinner';

function getAge(dob) {
  if (!dob) return '';
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

const ConsultPatient = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessSpinner, setShowSuccessSpinner] = useState(false);

  const [formData, setFormData] = useState({
    symptoms: "",
    notes: "",
    diagnosis: "",
    prescriptions: [{ medicine: "", dosage: "" }],
    lab_prescriptions: [{ testname: "" }]
  });

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      setLoading(true);
      try {
        const data = await getAppointmentForConsultation(appointmentId);
        setAppointment(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch appointment details");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointmentDetails();
  }, [appointmentId]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePrescriptionChange = (index, field, value) => {
    const updatedPrescriptions = [...formData.prescriptions];
    updatedPrescriptions[index][field] = value;
    setFormData(prev => ({ ...prev, prescriptions: updatedPrescriptions }));
  };

  const addPrescription = () => {
    setFormData(prev => ({
      ...prev,
      prescriptions: [...prev.prescriptions, { medicine: "", dosage: "" }]
    }));
  };

  const removePrescription = index => {
    setFormData(prev => ({
      ...prev,
      prescriptions: prev.prescriptions.filter((_, i) => i !== index)
    }));
  };

  const handleLabPrescriptionChange = (index, value) => {
    const updatedLabPrescriptions = [...formData.lab_prescriptions];
    updatedLabPrescriptions[index].testname = value;
    setFormData(prev => ({ ...prev, lab_prescriptions: updatedLabPrescriptions }));
  };

  const addLabPrescription = () => {
    setFormData(prev => ({
      ...prev,
      lab_prescriptions: [...prev.lab_prescriptions, { testname: "" }]
    }));
  };

  const removeLabPrescription = index => {
    setFormData(prev => ({
      ...prev,
      lab_prescriptions: prev.lab_prescriptions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.symptoms.trim() || !formData.diagnosis.trim()) {
      setError("Symptoms and Diagnosis are required");
      return;
    }
    const validPrescriptions = formData.prescriptions.filter(
      p => p.medicine.trim() && p.dosage.trim()
    );
    const validLabPrescriptions = formData.lab_prescriptions.filter(
      lp => lp.testname.trim()
    );

    try {
      setSubmitting(true);
      setError(null);
      await createConsultation({
        appointment: appointmentId,
        symptoms: formData.symptoms,
        notes: formData.notes,
        diagnosis: formData.diagnosis,
        prescriptions: validPrescriptions,
        lab_prescriptions: validLabPrescriptions
      });
      
      setSubmitting(false);
      setShowSuccessSpinner(true);
      
      setTimeout(() => {
        navigate("/app/doctor/consultations");
      }, 1000);
      
    } catch (err) {
      setError("Failed to save consultation");
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen message="Loading appointment details..." />;
  if (showSuccessSpinner) return <LoadingSpinner fullScreen message="Consultation saved successfully! Redirecting..." />;
  if (!appointment) return <div>Appointment not found.</div>;

  const patient = appointment.patient;

  return (
    <div className="container p-4">
      <h2>Consult Patient</h2>
      {error && <div className="alert alert-danger my-2">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <strong>Patient Name:</strong> {patient?.first_name} {patient?.last_name}<br />
          <strong>Age:</strong> {patient?.dob ? getAge(patient.dob) : "N/A"}<br />
          <strong>Phone:</strong> {patient?.phone_no || "N/A"}<br />
          <strong>Appointment Date:</strong> {appointment.appointment_date || "N/A"}
        </div>

        <div className="mb-3">
          <label>Symptoms *</label>
          <textarea
            name="symptoms"
            value={formData.symptoms}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Notes (Optional)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label>Diagnosis *</label>
          <textarea
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <h5>Medicine Prescriptions</h5>
          {formData.prescriptions.map((prescription, idx) => (
            <div key={idx} className="row mb-2">
              <div className="col">
                <input
                  type="text"
                  placeholder="Medicine name"
                  value={prescription.medicine}
                  onChange={e => handlePrescriptionChange(idx, "medicine", e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="col">
                <input
                  type="text"
                  placeholder="Dosage"
                  value={prescription.dosage}
                  onChange={e => handlePrescriptionChange(idx, "dosage", e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="col-auto">
                {formData.prescriptions.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removePrescription(idx)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-secondary" onClick={addPrescription}>
            Add Medicine
          </button>
        </div>

        <div className="mb-3">
          <h5>Lab Test Prescriptions</h5>
          {formData.lab_prescriptions.map((lab, idx) => (
            <div key={idx} className="row mb-2">
              <div className="col">
                <input
                  type="text"
                  placeholder="Lab test name"
                  value={lab.testname}
                  onChange={e => handleLabPrescriptionChange(idx, e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="col-auto">
                {formData.lab_prescriptions.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeLabPrescription(idx)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-secondary" onClick={addLabPrescription}>
            Add Lab Test
          </button>
        </div>

        <button className="btn btn-success" type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Consultation"}
        </button>
      </form>
    </div>
  );
};

export default ConsultPatient;
