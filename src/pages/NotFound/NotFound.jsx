import React from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PageMeta from '../../components/PageMeta/PageMeta';

export default function NotFound() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        px: 3,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <PageMeta
        title="404 - Page Not Found"
        description="The page you are looking for does not exist."
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '6rem', md: '10rem' },
            fontWeight: 900,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
            mb: 2,
          }}
        >
          404
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Oops! Page Not Found
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: theme.palette.text.secondary, mb: 4, maxWidth: 500 }}
        >
          The page you're looking for might have been moved, deleted, or never existed in the first place.
        </Typography>

        <Button
          component={Link}
          to="/"
          variant="contained"
          size="large"
          startIcon={<HomeIcon />}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: '12px',
            textTransform: 'none',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            boxShadow: `0 8px 25px ${theme.palette.primary.main}40`,
          }}
        >
          Back to Home
        </Button>
      </motion.div>
    </Box>
  );
}
