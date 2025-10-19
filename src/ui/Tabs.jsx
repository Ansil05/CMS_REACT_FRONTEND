import { useState } from 'react';
import { Nav } from 'react-bootstrap';

const Tabs = ({ tabs, defaultTab = 0 }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div>
      <Nav variant="tabs" className="mb-4">
        {tabs.map((tab, index) => (
          <Nav.Item key={index}>
            <Nav.Link 
              active={activeTab === index}
              onClick={() => setActiveTab(index)}
              className="d-flex align-items-center gap-2"
              style={{
                cursor: 'pointer',
                borderRadius: 'var(--radius-md) var(--radius-md) 0 0'
              }}
            >
              {tab.icon && <tab.icon size={16} />}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="badge badge-soft-primary ms-2">
                  {tab.badge}
                </span>
              )}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      
      <div className="tab-content">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};

export default Tabs;
