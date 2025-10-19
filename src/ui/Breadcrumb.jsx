import { Breadcrumb as BSBreadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const Breadcrumb = ({ items }) => {
  return (
    <BSBreadcrumb className="mb-4">
      <BSBreadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
        <FaHome size={14} />
      </BSBreadcrumb.Item>
      
      {items.map((item, index) => (
        <BSBreadcrumb.Item
          key={index}
          linkAs={item.path ? Link : 'span'}
          linkProps={item.path ? { to: item.path } : {}}
          active={index === items.length - 1}
        >
          {item.label}
        </BSBreadcrumb.Item>
      ))}
    </BSBreadcrumb>
  );
};

export default Breadcrumb;
