import React, { useEffect, useState } from "react"
import { Box, Avatar, CircularProgress, Input, IconButton } from '@mui/material'
import EditIcon from "@mui/icons-material/Edit"
import axios from '../utils/axiosConfig'


const AvatarUploader = ({ currentPhoto, onPhotoChange, showSnackbar }) => {
    const [preview, setPreview] = useState(currentPhoto || "")
    const [uploading, setUploading] = useState(false)

    useEffect(() => { setPreview(currentPhoto || "") }, [currentPhoto])

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const localUrl = URL.createObjectURL(file)
        setPreview(localUrl)

        const formData = new FormData()
        formData.append("photo", file)

        try {
            setUploading(true)
            const response = await axios.post('http://localhost:3000/users/upload-avatar', formData, { headers: { "Content-Type": "multipart/form-data" } })

            const finalUrl = `http://localhost:3000${response.data.url.avatarUrl}`
            onPhotoChange(finalUrl)  //Pasa la URL de la fto al perfil

            const user = JSON.parse(localStorage.getItem('user'))
            const updatedUser = { ...user, avatar: response.data.url.avatarUrl }
            localStorage.setItem('user', JSON.stringify(updatedUser))

        } catch (error) {
            if (showSnackbar) showSnackbar("Error al cargar la imagen", "error")
        } finally {
            setUploading(false)
        }
    }

    return (
        <Box sx={{ position: "relative", display: "inline-block", width: 180, height: 180 }}>
            <Avatar src={preview} sx={{ width: 180, height: 180, border: "2px solid #ccc", boxShadow: "0px 2px 8px rgba(0,0,0,0.2)" }} />

            <IconButton component="label" color="primary" sx={{ position: "absolute", bottom: 8, right: 8, backgroundColor: "white", border: "1px solid #ddd", "&:hover": { backgroundColor: "#f0f0f0" } }}>
                {uploading ? <CircularProgress size={20} /> : <EditIcon />}
                <Input type="file" hidden onChange={handlePhotoChange} style={{ display: "none" }} />
            </IconButton>
        </Box>
    )
}

export default AvatarUploader