import ClientWrapper from '../../../components/ClientWrapper';
import UserDashboard from '@/components/UserDashboard';

export default function Home() {
  return (
    <main>
      <UserDashboard />
      <ClientWrapper />
    </main>
  );
}