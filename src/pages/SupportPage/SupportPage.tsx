import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/api/hooks/useAuth';
import { API_BASE_URL, API_ENDPOINTS } from '@/api/config/apiConfig';
import style from './SupportPage.module.scss';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import TicketCard from '@/components/TicketCard/TicketCard';
import { Ticket } from '@/types/ticket';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Все' },
  { value: 'open', label: 'Открыт' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'resolved', label: 'Решён' },
  { value: 'closed', label: 'Закрыт' },
];

export default function SupportPage() {
  const { user, isAuthenticated, initialCheckDone } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    if (initialCheckDone) {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      } else if (!user || user.role !== 'support') {
        navigate('/');
        return;
      }
      fetchTickets();
    }
  }, [initialCheckDone, isAuthenticated, user, navigate]);

  const fetchTickets = async () => {
    setLoading(true);
    setError('');
    try {
      // Используем правильный эндпоинт для саппорта
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.support.tickets}?_=${Date.now()}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Ошибка загрузки тикетов');
      const data = await res.json();
      setTickets(Array.isArray(data) ? data : data.results);
    } catch (e) {
      setError('Ошибка загрузки тикетов');
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = statusFilter === 'all'
    ? tickets
    : tickets.filter(t => t.status === statusFilter);

  if (!initialCheckDone) {
    return <div className={style.loading}>Загрузка...</div>;
  }

  if (!isAuthenticated) {
    navigate('/login');
    return <div className={style.loading}>Перенаправление на страницу входа...</div>;
  }

  if (!user || user.role !== 'support') {
    navigate('/');
    return <div className={style.loading}>Перенаправление...</div>;
  }

  return (
    <div className={style.container}>
      <header className={style.header}>
        <div className={style.left}>
          <h1 className={style.pageTitle}>Все тикеты</h1>
        </div>
        <div className={style.right}>
          <Button type="text" onClick={() => navigate('/logout')} className={style.logoutBtn}>
            Выйти
          </Button>
        </div>
      </header>
      <div className={style.filters}>
        <Select
          value={statusFilter}
          onChange={(value) => setStatusFilter(value as any)}
          options={STATUS_OPTIONS}
          className={style.statusSelect}
        />
      </div>
      {loading ? (
        <div className={style.loading}>Загрузка тикетов...</div>
      ) : error ? (
        <div className={style.errorAlert}>{error}</div>
      ) : filteredTickets.length === 0 ? (
        <div className={style.empty}>Нет тикетов</div>
      ) : (
        <div className={style.ticketList}>
          {filteredTickets.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onClick={() => navigate(`/ticket/${ticket.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
