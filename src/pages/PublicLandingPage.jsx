import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { 
  FaHospital, 
  FaUserMd, 
  FaHeartbeat, 
  FaAward, 
  FaStethoscope,
  FaBrain,
  FaBone,
  FaBaby,
  FaEye,
  FaTooth,
  FaLungs,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaStar,
  FaCheckCircle
} from 'react-icons/fa';

const PublicLandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const departments = [
    {
      icon: FaHeartbeat,
      name: 'Cardiology',
      doctor: 'Dr. Rajesh Kumar',
      description: 'Expert heart care with advanced diagnostics',
      color: '#e74c3c'
    },
    {
      icon: FaBrain,
      name: 'Neurology',
      doctor: 'Dr. Priya Sharma',
      description: 'Comprehensive brain and nerve treatments',
      color: '#9b59b6'
    },
    {
      icon: FaBone,
      name: 'Orthopedics',
      doctor: 'Dr. Amit Patel',
      description: 'Advanced bone and joint care',
      color: '#3498db'
    },
    {
      icon: FaBaby,
      name: 'Pediatrics',
      doctor: 'Dr. Sneha Reddy',
      description: 'Compassionate care for children',
      color: '#f39c12'
    },
    {
      icon: FaEye,
      name: 'Ophthalmology',
      doctor: 'Dr. Vikram Singh',
      description: 'Complete eye care solutions',
      color: '#1abc9c'
    },
    {
      icon: FaTooth,
      name: 'Dentistry',
      doctor: 'Dr. Anjali Mehta',
      description: 'Advanced dental treatments',
      color: '#16a085'
    },
    {
      icon: FaLungs,
      name: 'Pulmonology',
      doctor: 'Dr. Suresh Rao',
      description: 'Respiratory care excellence',
      color: '#2ecc71'
    },
    {
      icon: FaStethoscope,
      name: 'General Medicine',
      doctor: 'Dr. Kavita Joshi',
      description: 'Comprehensive healthcare services',
      color: '#34495e'
    }
  ];

  const stats = [
    { number: '20+', label: 'Years of Excellence' },
    { number: '50+', label: 'Expert Doctors' },
    { number: '100K+', label: 'Patients Treated' },
    { number: '24/7', label: 'Emergency Care' }
  ];

  const achievements = [
    'ISO 9001:2015 Certified Hospital',
    'NABH Accredited Healthcare Facility',
    'Best Multi-Speciality Hospital Award 2023',
    'Excellence in Patient Care 2022',
    'Advanced Cardiac Care Center',
    'State-of-the-Art ICU & NICU'
  ];

  return (
    <div style={{ 
      background: 'linear-gradient(to bottom, #f8fafc, #e8f5e9)',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
        color: 'white',
        padding: '100px 0 80px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M30 0L60 30L30 60L0 30Z" fill="white"/%3E%3C/svg%3E")',
          backgroundSize: '60px 60px'
        }} />

        <Container style={{ position: 'relative', zIndex: 1 }}>
          <Row className="align-items-center">
            <Col lg={6} className="text-center text-lg-start mb-4 mb-lg-0">
              <div style={{
                display: 'inline-block',
                padding: '8px 20px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50px',
                marginBottom: '20px',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                <FaAward style={{ marginRight: '8px' }} />
                20 Years of Trusted Healthcare
              </div>
              
              <h1 style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                marginBottom: '20px',
                lineHeight: '1.2',
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
              }}>
                ANGEL CARE MULTI-SPECIALITY HOSPITAL
              </h1>
              
              <p style={{
                fontSize: '1.3rem',
                marginBottom: '30px',
                opacity: 0.95,
                lineHeight: '1.6'
              }}>
                Your Health, Our Priority. Healing with Compassion, Caring with Excellence.
              </p>

              <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                <Button 
                  size="lg"
                  style={{
                    background: 'white',
                    color: '#2e7d32',
                    border: 'none',
                    padding: '12px 35px',
                    fontWeight: '600',
                    borderRadius: '50px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                  }}
                >
                  <FaPhone style={{ marginRight: '8px' }} />
                  Book Appointment
                </Button>
                <Button 
                  size="lg"
                  variant="outline-light"
                  style={{
                    padding: '12px 35px',
                    fontWeight: '600',
                    borderRadius: '50px',
                    borderWidth: '2px'
                  }}
                >
                  Emergency: 24/7
                </Button>
              </div>
            </Col>

            <Col lg={6}>
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '30px',
                border: '2px solid rgba(255,255,255,0.2)'
              }}>
                <Row>
                  {stats.map((stat, index) => (
                    <Col xs={6} key={index} className="text-center mb-3">
                      <div style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        marginBottom: '5px'
                      }}>
                        {stat.number}
                      </div>
                      <div style={{
                        fontSize: '0.95rem',
                        opacity: 0.9
                      }}>
                        {stat.label}
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* About Section */}
      <section style={{ padding: '80px 0', background: 'white' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#1b5e20',
              marginBottom: '15px'
            }}>
              About Angel Care Hospital
            </h2>
            <div style={{
              width: '80px',
              height: '4px',
              background: 'linear-gradient(to right, #2e7d32, #1b5e20)',
              margin: '0 auto 30px auto',
              borderRadius: '2px'
            }} />
            <p style={{
              fontSize: '1.1rem',
              color: '#64748b',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: '1.8'
            }}>
              For over 20 years, Angel Care Multi-Speciality Hospital has been at the forefront of healthcare excellence, 
              providing compassionate care and advanced medical treatments to thousands of patients. Our commitment 
              to quality healthcare and patient satisfaction has made us one of the most trusted hospitals in the region.
            </p>
          </div>

          <Row className="g-4 mt-4">
            {achievements.map((achievement, index) => (
              <Col md={6} lg={4} key={index}>
                <div style={{
                  padding: '20px',
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #e8f5e9 100%)',
                  borderRadius: '15px',
                  border: '2px solid #c8e6c9',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  transition: 'transform 0.3s ease',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <FaCheckCircle size={30} color="#2e7d32" />
                  <span style={{
                    fontSize: '1rem',
                    color: '#1b5e20',
                    fontWeight: '500'
                  }}>
                    {achievement}
                  </span>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Departments Section */}
      <section style={{ padding: '80px 0', background: '#f8fafc' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#1b5e20',
              marginBottom: '15px'
            }}>
              Our Specialities
            </h2>
            <div style={{
              width: '80px',
              height: '4px',
              background: 'linear-gradient(to right, #2e7d32, #1b5e20)',
              margin: '0 auto 30px auto',
              borderRadius: '2px'
            }} />
            <p style={{
              fontSize: '1.1rem',
              color: '#64748b',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Comprehensive healthcare services across multiple specialities with experienced doctors
            </p>
          </div>

          <Row className="g-4">
            {departments.map((dept, index) => (
              <Col md={6} lg={3} key={index}>
                <Card style={{
                  border: 'none',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
                }}
                >
                  <div style={{
                    background: `linear-gradient(135deg, ${dept.color}15 0%, ${dept.color}05 100%)`,
                    padding: '30px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: dept.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px auto',
                      boxShadow: `0 4px 15px ${dept.color}40`
                    }}>
                      <dept.icon size={35} color="white" />
                    </div>
                    <h4 style={{
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      color: '#1e293b',
                      marginBottom: '10px'
                    }}>
                      {dept.name}
                    </h4>
                    <p style={{
                      fontSize: '0.95rem',
                      color: '#64748b',
                      marginBottom: '15px'
                    }}>
                      {dept.description}
                    </p>
                    <div style={{
                      padding: '10px',
                      background: 'white',
                      borderRadius: '10px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}>
                      <FaUserMd size={16} color={dept.color} style={{ marginRight: '8px' }} />
                      <span style={{
                        fontSize: '0.9rem',
                        color: '#1e293b',
                        fontWeight: '600'
                      }}>
                        {dept.doctor}
                      </span>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Quote Section */}
      <section style={{
        background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
        color: 'white',
        padding: '80px 0',
        position: 'relative'
      }}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <FaStar size={50} style={{ marginBottom: '30px', opacity: 0.9 }} />
              <h3 style={{
                fontSize: '2rem',
                fontWeight: '600',
                marginBottom: '30px',
                lineHeight: '1.6',
                fontStyle: 'italic'
              }}>
                "Committed to Excellence in Healthcare. We don't just treat illnesses, 
                we care for people with compassion, dedication, and state-of-the-art medical expertise."
              </h3>
              <div style={{
                fontSize: '1.1rem',
                opacity: 0.9,
                fontWeight: '500'
              }}>
                — Angel Care Multi-Speciality Hospital Team
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Section */}
      <section style={{ padding: '80px 0', background: 'white' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#1b5e20',
              marginBottom: '15px'
            }}>
              Get In Touch
            </h2>
            <div style={{
              width: '80px',
              height: '4px',
              background: 'linear-gradient(to right, #2e7d32, #1b5e20)',
              margin: '0 auto',
              borderRadius: '2px'
            }} />
          </div>

          <Row className="g-4">
            <Col md={4}>
              <div style={{
                padding: '30px',
                background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                borderRadius: '15px',
                textAlign: 'center',
                height: '100%'
              }}>
                <FaPhone size={40} color="#2e7d32" style={{ marginBottom: '15px' }} />
                <h5 style={{ color: '#1b5e20', marginBottom: '10px' }}>Phone</h5>
                <p style={{ color: '#2e7d32', fontWeight: '600', marginBottom: '5px' }}>
                  +91 1800-XXX-XXXX
                </p>
                <p style={{ color: '#2e7d32', fontSize: '0.9rem' }}>
                  24/7 Emergency: +91 1800-XXX-YYYY
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div style={{
                padding: '30px',
                background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                borderRadius: '15px',
                textAlign: 'center',
                height: '100%'
              }}>
                <FaEnvelope size={40} color="#2e7d32" style={{ marginBottom: '15px' }} />
                <h5 style={{ color: '#1b5e20', marginBottom: '10px' }}>Email</h5>
                <p style={{ color: '#2e7d32', fontWeight: '600', marginBottom: '5px' }}>
                  info@angelcarehospital.com
                </p>
                <p style={{ color: '#2e7d32', fontSize: '0.9rem' }}>
                  appointments@angelcarehospital.com
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div style={{
                padding: '30px',
                background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                borderRadius: '15px',
                textAlign: 'center',
                height: '100%'
              }}>
                <FaMapMarkerAlt size={40} color="#2e7d32" style={{ marginBottom: '15px' }} />
                <h5 style={{ color: '#1b5e20', marginBottom: '10px' }}>Location</h5>
                <p style={{ color: '#2e7d32', fontWeight: '600', fontSize: '0.95rem' }}>
                  123 Healthcare Avenue,<br />
                  Medical District, City - 560001
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer style={{
        background: 'linear-gradient(135deg, #1b5e20 0%, #0d3d0f 100%)',
        color: 'white',
        padding: '40px 0 20px 0'
      }}>
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
              <h4 style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                <FaHospital style={{ marginRight: '10px' }} />
                ANGEL CARE MULTI-SPECIALITY HOSPITAL
              </h4>
              <p style={{ opacity: 0.9, marginBottom: '15px' }}>
                Excellence in Healthcare Since 2005
              </p>
              <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                © 2025 Angel Care Hospital. All rights reserved.
                made by <strong>THE BOYS</strong>
              </p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <div style={{ marginBottom: '15px' }}>
                <FaClock style={{ marginRight: '10px' }} />
                <strong>24/7 Emergency Services Available</strong>
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                ISO 9001:2015 Certified | NABH Accredited
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default PublicLandingPage;
