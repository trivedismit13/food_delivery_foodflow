import { useParams, Navigate } from 'react-router-dom';

export default function RedirectToCreator() {
  const { id } = useParams();
  
  if (id) {
    return <Navigate to={`/creators/${id}`} replace />;
  }
  
  return <Navigate to="/creators" replace />;
}
