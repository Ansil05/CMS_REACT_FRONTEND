import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Navbar, Nav } from 'react-bootstrap';
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
  FaCheckCircle,
  FaSignInAlt,
  FaCalendarAlt,
  FaInfoCircle
} from 'react-icons/fa';

const PublicLandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginClick = () => {
    navigate('/login'); // Navigate to your login page
  };

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
    { number: '20+', label: 'Years of Excellence', icon: FaAward },
    { number: '50+', label: 'Expert Doctors', icon: FaUserMd },
    { number: '100K+', label: 'Patients Treated', icon: FaHeartbeat },
    { number: '24/7', label: 'Emergency Care', icon: FaClock }
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
    <div style={{ minHeight: '100vh' }}>
      {/* Fixed Professional Navbar */}
      <Navbar 
        fixed="top" 
        expand="lg" 
        style={{
          background: scrolled 
            ? 'rgba(255, 255, 255, 0.98)' 
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: scrolled 
            ? '0 2px 20px rgba(0,0,0,0.1)' 
            : '0 2px 10px rgba(0,0,0,0.05)',
          padding: '10px 0',
          transition: 'all 0.3s ease',
          zIndex: 1000
        }}
      >
        <Container>
          <Navbar.Brand 
            href="#home" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              fontSize: '1.4rem',
              fontWeight: 'bold',
              color: '#2e7d32'
            }}
          >
            <FaHospital size={32} />
            <span>ANGEL CARE HOSPITAL</span>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center" style={{ gap: '15px' }}>
              <Nav.Link 
                href="#home" 
                style={{ 
                  color: '#1e293b', 
                  fontWeight: '500',
                  fontSize: '1rem'
                }}
              >
                Home
              </Nav.Link>
              <Nav.Link 
                href="#about" 
                style={{ 
                  color: '#1e293b', 
                  fontWeight: '500',
                  fontSize: '1rem'
                }}
              >
                About
              </Nav.Link>
              <Nav.Link 
                href="#departments" 
                style={{ 
                  color: '#1e293b', 
                  fontWeight: '500',
                  fontSize: '1rem'
                }}
              >
                Departments
              </Nav.Link>
              <Nav.Link 
                href="#contact" 
                style={{ 
                  color: '#1e293b', 
                  fontWeight: '500',
                  fontSize: '1rem'
                }}
              >
                Contact
              </Nav.Link>
              
              {/* Emergency Call Button */}
              <Button 
                variant="outline-success"
                size="md"
                style={{
                  borderRadius: '8px',
                  fontWeight: '600',
                  borderWidth: '2px',
                  padding: '8px 20px'
                }}
              >
                <FaPhone style={{ marginRight: '8px' }} />
                Emergency
              </Button>

              {/* LOGIN Button - PROMINENT */}
              <Button 
                variant="success"
                size="lg"
                onClick={handleLoginClick}
                style={{
                  borderRadius: '10px',
                  fontWeight: '700',
                  padding: '12px 40px',
                  background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(46, 125, 50, 0.3)',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(46, 125, 50, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(46, 125, 50, 0.3)';
                }}
              >
                <FaSignInAlt style={{ marginRight: '10px' }} />
                LOGIN
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section with Hospital Background Image */}
      <section 
        id="home"
        style={{
          marginTop: '76px', // Account for fixed navbar
          position: 'relative',
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.95) 0%, rgba(27, 94, 32, 0.9) 100%), url("https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          color: 'white',
          overflow: 'hidden'
        }}
      >
        {/* Overlay Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          opacity: 0.3
        }} />

        <Container style={{ position: 'relative', zIndex: 1 }}>
          <Row className="align-items-center">
            <Col lg={7}>
              <div style={{
                display: 'inline-block',
                padding: '10px 25px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50px',
                marginBottom: '25px',
                fontSize: '1rem',
                fontWeight: '600',
                backdropFilter: 'blur(10px)'
              }}>
                <FaAward style={{ marginRight: '10px' }} />
                20 Years of Trusted Healthcare Excellence
              </div>
              
              <h1 style={{
                fontSize: '3.5rem',
                fontWeight: '800',
                marginBottom: '25px',
                lineHeight: '1.2',
                textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                letterSpacing: '1px'
              }}>
                ANGEL CARE<br />
                MULTI-SPECIALITY<br />
                HOSPITAL
              </h1>
              
              <p style={{
                fontSize: '1.4rem',
                marginBottom: '35px',
                opacity: 0.95,
                lineHeight: '1.8',
                maxWidth: '600px',
                textShadow: '1px 1px 4px rgba(0,0,0,0.3)'
              }}>
                Your Health, Our Priority. Experience world-class healthcare with compassionate care and cutting-edge medical technology.
              </p>

              <div className="d-flex gap-3 flex-wrap">
                <Button 
                  size="lg"
                  style={{
                    background: 'white',
                    color: '#2e7d32',
                    border: 'none',
                    padding: '15px 40px',
                    fontWeight: '700',
                    borderRadius: '50px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    fontSize: '1.1rem'
                  }}
                >
                  <FaCalendarAlt style={{ marginRight: '10px' }} />
                  Book Appointment
                </Button>
                <Button 
                  size="lg"
                  variant="outline-light"
                  style={{
                    padding: '15px 40px',
                    fontWeight: '700',
                    borderRadius: '50px',
                    borderWidth: '2px',
                    fontSize: '1.1rem'
                  }}
                >
                  <FaInfoCircle style={{ marginRight: '10px' }} />
                  Learn More
                </Button>
              </div>
            </Col>

            <Col lg={5} className="mt-4 mt-lg-0">
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(15px)',
                borderRadius: '25px',
                padding: '40px',
                border: '2px solid rgba(255,255,255,0.3)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}>
                <Row>
                  {stats.map((stat, index) => (
                    <Col xs={6} key={index} className="text-center mb-4">
                      <stat.icon size={40} style={{ marginBottom: '15px', opacity: 0.9 }} />
                      <div style={{
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                      }}>
                        {stat.number}
                      </div>
                      <div style={{
                        fontSize: '1.05rem',
                        opacity: 0.95,
                        fontWeight: '500'
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
      <section id="about" style={{ padding: '100px 0', background: 'white' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: '#1b5e20',
              marginBottom: '20px'
            }}>
              About Angel Care Hospital
            </h2>
            <div style={{
              width: '100px',
              height: '5px',
              background: 'linear-gradient(to right, #2e7d32, #1b5e20)',
              margin: '0 auto 35px auto',
              borderRadius: '3px'
            }} />
            <p style={{
              fontSize: '1.2rem',
              color: '#64748b',
              maxWidth: '900px',
              margin: '0 auto',
              lineHeight: '2'
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
                  padding: '25px',
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #e8f5e9 100%)',
                  borderRadius: '20px',
                  border: '2px solid #c8e6c9',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '18px',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                }}
                >
                  <FaCheckCircle size={35} color="#2e7d32" />
                  <span style={{
                    fontSize: '1.05rem',
                    color: '#1b5e20',
                    fontWeight: '600',
                    lineHeight: '1.5'
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
      <section id="departments" style={{ padding: '100px 0', background: '#f8fafc' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: '#1b5e20',
              marginBottom: '20px'
            }}>
              Our Medical Departments
            </h2>
            <div style={{
              width: '100px',
              height: '5px',
              background: 'linear-gradient(to right, #2e7d32, #1b5e20)',
              margin: '0 auto 35px auto',
              borderRadius: '3px'
            }} />
            <p style={{
              fontSize: '1.2rem',
              color: '#64748b',
              maxWidth: '800px',
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
                  borderRadius: '25px',
                  overflow: 'hidden',
                  height: '100%',
                  transition: 'all 0.4s ease',
                  cursor: 'pointer',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.08)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-15px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.08)';
                }}
                >
                  <div style={{
                    background: `linear-gradient(135deg, ${dept.color}20 0%, ${dept.color}05 100%)`,
                    padding: '35px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '50%',
                      background: dept.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 25px auto',
                      boxShadow: `0 5px 20px ${dept.color}50`
                    }}>
                      <dept.icon size={40} color="white" />
                    </div>
                    <h4 style={{
                      fontSize: '1.4rem',
                      fontWeight: 'bold',
                      color: '#1e293b',
                      marginBottom: '12px'
                    }}>
                      {dept.name}
                    </h4>
                    <p style={{
                      fontSize: '1rem',
                      color: '#64748b',
                      marginBottom: '20px',
                      lineHeight: '1.6'
                    }}>
                      {dept.description}
                    </p>
                    <div style={{
                      padding: '12px',
                      background: 'white',
                      borderRadius: '12px',
                      boxShadow: '0 3px 10px rgba(0,0,0,0.05)'
                    }}>
                      <FaUserMd size={18} color={dept.color} style={{ marginRight: '10px' }} />
                      <span style={{
                        fontSize: '0.95rem',
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
        padding: '100px 0',
        position: 'relative'
      }}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={9} className="text-center">
              <FaStar size={60} style={{ marginBottom: '35px', opacity: 0.9 }} />
              <h3 style={{
                fontSize: '2.3rem',
                fontWeight: '600',
                marginBottom: '35px',
                lineHeight: '1.7',
                fontStyle: 'italic',
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
              }}>
                "Committed to Excellence in Healthcare. We don't just treat illnesses, 
                we care for people with compassion, dedication, and state-of-the-art medical expertise."
              </h3>
              <div style={{
                fontSize: '1.2rem',
                opacity: 0.95,
                fontWeight: '600'
              }}>
                — Angel Care Multi-Speciality Hospital Team
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ padding: '100px 0', background: 'white' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: '#1b5e20',
              marginBottom: '20px'
            }}>
              Get In Touch
            </h2>
            <div style={{
              width: '100px',
              height: '5px',
              background: 'linear-gradient(to right, #2e7d32, #1b5e20)',
              margin: '0 auto',
              borderRadius: '3px'
            }} />
          </div>

          <Row className="g-4">
            <Col md={4}>
              <div style={{
                padding: '40px',
                background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                borderRadius: '20px',
                textAlign: 'center',
                height: '100%',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <FaPhone size={45} color="#2e7d32" style={{ marginBottom: '20px' }} />
                <h5 style={{ color: '#1b5e20', marginBottom: '15px', fontSize: '1.3rem', fontWeight: 'bold' }}>Phone</h5>
                <p style={{ color: '#2e7d32', fontWeight: '600', marginBottom: '8px', fontSize: '1.1rem' }}>
                  +91 1800-XXX-XXXX
                </p>
                <p style={{ color: '#2e7d32', fontSize: '1rem' }}>
                  24/7 Emergency: +91 1800-XXX-YYYY
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div style={{
                padding: '40px',
                background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                borderRadius: '20px',
                textAlign: 'center',
                height: '100%',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <FaEnvelope size={45} color="#2e7d32" style={{ marginBottom: '20px' }} />
                <h5 style={{ color: '#1b5e20', marginBottom: '15px', fontSize: '1.3rem', fontWeight: 'bold' }}>Email</h5>
                <p style={{ color: '#2e7d32', fontWeight: '600', marginBottom: '8px', fontSize: '1.1rem' }}>
                  info@angelcarehospital.com
                </p>
                <p style={{ color: '#2e7d32', fontSize: '1rem' }}>
                  appointments@angelcarehospital.com
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div style={{
                padding: '40px',
                background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                borderRadius: '20px',
                textAlign: 'center',
                height: '100%',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <FaMapMarkerAlt size={45} color="#2e7d32" style={{ marginBottom: '20px' }} />
                <h5 style={{ color: '#1b5e20', marginBottom: '15px', fontSize: '1.3rem', fontWeight: 'bold' }}>Location</h5>
                <p style={{ color: '#2e7d32', fontWeight: '600', fontSize: '1.05rem', lineHeight: '1.6' }}>
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
        padding: '50px 0 25px 0'
      }}>
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
              <h4 style={{ marginBottom: '15px', fontWeight: 'bold', fontSize: '1.5rem' }}>
                <FaHospital style={{ marginRight: '12px' }} />
                ANGEL CARE MULTI-SPECIALITY HOSPITAL
              </h4>
              <p style={{ opacity: 0.9, marginBottom: '15px', fontSize: '1.05rem' }}>
                Excellence in Healthcare Since 2005
              </p>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>
                © 2025 Angel Care Hospital. All rights reserved.
              </p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <div style={{ marginBottom: '20px', fontSize: '1.05rem' }}>
                <FaClock style={{ marginRight: '10px' }} />
                <strong>24/7 Emergency Services Available</strong>
              </div>
              <div style={{ fontSize: '0.95rem', opacity: 0.8 }}>
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
