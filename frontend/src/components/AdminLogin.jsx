import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Lock, Mail, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      localStorage.setItem('admin_token', data.token);
      toast.success('Sesión iniciada correctamente');
      onLogin(data);
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg = typeof detail === 'string' ? detail
        : Array.isArray(detail) ? detail.map(e => e.msg || JSON.stringify(e)).join(' ')
        : 'Error de autenticación';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <a href="/" className="inline-flex items-center gap-2 text-green-200 hover:text-white mb-8 transition-colors" data-testid="admin-back-link">
          <ArrowLeft className="w-4 h-4" />
          Volver al sitio
        </a>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-green-700" />
            </div>
            <h1 className="text-2xl font-bold text-green-900">Panel Administrativo</h1>
            <p className="text-gray-500 text-sm mt-1">ORÍGENES - Nutrición y Precisión</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" data-testid="admin-login-form">
            <div>
              <Label htmlFor="admin-email" className="text-green-900">Correo Corporativo</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="admin-email"
                  data-testid="admin-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-gray-300"
                  placeholder="gerencia@origeneskhachi.org"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="admin-password" className="text-green-900">Contraseña</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="admin-password"
                  data-testid="admin-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-gray-300"
                  placeholder="Contraseña"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              data-testid="admin-login-btn"
              className="w-full bg-green-700 hover:bg-green-800 text-white py-5 text-base font-semibold"
            >
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Ingresando...</> : 'Ingresar'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
