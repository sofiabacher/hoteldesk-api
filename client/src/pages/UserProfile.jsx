//UserProfile.jsx
import React, { useState, useEffect } from "react"
import { ROLES_LIST, ROLE_ROUTES, fadeInUp, staggerContainer } from "../utils/constants"
import { useNavigate } from "react-router-dom"
import { Container, Box, Button, Snackbar, Alert, Paper, Typography, Grid, Divider, Card, CardContent, Chip, Tab, Tabs, IconButton, Tooltip } from '@mui/material'
import { Person as PersonIcon, Lock as LockIcon, Group as GroupIcon, Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon, Info as InfoIcon } from '@mui/icons-material'
import { motion } from 'framer-motion'
import axios from '../utils/axiosConfig'

import NavBar from "../components/Navbar"
import Footer from '../components/Footer'
import AvatarUploader from "../components/AvatarUploader"
import ProfileForm from "../components/ProfileForm"
import PasswordForm from "../components/PasswordForm"
import RolesModal from "../components/RolesModal"
import SectionTitle from '../components/SectionTitle'


const convertDateToDisplay = (dateString) => {  // Función para convertir fecha de YYYY-MM-DD a DD-MM-YYYY
    if (!dateString) return ""
    const [year, month, day] = dateString.split('-')
    return `${day}-${month}-${year}`
}

const convertDateToBackend = (dateString) => {  // Función para convertir fecha de DD-MM-YYYY a YYYY-MM-DD
    if (!dateString) return ""
    const [day, month, year] = dateString.split('-')
    return `${year}-${month}-${day}`
}

function TabPanel({ children, value, index }) {
    return (
        <div hidden={value !== index} style={{ width: '100%' }}>
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    )
}


const UserProfile = () => {
    const [profile, setProfile] = useState({ name: "", lastName: "", email: "", phone: "", birthdate: "", dni: "", photo: "" })
    const [profileErrors, setProfileErrors] = useState({})

    const [currentTab, setCurrentTab] = useState(0)
    const navigate = useNavigate()

    const [passwordData, setPasswordData] = useState({ password: "", confirmPassword: "" })
    const [passwordErrors, setPasswordErrors] = useState({})
    const [showPassword, setShowPassword] = useState(true)
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(true)

    const [roles, setRoles] = useState([])
    const [rolesModalOpen, setRolesModalOpen] = useState(false)

    const [snackbarOpen, setOpenSnackbar] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [snackbarSeverity, setSnackbarSeverity] = useState("info")

    const showSnackbar = (message, severity = 'success') => {
        setSnackbarMessage(message)
        setSnackbarSeverity(severity)
        setOpenSnackbar(true)
    }

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                console.log('Fetching user profile...')
                const { data } = await axios.get('http://localhost:3000/users/profile')
                const user = data.data.user
                console.log('User data:', user)
                console.log('User.Roles:', user.Roles)

                const avatarUrl = user.photo ? `http://localhost:3000${user.photo}` : ""

                setProfile({
                    name: user.name,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone || "",
                    birthdate: convertDateToDisplay(user.birthdate) || "",
                    dni: user.dni || "",
                    photo: avatarUrl
                })

                const userRoles = user.Roles?.map(r => {
                    const roleObj = ROLES_LIST.find(role => role.id === r.id)
                    return roleObj ? roleObj : { id: r.id, name: r.name }
                }) || []

                console.log('Processed roles:', userRoles)
                setRoles(userRoles)
            } catch (error) {
                console.error('Error fetching profile:', error)
                const msg = error?.response?.data?.message || "Error al cargar el perfil de usuario"
                showSnackbar(msg, "error")
            }
        }

        fetchUserProfile()
    }, [])

    const validateProfile = () => {
        let temp = {}
        let isValid = true

        const phoneRegex = /^[0-9]{10}$/
        const dateRegex = /^\d{2}-\d{2}-\d{4}$/
        const dniRegex = /^[0-9]{7,8}$/

        if (!profile.name.trim()) { temp.name = "Debe ingresar su nombre"; isValid = false }
        if (!profile.lastName.trim()) { temp.lastName = "Debe ingresar su apellido"; isValid = false }
        if (profile.phone && !phoneRegex.test(profile.phone)) { temp.phone = "El teléfono debe tener 10 dígitos"; isValid = false }
        if (profile.birthdate && !dateRegex.test(profile.birthdate)) { temp.birthdate = "Formato inválido (DD-MM-YYYY)"; isValid = false }
        if (profile.dni && !dniRegex.test(profile.dni)) { temp.dni = "El DNI debe tener entre 7 y 8 dígitos"; isValid = false }

        setProfileErrors(temp)
        return isValid
    }

    const validatePassword = (pwd, confirmPassword) => {
        let temp = { password: "", confirmPassword: "" }
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/

        if (!pwd) temp.password = "Debe ingresar la nueva contraseña"
        else if (!regex.test(pwd)) temp.password = "Contraseña: mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial"

        if (!confirmPassword) temp.confirmPassword = "Confirme la contraseña"
        else if (pwd !== confirmPassword) temp.confirmPassword = "Las contraseñas no coinciden"

        setPasswordErrors(temp)
        return !temp.password && !temp.confirmPassword
    }

    const handleProfileChange = (field, value) => {
        setProfile((prev) => ({ ...prev, [field]: value }))
    }

    const handleProfileSubmit = async (e) => {
        e.preventDefault()
        if (!validateProfile()) return

        const payload = {}
        if (profile.name?.trim()) payload.name = profile.name.trim()
        if (profile.lastName?.trim()) payload.lastName = profile.lastName.trim()
        if (profile.phone?.trim()) payload.phone = profile.phone.trim()
        if (profile.dni?.trim()) payload.dni = profile.dni.trim()
        if (profile.birthdate?.trim()) {
            payload.birthdate = convertDateToBackend(profile.birthdate.trim())
        }

        try {
            const response = await axios.put('http://localhost:3000/users/profile', payload)
            showSnackbar(response.data.message, "success")

        } catch (error) {
            const msg = error?.response?.data?.message || "Error al actualizar los datos"
            showSnackbar(msg, "error")
        }
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        if (!validatePassword(passwordData.password, passwordData.confirmPassword)) return

        try {
            const response = await axios.put('http://localhost:3000/users/password', {
                newPassword: passwordData.password,
                confirmPassword: passwordData.confirmPassword
            })

            showSnackbar(response.data.message, "success")
            setPasswordData({ password: "", confirmPassword: "" })
            setShowPassword(true)
            setShowPasswordConfirm(true)

        } catch (error) {
            const msg = error?.response?.data?.message || "Error al cambiar la contraseña"
            showSnackbar(msg, "error")
        }
    }

    const handlePhotoChange = (url) => { setProfile((prev) => ({ ...prev, photo: url })) }

    const handleRoleSelect = async (roleName) => {
        try {
            const roleObject = roles.find(r => r.name === roleName)
            if (!roleObject) return showSnackbar("Rol inválido", "error")

            const response = await axios.put('http://localhost:3000/users/switch-role', { roleId: roleObject.id })
            showSnackbar(response.data?.message, "success")
            setRolesModalOpen(false)

            const newToken = response.data.data.newRoleToken
            localStorage.setItem('token', newToken)

            const roleMap = {
                'huésped': 'guest',
                'administrador': 'admin',
                'recepcionista': 'recepcionist',
                'limpieza': 'cleaning'
            }

            const roleKey = roleMap[roleObject.name.toLowerCase()] || roleObject.name.toLowerCase()

            setTimeout(() => {
                const route = ROLE_ROUTES[roleKey] || '/profile'
                navigate(route)
            }, 2000)
            
        } catch (error) {
            const msg = error?.response?.data?.message || "Error al cambiar de rol"
            showSnackbar(msg, "error")
        }
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: '#f5f5f5' }}>
            <NavBar avatarUrl={profile.photo} />

            <Container maxWidth="lg" sx={{ paddingTop: 14, paddingBottom: 8, flexGrow: 1 }}>
                <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                    <motion.div variants={fadeInUp}>
                        <SectionTitle subtitle="Gestiona tu información personal y configuración de cuenta"> Mi Perfil </SectionTitle>
                    </motion.div>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={5}>
                            <motion.div variants={fadeInUp}>
                                <Paper elevation={3} sx={{
                                    p: 2.5, borderRadius: 3, textAlign: 'center', background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)', position: 'relative', overflow: 'hidden', height: 'fit-content',
                                    '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #29a374 0%, #F59E0B 100%)' }
                                }} >

                                    <AvatarUploader currentPhoto={profile.photo} onPhotoChange={handlePhotoChange} showSnackbar={showSnackbar} />

                                    <Typography variant="h5" fontWeight="bold" sx={{ mt: 2, mb: 0.5 }}>
                                        {profile.name} {profile.lastName}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}> {profile.email} </Typography>

                                    <Divider sx={{ my: 3 }} />

                                    <Box sx={{ mb: 1 }}>
                                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.70rem' }}>
                                            Mis Roles
                                        </Typography>

                                        <Box sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 0.5,
                                        maxWidth: '100%',
                                        '& > *': {
                                            minWidth: '45%',  // Cada chip ocupará máximo 45% del ancho
                                            flex: '1 1 45%',  // Permite hasta 2 items por fila
                                            maxWidth: '48%'  // Previene que se estiren demasiado
                                        }
                                    }}>
                                            {roles.map((role, index) => (
                                                <Chip
                                                    key={index}
                                                    label={role.name}
                                                    color="primary"
                                                    size="small"
                                                    sx={{
                                                        fontSize: '0.70rem',
                                                        fontWeight: 500,
                                                        justifyContent: 'center',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        height: '24px'
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>

                                    <Button variant="outlined" fullWidth startIcon={<GroupIcon />} onClick={() => { setRolesModalOpen(true) }} sx={{
                                        mt: 2, fontWeight: 600, borderWidth: 2, '&:hover': { borderWidth: 2, backgroundColor: 'primary.main', color: 'white' } }}
                                    >
                                        Cambiar Rol
                                    </Button>
                                </Paper>
                            </motion.div>
                        </Grid>

                        <Grid item xs={12} md={7}>
                            <motion.div variants={fadeInUp}>
                                <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: '#fafafa' }}>
                                        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)} variant="fullWidth" sx={{ '& .MuiTab-root': { fontWeight: 600, fontSize: '1rem', py: 2 } }}>
                                            <Tab icon={<PersonIcon />} label="Información Personal" iconPosition="start" />
                                            <Tab icon={<LockIcon />} label="Seguridad" iconPosition="start" />
                                        </Tabs>
                                    </Box>

                                    <TabPanel value={currentTab} index={0}>
                                        <Box sx={{ px: 4, py: 1 }}>
                                            <ProfileForm formData={profile} errors={profileErrors} onChange={handleProfileChange} onSubmit={handleProfileSubmit} />
                                        </Box>
                                    </TabPanel>

                                    <TabPanel value={currentTab} index={1}>
                                        <Box sx={{ px: 4, py: 2 }}>
                                            <Typography variant="h6" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 3 }}> Modifica tu contraseña de acceso </Typography>

                                            <PasswordForm password={passwordData.password} setPassword={(val) => setPasswordData((p) => ({ ...p, password: val }))} confirmPassword={passwordData.confirmPassword}
                                                setConfirmPassword={(val) => setPasswordData((p) => ({ ...p, confirmPassword: val }))} errors={passwordErrors} showPassword={showPassword} setShowPassword={setShowPassword}
                                                showPasswordConfirm={showPasswordConfirm} setShowPasswordConfirm={setShowPasswordConfirm} onSubmit={handlePasswordSubmit} />

                                            <Button variant="outlined" fullWidth startIcon={<CancelIcon />} onClick={() => { setPasswordData({ password: "", confirmPassword: "" }); setPasswordErrors({}); }}
                                                sx={{ mt: 3.5, fontWeight: 600, '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
                                                Limpiar campos
                                            </Button>
                                        </Box>
                                    </TabPanel>
                                </Paper>
                            </motion.div>
                        </Grid>
                    </Grid>
                </motion.div>
            </Container>

            <Footer />

            <RolesModal open={rolesModalOpen} onClose={() => setRolesModalOpen(false)} roles={roles} onSelect={handleRoleSelect} />

            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default UserProfile