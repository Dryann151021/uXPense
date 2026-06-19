import { Link } from 'react-router-dom';

export default function FAB({ to, onClick, icon = '+' }) {
  const content = (
    <button className="fab-button" onClick={onClick} aria-label="Action">
      <span className="fab-icon">{icon}</span>
    </button>
  );

  if (to) {
    return (
      <Link to={to} className="fab-link">
        {content}
      </Link>
    );
  }

  return content;
}
