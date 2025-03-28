import React, { useState, useEffect } from 'react';

import { FaUserAlt, FaRegEdit, FaCamera } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';



const ModificaProfilo = () => {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',

    messaggio: '',
    foto: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);
  const [isVolontario, setIsVolontario] = useState(false);
  const navigate = useNavigate();



  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const userEmail = localStorage.getItem('email');

        if (!token || !userEmail) {
          throw new Error('Utente non autenticato');
        }

        const response = await fetch('http://localhost:8080/auth/getUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ email: userEmail })
        });

        if (!response.ok) {
          throw new Error('Errore nel caricamento del profilo');
        }

        const userData = await response.json();

        setIsVolontario(userData.ruolo === 'VOLONTARIO');



        setFormData({
          nome: userData.nome || '',
          cognome: userData.cognome || '',

          messaggio: userData.messaggio || '',
          foto: userData.foto || null
        });

        if (userData.foto) {
          setPreviewImage(`data:image/jpeg;base64,${userData.foto}`);
        }

        setInitialLoad(false);
      } catch (err) {
        console.error('Errore:', err);
        setError(err.message);
        setInitialLoad(false);
      }
    };

    loadProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);

      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        const base64String = fileReader.result.split(',')[1];
        setFormData(prev => ({
          ...prev,
          foto: base64String
        }));
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Utente non autenticato');
      }

      const payload = {
        nome: formData.nome,
        cognome: formData.cognome,
        email: localStorage.getItem("email"),
        messaggio: isVolontario ? formData.messaggio : '',
        foto: formData.foto || null,
        ruolo: isVolontario ? 'VOLONTARIO' : 'USER'
      };

      const response = await fetch('http://localhost:8080/auth/modifica', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Errore durante la modifica del profilo');
      }

      const data = await response.json();
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
      }

      setSuccess('Profilo modificato con successo!');
      setTimeout(() => navigate('/home'), 2000);

    } catch (err) {
      setError(err.message || 'Si è verificato un errore');
    }
  };

  if (initialLoad) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-white">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </div>
      </div>
    );
  }

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
          Modifica Profilo {isVolontario}
        </h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" role="alert">
            {success}
          </div>
        )}

        <div className="position-relative mb-4">
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={previewImage || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
              className="d-inline-block rounded-circle mb-2"
              style={{
                width: '200px',
                height: '200px',
                objectFit: 'cover',
                border: '2px solid #603311'
              }}
              alt="Profilo"
            />
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
                onChange={handleFileChange}
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
          />
          <FaUserAlt className='position-absolute start-0 top-50 translate-middle-y ms-3' style={{ color: '#603311' }} />
        </div>


        {isVolontario && (
          <div className='position-relative mb-3 '>
            <textarea
              name="messaggio"
              placeholder='Il tuo messaggio come volontario'
              className="w-100 ps-5 py-2"
              style={{
                color: '#603311',
                backgroundColor: 'transparent',
                border: '1px solid #603311',
                borderRadius: '5px',
                outline: 'none',
                fontFamily: 'Tinos',
                minHeight: '100px',
                resize: 'vertical'
              }}
              value={formData.messaggio}
              onChange={handleChange}
            />
            <FaRegEdit className='position-absolute start-0 top-20 translate-middle-y ms-3 mt-3' style={{ color: '#603311' }} />
          </div>
        )}



        <button
          type='submit'
          className="w-100 py-2 text-decoration-none"
          style={{
            color: '#603311',
            backgroundColor: 'transparent',
            border: '2px solid #603311',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontFamily: 'Tinos',
            fontSize: '1rem',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#603311';
            e.target.style.color = '#DEB887';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#603311';
          }}
        >
          Salva Modifiche
        </button>
      </form>
    </div>
  );
};

export default ModificaProfilo;