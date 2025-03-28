import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserAlt, FaCamera } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";

const RegistratiUtente = () => {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    password: '',
    foto: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);

      setFormData(prev => ({
        ...prev,
        foto: file
      }));
    }
  };

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const fotoBase64 = formData.foto ? await convertImageToBase64(formData.foto) : null;

      const payload = {
        nome: formData.nome,
        cognome: formData.cognome,
        email: formData.email,
        password: formData.password,
        foto: fotoBase64,
        messaggio: "",
        ruolo: "USER"
      };

      const response = await fetch('http://localhost:8080/utente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Errore durante la registrazione');
      }

      setRegistrationSuccess(true);

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error('Errore:', err);
      setError(err.message || 'Si è verificato un errore durante la registrazione');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-white">
      <form
        className="p-4 rounded"
        style={{
          backgroundColor: "#DEB887",
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          fontFamily: "Tinos",
          color: '#603311'
        }}
        onSubmit={handleSubmit}
      >
        <h2 style={{
          color: '#603311',
          fontWeight: "bold",
          marginBottom: '1.5rem'
        }}>
          Registrati come Utente
        </h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="position-relative mb-4">
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {previewImage ? (
              <img
                src={previewImage}
                className="d-inline-block rounded-circle mb-2"
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  border: '2px solid #603311'
                }}
                alt="Anteprima profilo"
              />
            ) : (
              <div
                className="d-inline-block rounded-circle mb-2 d-flex align-items-center justify-content-center"
                style={{
                  width: '200px',
                  height: '200px',
                  backgroundColor: '#f8f9fa',
                  cursor: 'pointer',
                  position: 'relative',
                  border: '2px solid #603311'
                }}
              >
                <span style={{ color: '#603311', fontSize: '3rem' }}>
                  <FaUserAlt />
                </span>
              </div>
            )}
            <label
              htmlFor="foto-upload"
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                backgroundColor: '#603311',
                color: '#DEB887',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <FaCamera />
              <input
                id="foto-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
                disabled={registrationSuccess}
              />
            </label>
          </div>
        </div>

        <div className='position-relative mb-3'>
          <input
            type="text"
            name="nome"
            placeholder='Nome'
            required
            className="w-100 ps-5 py-2"
            style={{
              color: '#603311',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: '1px solid #603311',
              outline: 'none',
              fontFamily: 'Tinos'
            }}
            value={formData.nome}
            onChange={handleChange}
            disabled={registrationSuccess}
          />
          <FaUserAlt className='position-absolute start-0 top-50 translate-middle-y ms-3' style={{ color: '#603311' }} />
        </div>

        <div className='position-relative mb-3'>
          <input
            type="text"
            name="cognome"
            placeholder='Cognome'
            required
            className="w-100 ps-5 py-2"
            style={{
              color: '#603311',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: '1px solid #603311',
              outline: 'none',
              fontFamily: 'Tinos'
            }}
            value={formData.cognome}
            onChange={handleChange}
            disabled={registrationSuccess}
          />
          <FaUserAlt className='position-absolute start-0 top-50 translate-middle-y ms-3' style={{ color: '#603311' }} />
        </div>

        <div className='position-relative mb-3'>
          <input
            type="email"
            name="email"
            placeholder='Email'
            required
            className="w-100 ps-5 py-2"
            style={{
              color: '#603311',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: '1px solid #603311',
              outline: 'none',
              fontFamily: 'Tinos'
            }}
            value={formData.email}
            onChange={handleChange}
            disabled={registrationSuccess}
          />
          <MdOutlineEmail className='position-absolute start-0 top-50 translate-middle-y ms-3' style={{ color: '#603311' }} />
        </div>

        <div className='position-relative mb-4'>
          <input
            type="password"
            name="password"
            placeholder='Password'
            required
            className="w-100 ps-5 py-2"
            style={{
              color: '#603311',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: '1px solid #603311',
              outline: 'none',
              fontFamily: 'Tinos'
            }}
            value={formData.password}
            onChange={handleChange}
            disabled={registrationSuccess}
          />
          <TbLockPassword className='position-absolute start-0 top-50 translate-middle-y ms-3' style={{ color: '#603311' }} />
        </div>

        <button
          type='submit'
          className="w-100 py-2 text-decoration-none"
          style={{
            color: '#603311',
            backgroundColor: 'transparent',
            border: '2px solid #603311',
            borderRadius: '5px',
            cursor: registrationSuccess ? 'default' : 'pointer',
            fontWeight: 'bold',
            fontFamily: 'Tinos',
            fontSize: '1rem',
            transition: 'all 0.3s ease'
          }}
          disabled={isSubmitting || registrationSuccess}
          onMouseOver={(e) => {
            if (!registrationSuccess && !isSubmitting) {
              e.target.style.backgroundColor = '#603311';
              e.target.style.color = '#DEB887';
            }
          }}
          onMouseOut={(e) => {
            if (!registrationSuccess && !isSubmitting) {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#603311';
            }
          }}
        >
          {registrationSuccess ? 'Registrazione completata!' :
            (isSubmitting ? 'Registrazione in corso...' : 'Registrati')}
        </button>
      </form>
    </div>
  );
};

export default RegistratiUtente;