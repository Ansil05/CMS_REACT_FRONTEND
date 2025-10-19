import { FaGithub, FaLinkedin, FaTwitter, FaHeart } from 'react-icons/fa';

const Footer = ({ isDarkMode }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="border-top"
      style={{
        background: isDarkMode 
          ? '#1e293b' 
          : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)', // Light Blue Gradient
        padding: '1.5rem 2rem',
        transition: 'all 0.3s ease',
        color: isDarkMode ? '#e2e8f0' : '#1565c0', // Dark blue text
        width: '100%',
        marginTop: 'auto'
      }}
    >
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0" style={{ fontSize: '0.875rem' }}>
              © {currentYear} <strong style={{ color: isDarkMode ? 'white' : '#0d47a1' }}>Clinical Management System</strong>. All rights reserved. 
              | Made with <FaHeart size={12} color="#f43f5e" /> by Team <strong style={{ color: isDarkMode ? 'white' : '#0d47a1' }}>THE BOYS 4</strong>
            </p>
          </div>
          
          <div className="col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end align-items-center gap-4">
              <a 
                href="#" 
                style={{ 
                  color: isDarkMode ? '#e2e8f0' : '#1565c0',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = isDarkMode ? '#667eea' : '#0d47a1'}
                onMouseLeave={(e) => e.target.style.color = isDarkMode ? '#e2e8f0' : '#1565c0'}
              >
                Privacy Policy
              </a>
              <a 
                href="#" 
                style={{ 
                  color: isDarkMode ? '#e2e8f0' : '#1565c0',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = isDarkMode ? '#667eea' : '#0d47a1'}
                onMouseLeave={(e) => e.target.style.color = isDarkMode ? '#e2e8f0' : '#1565c0'}
              >
                Terms of Service
              </a>
              
              <div className="d-flex gap-3">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: isDarkMode ? '#e2e8f0' : '#1565c0',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = isDarkMode ? '#667eea' : '#0d47a1'}
                  onMouseLeave={(e) => e.target.style.color = isDarkMode ? '#e2e8f0' : '#1565c0'}
                  title="GitHub"
                >
                  <FaGithub size={18} />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: isDarkMode ? '#e2e8f0' : '#1565c0',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = isDarkMode ? '#667eea' : '#0d47a1'}
                  onMouseLeave={(e) => e.target.style.color = isDarkMode ? '#e2e8f0' : '#1565c0'}
                  title="LinkedIn"
                >
                  <FaLinkedin size={18} />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: isDarkMode ? '#e2e8f0' : '#1565c0',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = isDarkMode ? '#667eea' : '#0d47a1'}
                  onMouseLeave={(e) => e.target.style.color = isDarkMode ? '#e2e8f0' : '#1565c0'}
                  title="Twitter"
                >
                  <FaTwitter size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
