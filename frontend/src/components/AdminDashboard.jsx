import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  LogOut, Search, Users, Clock, CheckCircle, XCircle,
  RefreshCw, Loader2, Trash2, ArrowLeft, BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const api = axios.create({ baseURL: BACKEND_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const statusLabels = { pending: 'Pendiente', contacted: 'Contactado', closed: 'Cerrado' };
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  contacted: 'bg-blue-100 text-blue-800',
  closed: 'bg-green-100 text-green-800',
};

const AdminDashboard = ({ user, onLogout }) => {
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, contacted: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 100, skip: 0 };
      if (statusFilter !== 'all') params.status_filter = statusFilter;
      if (searchTerm) params.search = searchTerm;

      const [contactsRes, statsRes] = await Promise.all([
        api.get('/api/admin/contacts', { params }),
        api.get('/api/admin/stats'),
      ]);
      setContacts(contactsRes.data.contacts || []);
      setStats(statsRes.data);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Sesión expirada');
        onLogout();
      } else {
        toast.error('Error al cargar datos');
      }
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm, onLogout]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (contactId, newStatus) => {
    try {
      await api.patch(`/api/admin/contacts/${contactId}/status?new_status=${newStatus}`);
      toast.success(`Estado actualizado a "${statusLabels[newStatus]}"`);
      fetchData();
    } catch {
      toast.error('Error al actualizar estado');
    }
  };

  const handleDelete = async (contactId) => {
    if (!window.confirm('¿Eliminar esta consulta permanentemente?')) return;
    try {
      await api.delete(`/api/admin/contacts/${contactId}`);
      toast.success('Consulta eliminada');
      fetchData();
    } catch {
      toast.error('Error al eliminar');
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch { /* ignore */ }
    localStorage.removeItem('admin_token');
    onLogout();
  };

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid="admin-dashboard">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-gray-400 hover:text-green-700 transition-colors" data-testid="admin-home-link">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div>
              <h1 className="text-lg font-bold text-green-900">ORÍGENES Admin</h1>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} data-testid="admin-logout-btn" className="text-gray-600 hover:text-red-600">
            <LogOut className="w-4 h-4 mr-2" />Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" data-testid="admin-stats">
          {[
            { label: 'Total', value: stats.total, icon: Users, color: 'bg-gray-100 text-gray-700' },
            { label: 'Pendientes', value: stats.pending, icon: Clock, color: 'bg-yellow-50 text-yellow-700' },
            { label: 'Contactados', value: stats.contacted, icon: CheckCircle, color: 'bg-blue-50 text-blue-700' },
            { label: 'Cerrados', value: stats.closed, icon: XCircle, color: 'bg-green-50 text-green-700' },
          ].map((s) => (
            <div key={s.label} className={`${s.color} rounded-xl p-5`} data-testid={`stat-${s.label.toLowerCase()}`}>
              <div className="flex items-center gap-2 mb-1">
                <s.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{s.label}</span>
              </div>
              <div className="text-3xl font-bold">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                data-testid="admin-search-input"
                placeholder="Buscar por nombre, email, departamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger data-testid="admin-status-filter" className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="contacted">Contactados</SelectItem>
                <SelectItem value="closed">Cerrados</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={fetchData} data-testid="admin-refresh-btn">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No se encontraron consultas</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="admin-contacts-table">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Nombre</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Email</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden md:table-cell">Teléfono</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden lg:table-cell">Departamento</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden lg:table-cell">Cultivo</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Estado</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden md:table-cell">Fecha</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors" data-testid={`contact-row-${c.id}`}>
                      <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                      <td className="px-4 py-3 text-gray-600">{c.email}</td>
                      <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{c.phone}</td>
                      <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{c.department}</td>
                      <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{c.culture}</td>
                      <td className="px-4 py-3">
                        <Select value={c.status} onValueChange={(val) => handleStatusChange(c.id, val)}>
                          <SelectTrigger data-testid={`status-select-${c.id}`} className={`h-8 text-xs font-medium border-0 ${statusColors[c.status] || ''}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pendiente</SelectItem>
                            <SelectItem value="contacted">Contactado</SelectItem>
                            <SelectItem value="closed">Cerrado</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">{formatDate(c.created_at)}</td>
                      <td className="px-4 py-3 text-center">
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)} data-testid={`delete-btn-${c.id}`} className="text-gray-400 hover:text-red-600 h-8 w-8">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
