import React from 'react'
import { motion } from 'framer-motion'
import { Box, Card, CardContent, Typography, Button } from '@mui/material'
import { Assessment as AssessmentIcon, Download as DownloadIcon } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'

const ReportActions = ({ onGenerate, onExport, generating, hasData }) => {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card sx={{ mb: 4, background: 'linear-gradient(135deg, rgba(41, 163, 116, 0.05) 0%, rgba(41, 163, 116, 0.02) 100%)', border: '2px solid', borderColor: 'primary.main' }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="primary.main" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                        Generar Reporte
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                       <LoadingButton variant="contained" size="large" loading={generating} loadingPosition="start" startIcon={<AssessmentIcon />} onClick={onGenerate}
                           sx={{ minWidth: 180, fontWeight: 600, px: 4, backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }}
                        >
                            {generating ? 'Generando...' : 'Generar Reporte'}
                        </LoadingButton>

                        {hasData && (
                            <Button variant="outlined" size="large" startIcon={<DownloadIcon />} onClick={onExport}
                                sx={{ minWidth: 180, fontWeight: 600, px: 4, borderColor: 'primary.main', color: 'primary.main', '&:hover': { borderColor: 'primary.dark', backgroundColor: 'rgba(41, 163, 116, 0.04)' } }}
                            >
                                Exportar Datos
                            </Button>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default ReportActions