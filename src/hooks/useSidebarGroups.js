import { useSelector } from 'react-redux';

export default function useSidebarGroups() {
  const user = useSelector(state => state.auth.user);
  // Adapte ce retour à la structure de ton user (voir ce que tu reçois côté API)
  return user?.activity_groups || [];
}
