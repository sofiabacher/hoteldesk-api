import React, { useState } from 'react'
import { Box, CardMedia, IconButton, Dialog, DialogContent, Chip } from '@mui/material'
import { ArrowBackIos as ArrowBackIcon, ArrowForwardIos as ArrowForwardIcon, Close as CloseIcon, ZoomIn as ZoomInIcon, PhotoLibrary as GalleryIcon } from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'

const RoomGallery = ({ images, roomTitle, onImageClick, height = { xs: 200, sm: 220, md: 240 } }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleNextImage = () => { setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length) }
  const handlePrevImage = () => { setCurrentImageIndex((prevIndex) => prevIndex === 0 ? images.length - 1 : prevIndex - 1 ) }
  const handleImageClick = () => { setIsDialogOpen(true) }
  const handleCloseDialog = () => { setIsDialogOpen(false) }
  const handleThumbnailClick = (index) => { setCurrentImageIndex(index) }

  return (
    <>
      <Box sx={{ position: 'relative', height: height, overflow: 'hidden', borderRadius: 2, cursor: 'pointer', bgcolor: 'grey.100' }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={onImageClick}>
        <AnimatePresence mode="wait">
          <motion.div key={currentImageIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} style={{ height: '100%' }}>
           <CardMedia component="img" image={images[currentImageIndex]} alt={`${roomTitle} - Imagen ${currentImageIndex + 1}`}
              sx={{ height: '100%', width: '100%', objectFit: 'cover', transition: 'transform 0.3s ease', transform: isHovered ? 'scale(1.05)' : 'scale(1)' }} />
          </motion.div>
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <IconButton onClick={(e) => { e.stopPropagation(); handlePrevImage(); }} sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255, 255, 255, 0.9)', color: 'primary.main', opacity: isHovered ? 1 : 0.7, transition: 'all 0.2s ease',
              '&:hover': { bgcolor: 'white', opacity: 1, transform: 'translateY(-50%) scale(1.1)' }, zIndex: 2 }} size="small" >
              <ArrowBackIcon />
            </IconButton>

            <IconButton onClick={(e) => { e.stopPropagation(); handleNextImage(); }} sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255, 255, 255, 0.9)', color: 'primary.main', opacity: isHovered ? 1 : 0.7, transition: 'all 0.2s ease',
              '&:hover': { bgcolor: 'white', opacity: 1, transform: 'translateY(-50%) scale(1.1)' }, zIndex: 2 }} size="small" >
              <ArrowForwardIcon />
            </IconButton>
          </>
        )}

        <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', alignItems: 'center', gap: 1, zIndex: 2 }}>
          {images.length > 1 && (
            <Chip icon={<GalleryIcon fontSize="small" />} label={`${currentImageIndex + 1}/${images.length}`} size="small" sx={{ bgcolor: 'rgba(0, 0, 0, 0.7)', color: 'white', '& .MuiChip-icon': { color: 'white' } }} />
          )}

          <IconButton onClick={(e) => { e.stopPropagation(); handleImageClick(); }} sx={{ bgcolor: 'rgba(255, 255, 255, 0.9)', color: 'primary.main', opacity: isHovered ? 1 : 0.7, transition: 'all 0.2s ease', '&:hover': { bgcolor: 'white', opacity: 1 } }} size="small">
            <ZoomInIcon fontSize="small" />
          </IconButton>
        </Box>

        {images.length > 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4, padding: '4px', backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: '8px', zIndex: 2 }}>
            {images.map((_, index) => (
              <Box key={index} onClick={(e) => { e.stopPropagation(); handleThumbnailClick(index); }} sx={{ width: 32, height: 24, borderRadius: 2, overflow: 'hidden', cursor: 'pointer', border: currentImageIndex === index ? '2px solid white' : '2px solid transparent', opacity: currentImageIndex === index ? 1 : 0.7, transition: 'all 0.2s ease' }}>
                <CardMedia component="img" image={images[index]} alt={`Thumbnail ${index + 1}`} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            ))}
          </motion.div>
        )}
      </Box>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="lg" fullWidth PaperProps={{ sx: { bgcolor: 'transparent', boxShadow: 'none', overflow: 'hidden' } }}>
        <DialogContent sx={{ p: 0, position: 'relative', bgcolor: 'black' }}>
          <IconButton onClick={handleCloseDialog} sx={{ position: 'absolute', top: 16, right: 16, zIndex: 3, bgcolor: 'rgba(255, 255, 255, 0.9)', color: 'primary.main', '&:hover': { bgcolor: 'white' } }}>
            <CloseIcon />
          </IconButton>

          <Box sx={{ position: 'relative', height: { xs: '70vh', md: '80vh' } }}>
            <AnimatePresence mode="wait">
              <motion.div key={currentImageIndex} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.3 }} style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CardMedia component="img" image={images[currentImageIndex]} alt={`${roomTitle} - Imagen ${currentImageIndex + 1}`} sx={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
              </motion.div>
            </AnimatePresence>

            {images.length > 1 && (
              <>
                <IconButton onClick={handlePrevImage} sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255, 255, 255, 0.9)', color: 'primary.main', '&:hover': { bgcolor: 'white' }, zIndex: 2 }}>
                  <ArrowBackIcon />
                </IconButton>

               <IconButton onClick={handleNextImage} sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255, 255, 255, 0.9)', color: 'primary.main', '&:hover': { bgcolor: 'white' }, zIndex: 2 }}>
                  <ArrowForwardIcon />
                </IconButton>
              </>
            )}

            <Box sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', bgcolor: 'rgba(0, 0, 0, 0.7)', color: 'white', px: 2, py: 1, borderRadius: 2, typography: 'body2', zIndex: 2 }}>
              {currentImageIndex + 1} / {images.length}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default RoomGallery