import React, { useState } from 'react';
import doctorService from '../../services/doctorService';
import FormGroup from '../../elements/FormGroup';
import FormLabel from '../../elements/FormLabel';
import Input from '../../elements/Input';
import TextArea from '../../elements/TextArea';
import Button from '../../elements/Button';
import FormError from '../../elements/FormError';
import Toast from '../../ui/Toast';

const PrescriptionForm = ({ appointmentId, onSuccess }) => {
  const [formData, setFormData] = useState({
    medicine_name: '',
    dosage: '',
    duration: '',
    instructions: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.medicine_name.trim()) newErrors.medicine_name = 'Medicine name is required';
    if (!formData.dosage.trim()) newErrors.dosage = 'Dosage is required';
    if (!formData.duration.trim()) newErrors.duration = 'Duration is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      const payload = { ...formData, appointment: appointmentId };
      await doctorService.addPrescription(payload);
      setToast({ type: 'success', message: 'Prescription added successfully!' });
      setFormData({
        medicine_name: '',
        dosage: '',
        duration: '',
        instructions: '',
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to save prescription' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: '0 1px 6px rgba(0, 0, 0, 0.1)',
      marginTop: '1rem'
    }}>
      <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>Add Prescription</h3>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel>Medicine Name</FormLabel>
          <Input
            type="text"
            name="medicine_name"
            value={formData.medicine_name}
            onChange={handleChange}
            placeholder="e.g. Paracetamol"
          />
          {errors.medicine_name && <FormError>{errors.medicine_name}</FormError>}
        </FormGroup>

        <FormGroup>
          <FormLabel>Dosage</FormLabel>
          <Input
            type="text"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            placeholder="e.g. 500mg twice daily"
          />
          {errors.dosage && <FormError>{errors.dosage}</FormError>}
        </FormGroup>

        <FormGroup>
          <FormLabel>Duration</FormLabel>
          <Input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g. 5 days"
          />
          {errors.duration && <FormError>{errors.duration}</FormError>}
        </FormGroup>

        <FormGroup>
          <FormLabel>Instructions</FormLabel>
          <TextArea
            name="instructions"
            rows="3"
            value={formData.instructions}
            onChange={handleChange}
            placeholder="Take after meals or any special note..."
          />
        </FormGroup>

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          {loading ? 'Saving...' : 'Save Prescription'}
        </Button>
      </form>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default PrescriptionForm;
