import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav aria-label="breadcrumb">
      <ol style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
        <li>
          <Link to="/">Home</Link>
          {pathnames.length > 0 && <span style={{ margin: '0 8px' }}>/</span>}
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          return (
            <li key={name} style={{ display: 'flex', alignItems: 'center' }}>
              {isLast ? (
                <span style={{}}><strong>{name}</strong></span>
              ) : (
                <Link to={routeTo}>{name}</Link>
              )}
              {!isLast && <span style={{ margin: '0 8px' }}>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
