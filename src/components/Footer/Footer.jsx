import React from 'react';
import { Box, Container, Typography, Link, Stack, IconButton, Divider, useTheme, Grid, TextField, Button } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, GitHub, MailOutline, Phone, LocationOn } from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function Footer() {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: 'All Products', href: '/' },
      { name: 'Featured Categories', href: '/' },
      { name: 'New Arrivals', href: '/' },
      { name: 'Special Offers', href: '/' },
    ],
    support: [
      { name: 'Contact Us', href: '/' },
      { name: 'FAQs', href: '/' },
      { name: 'Shipping Info', href: '/' },
      { name: 'Return Policy', href: '/' },
    ],
    company: [
      { name: 'About Us', href: '/' },
      { name: 'Our Stores', href: '/' },
      { name: 'Terms of Service', href: '/' },
      { name: 'Privacy Policy', href: '/' },
    ]
  };

  return (
    <Box
      component="footer"
      sx={{
        pt: 10,
        pb: 4,
        mt: 'auto',
        backgroundColor: theme.palette.mode === 'light' ? '#f8fafc' : '#020617',
        color: theme.palette.text.primary,
        borderTop: `1px solid ${theme.palette.divider}`,
        transition: 'background-color 0.4s ease'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Brand & Newsletter Column */}
          <Grid item xs={12} lg={4}>
            <Box mb={4}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  mb: 2,
                  letterSpacing: '-1.5px',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                E-COMMERCE
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
                Experience the pinnacle of online shopping with our curated selection of premium electronics and fashion. Quality guaranteed, every time.
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Join our newsletter
              </Typography>
              <Stack direction="row" spacing={1}>
                <TextField
                  placeholder="Your email address"
                  size="small"
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': { borderRadius: '12px' }
                  }}
                />
                <Button
                  variant="contained"
                  sx={{ borderRadius: '12px', px: 3, fontWeight: 'bold', textTransform: 'none' }}
                >
                  Join
                </Button>
              </Stack>
            </Box>
          </Grid>

          {/* Links Columns */}
          <Grid item xs={12} sm={4} lg={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 3 }}>Shop</Typography>
            <Stack spacing={1.5}>
              {footerLinks.shop.map((link) => (
                <Link key={link.name} href={link.href} color="text.secondary" underline="none" sx={{ transition: '0.3s', '&:hover': { color: 'primary.main', pl: 0.5 } }}>
                  {link.name}
                </Link>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} sm={4} lg={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 3 }}>Support</Typography>
            <Stack spacing={1.5}>
              {footerLinks.support.map((link) => (
                <Link key={link.name} href={link.href} color="text.secondary" underline="none" sx={{ transition: '0.3s', '&:hover': { color: 'primary.main', pl: 0.5 } }}>
                  {link.name}
                </Link>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} sm={4} lg={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 3 }}>Get in Touch</Typography>
            <Stack spacing={3}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ p: 1.2, borderRadius: '12px', bgcolor: 'action.hover', color: 'primary.main' }}>
                  <LocationOn fontSize="small" />
                </Box>
                <Typography variant="body2" color="text.secondary">123 Commerce St, Digital Avenue, Tech City</Typography>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ p: 1.2, borderRadius: '12px', bgcolor: 'action.hover', color: 'primary.main' }}>
                  <Phone fontSize="small" />
                </Box>
                <Typography variant="body2" color="text.secondary">+1 (555) 000-0000</Typography>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ p: 1.2, borderRadius: '12px', bgcolor: 'action.hover', color: 'primary.main' }}>
                  <MailOutline fontSize="small" />
                </Box>
                <Typography variant="body2" color="text.secondary">hello@premium-ecommerce.com</Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6, opacity: 0.5 }} />

        <Stack
          direction={{ xs: 'column-reverse', md: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={3}
        >
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            © {currentYear} E-COMMERCE. Developed with expertise for a world-class experience.
          </Typography>

          <Stack direction="row" spacing={1.5}>
            {[Facebook, Twitter, Instagram, LinkedIn, GitHub].map((Icon, idx) => (
              <IconButton
                key={idx}
                component={motion.button}
                whileHover={{ y: -4, color: theme.palette.primary.main }}
                size="medium"
                sx={{
                  bgcolor: 'action.hover',
                  borderRadius: '14px',
                  color: 'text.secondary',
                  transition: 'background-color 0.3s'
                }}
              >
                <Icon fontSize="small" />
              </IconButton>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
