import React, { useState, useEffect } from 'react'
import { Box, Typography, Container, Grid, Card, CardContent, Button, Chip, Stack, Divider, Paper, List, ListItem, ListItemIcon, ListItemText, Rating, IconButton, Alert, Skeleton } from '@mui/material';
import { ArrowBack as ArrowBackIcon, People as PeopleIcon, KingBed as KingBedIcon, AttachMoney as PriceIcon, Star as StarIcon, CheckCircle as CheckIcon, CalendarToday as CalendarIcon, LocalOffer as OfferIcon,
  LocationOn as LocationIcon, Wifi as WifiIcon, Tv as TvIcon, AcUnit as AcUnitIcon, LocalBar as LocalBarIcon, Balcony as BalconyIcon, MeetingRoom as MeetingRoomIcon, HotTub as HotTubIcon, Group as GroupIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'

import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import RoomGallery from '../components/RoomGallery'
import { fadeInUp } from '../utils/constants'
import axios from '../utils/axiosConfig'

// Icon mapping for features
const featureIcons = {
  'WiFi Gratis': <WifiIcon />,
  'Smart TV': <TvIcon />,
  'Aire Acondicionado': <AcUnitIcon />,
  'Minibar': <LocalBarIcon />,
  'Balcón': <BalconyIcon />,
  'Escritorio de Trabajo': <MeetingRoomIcon />,
  'Jacuzzi': <HotTubIcon />,
  'Camas Adicionales': <GroupIcon />
}

const RoomDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchRoomData = async () => {
      try {
        if (!isMounted) return
        setLoading(true)
        setError(null)

        const response = await axios.get(`http://localhost:3000/rooms/${id}`)

        const foundRoom = response.data?.data

        if (foundRoom && isMounted) {
          const transformedRoom = {
            id: foundRoom.id,
            title: foundRoom.name || 'Habitación',
            description: foundRoom.description || 'Habitación cómoda y moderna',
            price: foundRoom.price ? `$${foundRoom.price}` : '$100',
            images: foundRoom.image ? [foundRoom.image] : [`http://localhost:3000/uploads/rooms/default.jpg`],
            capacity: foundRoom.capacity || 2,
            size: foundRoom.size || '30m²',
            bedType: foundRoom.beds || 'Cama King Size',
            view: 'Vista a la ciudad',
            additionalFeatures: foundRoom.amenities ? (Array.isArray(foundRoom.amenities) ? foundRoom.amenities : []) : ['WiFi Gratis', 'TV de Pantalla Plana'],
            features: foundRoom.amenities ? (Array.isArray(foundRoom.amenities) ? foundRoom.amenities : ['WiFi Gratis', 'Aire Acondicionado']) : ['WiFi Gratis', 'Aire Acondicionado'],
            rating: 4.5,
            reviews: 128,
            policies: [
              'Check-in: 15:00 - 23:00',
              'Check-out: 07:00 - 12:00',
              'No se permiten mascotas',
              'Prohibido fumar en la habitación'
            ],
            highlights: [
              'WiFi de alta velocidad',
              'Servicio de limpieza diario',
              'Acceso a piscina y gimnasio',
              'Desayuno continental incluido'
            ]
          }

          setRoom(transformedRoom)

        } else if (isMounted) {
          setError('No se encontró la habitación solicitada')
        }

      } catch (error) {
        if (isMounted) setError('No se pudieron cargar los detalles de la habitación. Por favor, intenta nuevamente.')

      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchRoomData()
    return () => { isMounted = false }

  }, [id])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

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

  if (loading) {
    return (
      <Box>
        <NavBar avatarUrl={avatarUrl} />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Skeleton variant="rectangular" height={400} sx={{ mb: 3, borderRadius: 2 }} />
          <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
          <Skeleton variant="text" height={100} sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}> <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} /> </Grid>
            <Grid item xs={12} md={4}> <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} /> </Grid>
          </Grid>
        </Container>
      </Box>
    )
  }

  if (error) {
    return (
      <Box>
        <NavBar avatarUrl={avatarUrl} />
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>

          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => navigate('/rooms')} sx={{ px: 4 }}>
              Volver a todas las habitaciones
            </Button>

            <Button variant="outlined" onClick={() => window.location.reload()} sx={{ ml: 2, px: 4 }}>
              Reintentar
            </Button>
          </Box>
        </Container>

        <Footer />
      </Box>
    )
  }

  if (!room) {
    return (
      <Box>
        <NavBar avatarUrl={avatarUrl} />
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 4 }}> No se encontró la habitación solicitada </Alert>
          <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => navigate('/rooms')} sx={{ px: 4 }}>
            Volver a todas las habitaciones
          </Button>
        </Container>
        <Footer />
      </Box>
    )
  }

  return (
    <Box sx={{ overflow: 'hidden' }}>
      <NavBar avatarUrl={avatarUrl} />

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/rooms')} sx={{ mb: 2 }}>
          Volver a todas las habitaciones
        </Button>
      </Container>

      <Container maxWidth="lg" sx={{ mb: 4 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <RoomGallery images={room.images} roomTitle={room.title} height={{ xs: 250, sm: 350, md: 450, lg: 500 }} />
        </motion.div>
      </Container>

      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Grid container spacing={{ xs: 4, md: 6 }}>
          <Grid item xs={12} md={7}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <Box sx={{ mb: 5 }}>
                <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom sx={{ color: 'primary.main', mb: 3, fontSize: { xs: '2rem', md: '2.5rem' }, lineHeight: 1.2 }}>
                  {room.title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4, pb: 3, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Rating value={room.rating} precision={0.1} readOnly size="large" />
                    <Typography variant="h5" fontWeight="bold" color="primary.main">
                      {room.rating}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem' }}>
                    {room.reviews} reseñas de huéspedes
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 6 }}>
                <Typography variant="body1" sx={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'text.secondary', textAlign: 'justify', letterSpacing: 0.2 }}>
                  {room.description}
                </Typography>
              </Box>

              <Box sx={{ mb: 6 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: 'primary.main', mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 4, height: 32, bgcolor: 'primary.main', borderRadius: 2 }} /> Información Esencial
                </Typography>

                <Paper elevation={1} sx={{ p: 4, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', background: 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)' }}>
                  <Grid container spacing={3}>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <PeopleIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                        <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}> Capacidad </Typography>
                        
                        <Typography variant="body1" color="text.secondary">
                          {room.capacity} Huéspedes
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <KingBedIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                        <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}> Tipo de Cama </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {room.bedType}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <PriceIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                        <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}> Tamaño </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {room.size}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <LocationIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                        <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}> Vista </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {room.view}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>

              <Box sx={{ mb: 6 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: 'primary.main', mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 4, height: 32, bgcolor: 'primary.main', borderRadius: 2 }} /> Destacados de la Habitación
                </Typography>

                <Paper elevation={1} sx={{ p: 4, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)' }}>
                  <Grid container spacing={2}>
                    {room.highlights.map((highlight, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', bgcolor: 'success.light', color: 'white' }}>
                            <CheckIcon sx={{ fontSize: 18 }} />
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}> {highlight} </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Box>

              <Box sx={{ mb: 6 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: 'primary.main', mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 4, height: 32, bgcolor: 'primary.main', borderRadius: 2 }} /> Características Principales
                </Typography>

                <Paper elevation={1} sx={{ p: 4, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
                  <Grid container spacing={2}>
                    {room.features.map((feature, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                          <Box sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                            {featureIcons[feature] || <CheckIcon />}
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: 400 }}> {feature}  </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Box>

              <Box sx={{ mb: 6 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: 'primary.main', mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 4, height: 32, bgcolor: 'primary.main', borderRadius: 2 }} /> Comodidades Adicionales
                </Typography>

                <Paper elevation={1} sx={{ p: 4, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)' }}>
                  <Grid container spacing={2}>
                    {room.additionalFeatures.map((feature, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', bgcolor: 'primary.light', color: 'white' }}>
                            <CheckIcon sx={{ fontSize: 16 }} />
                          </Box>
                          <Typography variant="body1" sx={{ fontSize: '0.95rem' }}> {feature} </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Box>

              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: 'primary.main', mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 4, height: 32, bgcolor: 'primary.main', borderRadius: 2 }} /> Políticas de la Habitación
                </Typography>

                <Paper elevation={1} sx={{ p: 4, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
                  <Grid container spacing={2}>
                    {room.policies.map((policy, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, py: 1 }}>
                          <CalendarIcon sx={{ color: 'primary.main', fontSize: 20, mt: 0.5 }} />
                          <Typography variant="body1" sx={{ fontSize: '0.95rem' }}> {policy} </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </Box>
  )
}

export default RoomDetail