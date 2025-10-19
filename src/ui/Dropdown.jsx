import { Dropdown as BSDropdown } from 'react-bootstrap';
import { FaEllipsisV } from 'react-icons/fa';

const Dropdown = ({ items, trigger, align = 'end' }) => {
  return (
    <BSDropdown align={align}>
      <BSDropdown.Toggle 
        variant="link" 
        className="text-dark p-0 border-0"
        style={{ background: 'transparent', boxShadow: 'none' }}
      >
        {trigger || <FaEllipsisV />}
      </BSDropdown.Toggle>

      <BSDropdown.Menu>
        {items.map((item, index) => (
          item.divider ? (
            <BSDropdown.Divider key={index} />
          ) : (
            <BSDropdown.Item 
              key={index}
              onClick={item.onClick}
              className="d-flex align-items-center gap-2"
            >
              {item.icon && <item.icon size={14} />}
              <span>{item.label}</span>
            </BSDropdown.Item>
          )
        ))}
      </BSDropdown.Menu>
    </BSDropdown>
  );
};

export default Dropdown;
