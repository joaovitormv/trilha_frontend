import { VisitorView } from './visitorView';
import { DashboardView } from './dashboardView';
import { useAuth } from '../../hooks/useAuth';
import './styles.css';

export const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-main-content">
      {isAuthenticated ? <DashboardView user={user} /> : <VisitorView />}
    </div>
  );
};
