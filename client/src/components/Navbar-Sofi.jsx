import React, { useState, useRef } from "react"
import { AppBar, Toolbar, Typography, Button, Box, Paper, Popper, Grow, MenuList, MenuItem, Avatar } from "@mui/material"
import WorkOutlineIcon from "@mui/icons-material/WorkOutline"

import { useNavigate } from "react-router-dom"
import axios from '../utils/axiosConfig'
import { jwtDecode } from "jwt-decode"

const profileOptions = ['Mi perfil', 'Cerrar sesión']


const NavBar = ({ avatarUrl, hideCleaningButton = false, logoRedirectTo = null }) => {
    const navigate = useNavigate()
    const [openMenu, setOpenMenu] = useState(false)
    const anchorRef = useRef(null)

    const token = localStorage.getItem('token')   //Decodificar token para obtener rol principal
    const decoded = token ? jwtDecode(token) : null
    const currentRole = decoded?.primaryRole || 'guest'
    const isAuthenticated = !!token    //Revisa si el usuario esta logueado

    const handleLogoClick = () => {
        if (logoRedirectTo) {
            navigate(logoRedirectTo)
        } else if (currentRole === 'admin') {
            navigate('/admin')
        } else if (currentRole === 'recepcionist') {
            navigate('/recepcionist')
        } else if (currentRole === 'cleaning') {
            navigate('/cleaning')
        } else {
            navigate('/home')
        }
    }

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:3000/log/logout', { userId: decoded.id })
        } catch (error) {
            console.error("Error al registrar logout:", error)
        } finally {
            localStorage.removeItem("token")
            setTimeout(() => { navigate("/home") }, 1000)
        }
    }

    const handleOptionSelect = (option) => {
        setOpenMenu(false)
        if (option === "Cerrar sesión") handleLogout()
        if (option === "Mi perfil") setTimeout(() => { navigate("/profile") }, 200)
    }

    const roleButtons = {
        guest: [
            { label: "Habitaciones", route: "/rooms" },
            { label: "Reservar", route: "/booking" },
            { label: "Mis reservas", route: "/my-reservations" }
        ],

        admin: [
            { label: "Usuarios", route: "/admin/users" },
            { label: "Roles", route: "/admin/roles" },
            { label: "Permisos", route: "/admin/permissions" },
            { label: "Habitaciones", route: "/admin/rooms" },
            { label: "Bitácora", route: "/admin/bitacora" }
        ],

        recepcionist: [
            { label: "Check-in", route: "/recepcionist/checkin" },
            { label: "Check-out", route: "/recepcionist/checkout" }
        ]
    }

    const buttonToShow = roleButtons[currentRole] || []

    return (
        <AppBar position="fixed" sx={{ backgroundColor: "#d2fadcff", color: "black" }} elevation={0} >
            <Toolbar sx={{ justifyContent: "space-between", padding: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <WorkOutlineIcon sx={{ color: "primary.main", fontSize: 30 }} />
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ fontSize: 30, cursor: "pointer" }}
                        color="primary"
                        onClick={handleLogoClick}
                        title={currentRole === 'admin' ? 'Ir al Panel de Administración' : 'Ir a Inicio'}
                    >
                        HotelDesk
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    {!isAuthenticated ? (
                        <Button variant="contained" color="primary" onClick={() => navigate("/login")} sx={{ fontWeight: 600 }} > Iniciar sesión </Button>
                    ) : (
                        <>
                            {buttonToShow.map((btn) => (
                                <Button key={btn.label} variant="contained" onClick={() => navigate(btn.route)}>
                                    {btn.label}
                                </Button>
                            ))}

                            <Button ref={anchorRef} onClick={() => setOpenMenu(!openMenu)} sx={{ minWidth: 0, padding: 0 }} >
                                <Avatar alt="Perfil" src={avatarUrl} sx={{ width: 40, height: 40 }} />
                            </Button>

                            <Popper open={openMenu} anchorEl={anchorRef.current} transition disablePortal placement="bottom-end" sx={{ zIndex: 1300 }} >
                                {({ TransitionProps }) => (
                                    <Grow {...TransitionProps} style={{ transformOrigin: "center top" }}>
                                        <Paper>
                                            <MenuList autoFocusItem>
                                                {profileOptions.map((option) => (
                                                    <MenuItem key={option} onClick={() => handleOptionSelect(option)} >
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                            </MenuList>
                                        </Paper>
                                    </Grow>
                                )}
                            </Popper>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default NavBar