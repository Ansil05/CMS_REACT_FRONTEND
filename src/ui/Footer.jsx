import { Container, Row, Col } from 'react-bootstrap';
import { FaHeart, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-top" style={{ background: 'white' }}>
      <Container fluid className="py-4">
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              © {currentYear} <strong>Clinical Management System</strong>. All rights reserved.
              <span className="d-none d-sm-inline"> | Made with </span>
              <FaHeart className="text-danger mx-1" size={14} />
              <span className="d-none d-sm-inline"> by Team<strong> THE BOYS 4</strong></span>
            </p>
          </Col>
          
          <Col md={6} className="text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end align-items-center gap-3">
              <a 
                href="#" 
                className="text-decoration-none"
                style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}
              >
                Privacy Policy
              </a>
              <a 
                href="#" 
                className="text-decoration-none"
                style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}
              >
                Terms of Service
              </a>
              <div className="d-flex gap-2 ms-2">
                <a 
                  href="#" 
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-secondary)',
                    transition: 'var(--transition-base)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--primary-600)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg-tertiary)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <FaGithub size={16} />
                </a>
                <a 
                  href="#" 
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-secondary)',
                    transition: 'var(--transition-base)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#0077b5';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg-tertiary)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <FaLinkedin size={16} />
                </a>
                <a 
                  href="#" 
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-secondary)',
                    transition: 'var(--transition-base)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#1da1f2';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg-tertiary)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <FaTwitter size={16} />
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
