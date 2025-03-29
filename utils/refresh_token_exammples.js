import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAuth } from './store';
import api from './api';

function App() {
  const dispatch = useDispatch();

  const checkAuth = async () => {
    try {
      await api.get('/auth/protected');
      dispatch(setAuth(true));
    } catch {
      dispatch(setAuth(false));
    }
  };

  const login = async () => {
    await api.post('/auth/login', { username: 'test', password: 'test' });
    await checkAuth();
  };

  const logout = async () => {
    await api.post('/auth/logout');
    dispatch(setAuth(false));
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default App;


import axios from 'axios';
import { store } from './store';
import { setAuth } from './store';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        await api.post('/auth/refresh-token');
        return api(original);
      } catch {
        store.dispatch(setAuth(false));
        return Promise.reject(err);
      }
    }
    return Promise.reject(err);
  }
);

export default api;


import { configureStore, createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: { isAuthenticated: false },
  reducers: {
    setAuth: (state, action) => { state.isAuthenticated = action.payload; }
  }
});

export const { setAuth } = authSlice.actions;

export const store = configureStore({ reducer: { auth: authSlice.reducer } });


const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password }); // Hash this in real apps

  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res
    .cookie('accessToken', accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 })
    .cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json({ message: 'Logged in' });
});

router.post('/refresh-token', async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) return res.sendStatus(403);

    const accessToken = generateAccessToken(user);
    res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 }).json({ message: 'Refreshed' });
  } catch {
    return res.sendStatus(403);
  }
});

router.post('/logout', async (req, res) => {
  const user = await User.findOne({ refreshToken: req.cookies.refreshToken });
  if (user) {
    user.refreshToken = null;
    await user.save();
  }
  res.clearCookie('accessToken').clearCookie('refreshToken').json({ message: 'Logged out' });
});

const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.sendStatus(401);
  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = user;
    next();
  } catch {
    return res.sendStatus(403);
  }
};

router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Access granted', user: req.user });
});

module.exports = router;

