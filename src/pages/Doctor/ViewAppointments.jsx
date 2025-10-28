import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoctorAppointments } from '../../services/doctorService';
import LoadingSpinner from '../../ui/LoadingSpinner';

const ViewAppointments = () => {
  const navigate = useNavigate();
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [tomorrowsAppointments, setTomorrowsAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const data = await getDoctorAppointments();
        console.log('APPOINTMENT DATA:', data);

        // Get today's and tomorrow's date in YYYY-MM-DD format
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        // Filter appointments for today and tomorrow
        const todayAppts = data.filter((app) => app.appointment_date === todayStr);
        const tomorrowAppts = data.filter((app) => app.appointment_date === tomorrowStr);

        setTodaysAppointments(todayAppts);
        setTomorrowsAppointments(tomorrowAppts);
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  if (loading) return <LoadingSpinner fullScreen message="Loading appointments..." />;

  return (
    <div className="container p-4">
      {/* Today's Appointments Section */}
      <h2 className="mb-4" style={{ fontWeight: 600, color: '#2c3e50' }}>
        Today's Appointments
      </h2>
      <table className="table table-striped table-bordered mb-5">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Date</th>
            <th>Consult</th>
          </tr>
        </thead>
        <tbody>
          {todaysAppointments.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">
                No appointments scheduled for today.
              </td>
            </tr>
          ) : (
            todaysAppointments.map((app) => (
              <tr key={app.appointment_id || app.id}>
                <td>{app.patient.first_name} {app.patient.last_name}</td>
                <td>{app.appointment_date}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => navigate(`/app/doctor/consult/${app.appointment_id}`)}
                    disabled={app.status === 'Completed'}
                  >
                    Consult
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Tomorrow's Appointments Section */}
      <h2 className="mb-4 mt-5" style={{ fontWeight: 600, color: '#2c3e50' }}>
        Tomorrow's Appointments
      </h2>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {tomorrowsAppointments.length === 0 ? (
            <tr>
              <td colSpan="2" className="text-center">
                No appointments scheduled for tomorrow.
              </td>
            </tr>
          ) : (
            tomorrowsAppointments.map((app) => (
              <tr key={app.appointment_id || app.id}>
                <td>{app.patient.first_name} {app.patient.last_name}</td>
                <td>{app.appointment_date}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAppointments;
