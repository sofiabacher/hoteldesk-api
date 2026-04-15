import React, { useState, useEffect } from 'react'
import { Box, Typography, Container, Paper, Avatar, Rating, Card, CardContent, CardMedia, Button, Chip, Stack, Skeleton } from '@mui/material'
import { FormatQuote as QuoteIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axiosConfig'
import { motion } from 'framer-motion'

import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import RoomGallery from '../components/RoomGallery'
import RoomCard from '../components/RoomCard'
import SectionTitle from '../components/SectionTitle'
import { fadeInUp, staggerContainer, ROOMS, REVIEWS } from '../utils/constants'

import hero1 from '../assets/hero1.jpg'
import hero2 from '../assets/hero2.jpg'
import hero3 from '../assets/hero3.jpg'
import hotelImg from '../assets/hotelImg.jpg'


const Home = () => {
  const navigate = useNavigate()
  const [avatarUrl, setAvatarUrl] = useState(null)
  const images = [hero1, hero2, hero3]

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return  //Si no hay inicio de sesión, no ejecuta

    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users/profile')
        const user = response.data?.data?.user

        if (user?.photo) {
          setAvatarUrl(`http://localhost:3000${user.photo}`)
        }

      } catch (error) {
        console.error('Error al obtener la foto de perfil: ', error)
      }
    }
    fetchUserData()
  }, [])

  
  return (
    <Box sx={{ overflow: 'hidden' }}>
      <NavBar avatarUrl={avatarUrl} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <RoomGallery images={images} roomTitle="Hotel Brisas del Mar - Galería" height={{ xs: 300, sm: 400, md: 500 }} />
      </motion.div>

      <Box component={motion.section} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeInUp}
        sx={{ background: 'linear-gradient(135deg, #d2fadc 0%, #e8f5e9 100%)', py: { xs: 8, md: 14 }, position: 'relative', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '100%', backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M0 0h1v1H0z\" fill=\"%2329a374\" fill-opacity=\"0.03\"/%3E%3C/svg%3E')", opacity: 0.5 } }} >

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <SectionTitle color="#1b4d3e">Sobre nosotros</SectionTitle>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 4 }} >
            <Box sx={{ flex: 1 }}>
              <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} >
                <Typography variant="body1" sx={{ fontSize: { xs: 16, md: 18 }, lineHeight: 1.9, color: 'text.primary', mb: 2, textAlign: 'justify', paddingRight: { xs: 2, md: 0 } }} >
                  En <strong style={{ color: '#1b4d3e' }}>Hotel Brisas del Mar</strong> te
                  ofrecemos una experiencia única frente al océano. Disfrutá de habitaciones
                  modernas, vistas panorámicas, gastronomía de autor y un ambiente cálido que
                  te hará sentir como en casa.
                </Typography>

                <Typography variant="body1" sx={{ fontSize: { xs: 16, md: 18 }, lineHeight: 1.9, color: 'text.primary', textAlign: 'justify', paddingRight: { xs: 2, md: 0 } }} >
                  Nuestro compromiso es brindarte <strong>confort</strong>,{' '}
                  <strong>tranquilidad</strong> y <strong>atención personalizada</strong>{' '}
                  durante toda tu estadía.
                </Typography>
              </motion.div>
            </Box>

            <Box sx={{ flex: 1, display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }} >
              <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} >
                <Box component="img" src={hotelImg} alt="Hotel Brisas del Mar" sx={{ width: '100%', maxWidth: 400, height: 'auto', borderRadius: 3, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', transition: 'transform 0.4s ease', '&:hover': { transform: 'scale(1.03)' } }} />
              </motion.div>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box sx={{ height: 100, background: 'linear-gradient(to bottom, #e8f5e9 0%, #ffffff 100%)' }} />

      <Container component={motion.section} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={staggerContainer} maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }} >
        <SectionTitle subtitle="Elegí entre nuestra selección de habitaciones diseñadas para tu máximo confort">
          Nuestras habitaciones
        </SectionTitle>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: { xs: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 3, md: 4 }, width: '100%', flexWrap: { xs: 'wrap', md: 'nowrap' }, maxWidth: { md: '1100px' } }}>
            {ROOMS.slice(0, 3).map((room) => (
              <Box key={room.title} sx={{ flex: { xs: '1 1 300px', md: '0 0 350px' }, maxWidth: { xs: '100%', md: 350 }, minWidth: { xs: 280, md: 350 } }}>
                <RoomCard room={room} />
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 3, md: 4 }, width: '100%', flexWrap: { xs: 'wrap', md: 'nowrap' }, maxWidth: { md: '732px' } }}>
            {ROOMS.slice(3, 5).map((room) => (
              <Box key={room.title} sx={{ flex: { xs: '1 1 300px', md: '0 0 350px' }, maxWidth: { xs: '100%', md: 350 }, minWidth: { xs: 280, md: 350 } }}>
                <RoomCard room={room} />
              </Box>
            ))}
          </Box>
        </Box>
      </Container>

      <Box sx={{ height: 100, background: 'linear-gradient(to bottom, #ffffff 0%, #fef3e2 100%)' }} />

      <Box component={motion.section} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={staggerContainer} sx={{ background: 'linear-gradient(135deg, #fef3e2 0%, #fff7ed 100%)', py: { xs: 8, md: 14 }, position: 'relative' }} >
        <Container maxWidth="lg">
          <SectionTitle color="#1b4d3e">Reseñas de nuestros huéspedes</SectionTitle>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4, mt: 4 }}>
            {REVIEWS.map((review, index) => (
              <Box key={index} sx={{ flex: { xs: '1 1 300px', md: '0 0 345px' }, maxWidth: { xs: '100%', md: 345 } }}>
                <motion.div variants={fadeInUp} whileHover={{ y: -10 }} transition={{ duration: 0.3 }}  >
                  <Paper elevation={0} sx={{ p: 4, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', backgroundColor: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid', borderColor: 'rgba(245, 158, 11, 0.15)', position: 'relative', transition: 'all 0.3s ease', '&:hover': { boxShadow: '0 12px 35px rgba(245, 158, 11, 0.25)', borderColor: 'secondary.main' } }} >
                    <QuoteIcon sx={{ position: 'absolute', top: 16, left: 16, fontSize: 48, color: 'secondary.main', opacity: 0.15 }} />

                    <Avatar src={review.avatar} alt={review.name} sx={{ width: 85, height: 85, mb: 2.5, border: '4px solid', borderColor: 'secondary.main', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)' }} />

                    <Typography variant="h6" fontWeight="bold" sx={{ color: 'primary.dark', mb: 1.5, fontSize: '1.15rem' }} >
                      {review.name}
                    </Typography>

                    <Rating value={review.stars} readOnly sx={{ mb: 2.5, '& .MuiRating-iconFilled': { color: 'secondary.main' }, '& .MuiRating-icon': { fontSize: '1.4rem' } }} />

                    <Typography variant="body2" sx={{ fontSize: 15, color: 'text.secondary', lineHeight: 1.8, fontStyle: 'italic' }} >
                      "{review.comment}"
                    </Typography>
                  </Paper>
                </motion.div>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  )
}

export default Home
