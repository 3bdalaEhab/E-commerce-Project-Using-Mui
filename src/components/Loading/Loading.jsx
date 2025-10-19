import { Box, CircularProgress, Typography } from '@mui/material'
import React from 'react'

export default function Loading() {
  return (
    <Box sx={{ p: 4, textAlign: "center" , pt:20}}>
        <CircularProgress size={70}   />
        <Typography fontSize={30} color='primary' p={2} ml={2}>
                  Loading.....

        </Typography>
      </Box>
  )
}
