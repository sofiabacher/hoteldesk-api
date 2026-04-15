import { Card, CardContent, CardMedia, Typography, Chip, Stack, Box, Button } from '@mui/material'
import { motion } from 'framer-motion'

import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import WifiIcon from '@mui/icons-material/Wifi'
import TvIcon from '@mui/icons-material/Tv'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import LocalBarIcon from '@mui/icons-material/LocalBar'
import KingBedIcon from '@mui/icons-material/KingBed'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import HotTubIcon from '@mui/icons-material/HotTub'
import BalconyIcon from '@mui/icons-material/Balcony'
import GroupIcon from '@mui/icons-material/Group'
import LocalCafeIcon from '@mui/icons-material/LocalCafe'
import WorkIcon from '@mui/icons-material/Work'

import { useNavigate } from 'react-router-dom'
import { fadeInUp } from '../utils/constants'

//Icon mapping for amenities
const amenityIcons = {
  'wifi': <WifiIcon />, 'tv': <TvIcon />, 'ac': <AcUnitIcon />, 'minibar': <LocalBarIcon />,
  'premium-furniture': <KingBedIcon />, 'coffee-machine': <LocalCafeIcon />, 'balcony': <BalconyIcon />,
  'work-desk': <MeetingRoomIcon />, 'printer': <WorkIcon />, 'meeting-area': <MeetingRoomIcon />,
  'smart-board': <WorkIcon />, 'video-conference': <TvIcon />, 'lounge-access': <GroupIcon />,
  'jacuzzi': <HotTubIcon />, 'extra-beds': <GroupIcon />, 'kid-friendly': <GroupIcon />,
  'game-console': <TvIcon />, 'dining-area': <GroupIcon />, 'separate-living': <KingBedIcon />,
  'private-terrace': <BalconyIcon />, 'play-area': <GroupIcon />,'private-elevator': <GroupIcon />,
  'spa-bathroom': <HotTubIcon />, 'WiFi Gratis': <WifiIcon />, 'Smart TV': <TvIcon />,
  'Aire Acondicionado': <AcUnitIcon />, 'Minibar': <LocalBarIcon />, 'Balcón': <BalconyIcon />,
  'Escritorio de Trabajo': <MeetingRoomIcon />, 'Jacuzzi': <HotTubIcon />, 'Camas Adicionales': <GroupIcon />,
  'Amigable para Niños': <GroupIcon />, 'Consola de Juegos': <TvIcon />, 'Área de Comedor': <GroupIcon />,
  'Sala Separada': <KingBedIcon />, 'Cocina Equipada': <LocalBarIcon />, 'Sala de Estar': <KingBedIcon />, 
  'Servicio de Mayordomo': <GroupIcon />, 'Terraza Privada': <BalconyIcon />, 'Impresora': <WorkIcon />,
  'Área de Reuniones': <MeetingRoomIcon />, 'Pizarra Inteligente': <WorkIcon />, 'Videoconferencias': <TvIcon />,
  'Acceso a Lounge': <GroupIcon />, 'Área de Juegos': <GroupIcon />, 'Elevador Privado': <GroupIcon />, 'Baño Spa': <HotTubIcon />
}

const getAmenityIcon = (amenity) => { 
  return amenityIcons[amenity] || <span>✓</span>
}

const RoomCard = ({ room }) => {
  const navigate = useNavigate()

  return (
    <motion.div variants={fadeInUp}><Card component="article" sx={{ height:'100%', display:'flex',  flexDirection:'column', borderRadius:3, overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.08)', transition:'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', position:'relative', minHeight:500, cursor:'pointer',
        '&:hover': { boxShadow: '0 12px 40px rgba(41, 163, 116, 0.2)', transform: 'translateY(-12px)', '& .overlay': { opacity: 1 }, '& .room-image': { transform: 'scale(1.15)'}}, 
        '&:focus-visible': { outline: '3px solid', outlineColor: 'primary.main', outlineOffset: '2px' } }}
        tabIndex={0} role="button" aria-label={`Ver todas las habitaciones`}
        onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate('/rooms')
          }
        }}
      >

        <Box sx={{ position: 'relative', overflow: 'hidden', height: 240 }}>
          <CardMedia component="img" height="240" image={room.image} alt={`Imagen de ${room.title}`} className="room-image" sx={{ transition: 'transform 0.6s ease', objectFit: 'cover' }} />
          <Chip label={`Desde ${room.price}/noche`} sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'secondary.main', color: 'white', fontWeight: 700, fontSize: '0.9rem', boxShadow: 3 }} />
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: 'primary.main', fontSize: { xs: '1.25rem', md: '1.4rem' }, mb: 1.5 }}>{room.title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '0.95rem', mb: 2 }}>{room.description}</Typography>
          
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {room.features.map((feature, idx) => (
              <Chip key={idx} icon={getAmenityIcon(feature)} label={feature} size="small" variant="outlined"
                sx={{ borderColor: 'primary.light', color: 'primary.main', fontWeight: 500, '& .MuiChip-icon': { color: 'primary.main', fontSize: '0.9rem' } }} />
            ))}
          </Stack>

        </CardContent>
      </Card>
    </motion.div>
  )
}

export default RoomCard