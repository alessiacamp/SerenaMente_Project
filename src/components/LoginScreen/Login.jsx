import React, { useState } from 'react';
import { FaUser } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('email', email);

      navigate('/home');


    } catch (err) {
      setError(err.message || 'Si è verificato un errore durante il login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center min-vh-100 bg-white p-0" style={{ fontFamily: 'Tinos, serif' }}>
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <Form
          onSubmit={handleSubmit}
          className="p-4 rounded shadow"
          style={{ backgroundColor: '#DEB887' }}
        >
          <div className="text-center mb-4">
            <FaUser size={32} className="mb-2" style={{ color: '#603311' }} />
            <h2 className="mb-0" style={{ color: '#603311', fontWeight: 'bold' }}>Login</h2>
          </div>

          {error && <Alert variant="danger" className="text-center">{error}</Alert>}

          <Form.Group className="mb-3 position-relative">
            <div className="position-relative">
              <MdOutlineEmail
                size={20}
                className="position-absolute top-50 start-0 translate-middle-y ms-3"
                style={{ color: '#603311' }}
              />
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="ps-5 py-2"
                style={{
                  backgroundColor: 'transparent',
                  color: '#603311',
                  border: 'none',
                  borderBottom: '1px solid #603311',
                  borderRadius: '0',
                  boxShadow: 'none'
                }}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-4 position-relative">
            <div className="position-relative">
              <TbLockPassword
                size={20}
                className="position-absolute top-50 start-0 translate-middle-y ms-3"
                style={{ color: '#603311' }}
              />
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="ps-5 py-2"
                style={{
                  backgroundColor: 'transparent',
                  color: '#603311',
                  border: 'none',
                  borderBottom: '1px solid #603311',
                  borderRadius: '0',
                  boxShadow: 'none'
                }}
              />
            </div>
          </Form.Group>

          <div className="text-center">
            <Button
              type="submit"
              className="mb-3"
              style={{
                color: '#603311',
                backgroundColor: 'transparent',
                border: 'none',
                padding: '0.375rem 1.5rem',
                textDecoration: "none"
              }}
              disabled={loading}
            >
              {loading ? 'Caricamento...' : 'Accedi'}
            </Button>
          </div>

          <div className="text-center">
            <p className="mb-2" style={{ color: '#603311' }}>
              Non hai un account?
            </p>
            <div className="d-flex flex-column align-items-center">
              <div>
                <a
                  href="/registrati-utente"
                  className="text-decoration-none"
                  style={{ color: '#603311' }}
                >
                  Registrati come Utente
                </a>
                <span style={{ color: '#603311' }}> | </span>
                <a
                  href="/registrati-volontario"
                  className="text-decoration-none"
                  style={{ color: '#603311' }}
                >
                  Registrati come Volontario
                </a>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default Login;