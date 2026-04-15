import React, { useState, useEffect } from 'react'
import { Box, Typography, Container, Grid, Card, CardContent, CardMedia, Chip, Button, Accordion, AccordionSummary, AccordionDetails, Rating, Stack, Divider, Paper, Select, MenuItem, FormControl, InputLabel, CircularProgress, Alert } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, People as PeopleIcon, KingBed as KingBedIcon, AttachMoney as PriceIcon, Star as StarIcon, FilterList as FilterIcon } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import SectionTitle from '../components/SectionTitle'
import RoomGallery from '../components/RoomGallery'
import { fadeInUp, staggerContainer } from '../utils/constants'
import axios from '../utils/axiosConfig'

const Rooms = () => {
  const navigate = useNavigate()
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const initializeData = async () => {
      const token = localStorage.getItem('token')
      if (token) {
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

      try {
        setLoading(true)
        setError(null)

        const response = await axios.get('http://localhost:3000/rooms/')

        let roomsData = []
        if (response.data && response.data.data && response.data.data.roomsByType) {
          response.data.data.roomsByType.forEach(roomType => {
            if (roomType.allRooms && Array.isArray(roomType.allRooms)) {
              roomsData = roomsData.concat(roomType.allRooms)
            }
          })
        }

        const transformedRooms = roomsData.map(room => ({
          id: room.id,
          title: room.name || 'Habitación',
          description: room.description || 'Habitación cómoda y moderna',
          price: room.price ? `$${room.price}` : '$100',
          images: room.image ? [room.image] : [`http://localhost:3000/uploads/rooms/default.jpg`],
          capacity: room.capacity || 2,
          size: room.size || '30m²',
          bedType: room.beds || 'Cama King Size',
          view: 'Vista a la ciudad',
          additionalFeatures: room.amenities ? (Array.isArray(room.amenities) ? room.amenities : []) : ['WiFi Gratis', 'TV de Pantalla Plana'],
          features: room.amenities ? (Array.isArray(room.amenities) ? room.amenities : ['WiFi Gratis', 'Aire Acondicionado']) : ['WiFi Gratis', 'Aire Acondicionado'],
          rating: 4.5,
          reviews: 128
        }))

        setRooms(transformedRooms)
        setLoading(false)

      } catch (error) {
        setError('No se pudieron cargar las habitaciones. Por favor, intenta nuevamente.')
        setLoading(false)
      }
    }

    initializeData()
  }, [])

  const handleRoomClick = (roomId) => {
    navigate(`/rooms/${roomId}`)
  }

  return (
    <Box sx={{ overflow: 'hidden', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <NavBar avatarUrl={avatarUrl} />

      <Container component={motion.section} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={staggerContainer} maxWidth="lg" sx={{ py: '120px', px: { xs: 2, sm: 3, md: 4 } }}>
        <SectionTitle subtitle="Descubrí el espacio perfecto para tu estadía"> Nuestras Habitaciones </SectionTitle>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        )}

        {error && (
          <Box sx={{ mb: 4 }}>
            <Alert severity="error" sx={{ mb: 2 }}> {error} </Alert>
            <Box sx={{ textAlign: 'center' }}>
              <Button variant="contained" onClick={() => {
                setError(null)
                setLoading(true)

                const fetchRooms = async () => {
                  try {
                    const response = await axios.get('http://localhost:3000/rooms/')
                    let roomsData = []
                    if (response.data && response.data.data && response.data.data.roomsByType) {
                      response.data.data.roomsByType.forEach(roomType => {
                        if (roomType.allRooms && Array.isArray(roomType.allRooms)) {
                          roomsData = roomsData.concat(roomType.allRooms)
                        }
                      })
                    }
                    const transformedRooms = roomsData.map(room => ({
                      id: room.id,
                      title: room.name || 'Habitación',
                      description: room.description || 'Habitación cómoda y moderna',
                      price: room.price ? `$${room.price}` : '$100',
                      images: room.image ? [room.image] : [`http://localhost:3000/uploads/rooms/default.jpg`],
                      capacity: room.capacity || 2,
                      size: room.size || '30m²',
                      bedType: room.beds || 'Cama King Size',
                      view: 'Vista a la ciudad',
                      additionalFeatures: room.amenities ? (Array.isArray(room.amenities) ? room.amenities : []) : ['WiFi Gratis', 'TV de Pantalla Plana'],
                      features: room.amenities ? (Array.isArray(room.amenities) ? room.amenities : ['WiFi Gratis', 'Aire Acondicionado']) : ['WiFi Gratis', 'Aire Acondicionado'],
                      rating: 4.5,
                      reviews: 128
                    }))
                    setRooms(transformedRooms)
                  } catch (error) {
                    setError('No se pudieron cargar las habitaciones. Por favor, intenta nuevamente.')
                  } finally {
                    setLoading(false)
                  }
                }
                fetchRooms()
              }}> Reintentar </Button>
            </Box>
          </Box>
        )}

        {!loading && !error && (
          <>
            {rooms.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No hay habitaciones disponibles en este momento.
                </Typography>
              </Box>
            )}

            {rooms.length > 0 && (
              <Grid container spacing={3} justifyContent="center" alignItems="stretch" sx={{ maxWidth: '1200px', margin: '0 auto' }}>
                {rooms.map((room, index) => (
                  <Grid xs={12} sm={6} key={`${room.id}-${index}`} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'stretch' }}>
                    <Card sx={{ height: '580px', width: '100%', maxWidth: '480px', borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', margin: '0 auto', '&:hover': { boxShadow: '0 12px 40px rgba(41, 163, 116, 0.15)', transform: 'translateY(-4px)' } }}>
                      <RoomGallery images={room.images && room.images.length > 0 ? room.images : ['https://via.placeholder.com/400x300/e3f2fd/1976d2?text=No+Image']}
                        roomTitle={room.title} onImageClick={() => handleRoomClick(room.id)}  height={{ xs: 300, sm: 310, md: 320 }} />

                      <CardContent sx={{ p: { xs: 2, sm: 2.5 }, display: 'flex', flexDirection: 'column', height: '240px', justifyContent: 'space-between' }}>
                        <Box sx={{ height: '125px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                            <Box>
                              <Typography variant="h6" fontWeight="bold" sx={{ color: 'primary.main', fontSize: { xs: '1rem', sm: '1.1rem' }, lineHeight: 1.2, height: '1.4em', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }} >
                                {room.title}
                              </Typography>

                              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.3, fontSize: '0.85rem', height: '3.2em', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                {room.description}
                              </Typography>
                            </Box>

                            <Box sx={{ textAlign: 'right' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Rating value={room.rating} precision={0.1} readOnly size="small" />
                                <Typography variant="caption" color="text.secondary">
                                  ({room.reviews})
                                </Typography>
                              </Box>
                            </Box>
                          </Box>

                          <Stack direction="row" spacing={1} sx={{ height: '26px', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                            <Chip icon={<PeopleIcon sx={{ fontSize: 14 }} />} label={`${room.capacity} Huéspedes`} size="small" variant="outlined" color="primary" sx={{ fontSize: '0.7rem', height: 24 }} />
                            <Chip icon={<KingBedIcon sx={{ fontSize: 14 }} />} label={room.bedType} size="small" variant="outlined" color="primary" sx={{ fontSize: '0.7rem', height: 24 }} />
                            <Chip icon={<PriceIcon sx={{ fontSize: 14 }} />} label={room.size} size="small" variant="outlined" color="primary" sx={{ fontSize: '0.7rem', height: 24 }} />
                          </Stack>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto', pt: 1 }}>
                          <Box>
                            <Typography variant="h6" color="primary.main" fontWeight="bold" sx={{ fontSize: '1rem' }}>
                              {room.price}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">por noche</Typography>
                          </Box>

                          <Button variant="contained" color="primary" size="small" onClick={() => handleRoomClick(room.id)}
                            sx={{ px: 2, py: 0.8, borderRadius: 2, fontWeight: 600, fontSize: '0.8rem', '&:hover': { transform: 'scale(1.02)' } }}
                          >
                            Ver Detalles
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Container>

      <Footer />
    </Box>
  )
}

export default Rooms