import React, { useState } from 'react';
import { Box, Container, Typography, Link as MuiLink, Stack, IconButton, Divider, useTheme, TextField, Button, Grid } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, GitHub, MailOutline, Phone, LocationOn } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { useToast } from '../../Context';
import { useTranslation } from 'react-i18next';

import { pages } from '../../constants/pages';

const MotionIconButton = motion(IconButton);


export default function Footer() {
    const theme = useTheme();
    const { showToast } = useToast();
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();
    const [email, setEmail] = useState('');

    const handlePrefetch = (path: string) => {
        // Map path to page key
        const pathMap: Record<string, keyof typeof pages> = {
            '/': 'Home',
            '/products': 'Products',
            '/categories': 'Categories',
            '/cart': 'Cart',
            '/wishlist': 'Wishlist',
            '/profile': 'Profile',
            '/allorders': 'AllOrders',
            '/login': 'Login',
            '/register': 'Register'
        };

        const pageKey = pathMap[path.toLowerCase()];
        if (pageKey && pages[pageKey]) {
            pages[pageKey]();
            console.log(`🚀 Footer Prefetching: ${pageKey}`);
        }
    };


    const footerLinks = {
        shop: [
            { name: t("nav.products"), path: '/products', ariaLabel: t("footer.shopAllProducts") || 'Navigate to all products' },
            { name: t("nav.categories"), path: '/categories', ariaLabel: t("footer.browseCategories") || 'Browse product categories' },
            { name: t("nav.cart"), path: '/cart', ariaLabel: t("footer.viewCart") || 'View shopping cart' },
            { name: t("nav.wishlist"), path: '/wishlist', ariaLabel: t("footer.viewWishlist") || 'View wishlist' },
        ],
        support: [
            { name: t("nav.profile"), path: '/profile', ariaLabel: t("footer.viewProfile") || 'View my profile' },
            { name: t("nav.orders"), path: '/allorders', ariaLabel: t("footer.viewOrders") || 'View all orders' },
            { name: t("footer.privacyPolicy") || 'Privacy Policy', path: '#', ariaLabel: 'Read privacy policy' },
            { name: t("footer.termsOfService") || 'Terms of Service', path: '#', ariaLabel: 'Read terms of service' },
        ],
        company: [
            { name: t("nav.login"), path: '/login', ariaLabel: t("nav.login") },
            { name: t("nav.register"), path: '/register', ariaLabel: t("nav.register") },
            { name: t("footer.about"), path: '#', ariaLabel: t("footer.about") },
            { name: t("footer.contact"), path: '#', ariaLabel: t("footer.contact") },
        ]
    };


    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            showToast(t("footer.invalidEmail") || 'Please enter a valid email address', 'warning');
            return;
        }
        showToast(t("footer.subscribeSuccess") || 'Thank you for subscribing to our newsletter!', 'success');
        setEmail('');
    };


    const socialLinks = [
        { Icon: Facebook, label: 'Visit our Facebook page', url: '#' },
        { Icon: Twitter, label: 'Follow us on Twitter', url: '#' },
        { Icon: Instagram, label: 'Follow us on Instagram', url: '#' },
        { Icon: LinkedIn, label: 'Connect with us on LinkedIn', url: '#' },
        { Icon: GitHub, label: 'View our GitHub profile', url: '#' },
    ];


    return (
        <Box
            component="footer"
            role="contentinfo"
            aria-label={t("footer.siteDescription")}
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
                    <Grid size={{ xs: 12, lg: 4 }}>
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
                                {t("footer.brandName")}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
                                {t("footer.aboutText")}
                            </Typography>


                            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, textTransform: 'uppercase', letterSpacing: '1px' }} component="h3">
                                {t("footer.newsletter")}
                            </Typography>
                            <Box component="form" onSubmit={handleNewsletterSubmit}>
                                <Stack direction="row" spacing={1}>
                                    <TextField
                                        type="email"
                                        placeholder={t("footer.emailPlaceholder")}
                                        size="small"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        aria-label="Newsletter email input"
                                        required
                                        sx={{
                                            flex: 1,
                                            '& .MuiOutlinedInput-root': { borderRadius: '12px' }
                                        }}
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        aria-label={t("footer.subscribe")}
                                        sx={{ borderRadius: '12px', px: 3, fontWeight: 'bold', textTransform: 'none' }}
                                    >
                                        {t("footer.subscribe")}
                                    </Button>
                                </Stack>
                            </Box>
                        </Box>
                    </Grid>


                    {/* Links Columns */}
                    <Grid size={{ xs: 12, sm: 4, lg: 2 }}>
                        <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 900, mb: 3 }}>{t("footer.shop") || "Shop"}</Typography>
                        <Stack spacing={1.5} component="nav" aria-label="Shop navigation">
                            {footerLinks.shop.map((link) => (
                                <MuiLink
                                    key={link.name}
                                    component={RouterLink}
                                    to={link.path}
                                    color="text.secondary"
                                    underline="none"
                                    aria-label={link.ariaLabel}
                                    onMouseEnter={() => handlePrefetch(link.path)}
                                    sx={{ transition: '0.3s', '&:hover': { color: 'primary.main', pl: 0.5 } }}
                                >
                                    {link.name}
                                </MuiLink>
                            ))}
                        </Stack>
                    </Grid>


                    <Grid size={{ xs: 12, sm: 4, lg: 2 }}>
                        <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 900, mb: 3 }}>{t("footer.getHelp") || "Support"}</Typography>
                        <Stack spacing={1.5} component="nav" aria-label="Support navigation">
                            {footerLinks.support.map((link) => (
                                <MuiLink
                                    key={link.name}
                                    component={RouterLink}
                                    to={link.path}
                                    color="text.secondary"
                                    underline="none"
                                    aria-label={link.ariaLabel}
                                    onMouseEnter={() => handlePrefetch(link.path)}
                                    sx={{ transition: '0.3s', '&:hover': { color: 'primary.main', pl: 0.5 } }}
                                >
                                    {link.name}
                                </MuiLink>
                            ))}
                        </Stack>
                    </Grid>


                    <Grid size={{ xs: 12, sm: 4, lg: 4 }}>
                        <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 900, mb: 3 }}>{t("footer.contact")}</Typography>
                        <Stack spacing={3} component="address" sx={{ fontStyle: 'normal' }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box sx={{ p: 1.2, borderRadius: '12px', bgcolor: 'action.hover', color: 'primary.main' }} aria-hidden="true">
                                    <LocationOn fontSize="small" />
                                </Box>
                                <Typography variant="body2" color="text.secondary" component="span">
                                    {t("footer.addressVal")}
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box sx={{ p: 1.2, borderRadius: '12px', bgcolor: 'action.hover', color: 'primary.main' }} aria-hidden="true">
                                    <Phone fontSize="small" />
                                </Box>
                                <MuiLink href={`tel:${t("footer.phoneVal")}`} color="text.secondary" underline="hover" variant="body2">
                                    {t("footer.phoneVal")}
                                </MuiLink>
                            </Stack>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box sx={{ p: 1.2, borderRadius: '12px', bgcolor: 'action.hover', color: 'primary.main' }} aria-hidden="true">
                                    <MailOutline fontSize="small" />
                                </Box>
                                <MuiLink href={`mailto:${t("footer.emailVal")}`} color="text.secondary" underline="hover" variant="body2">
                                    {t("footer.emailVal")}
                                </MuiLink>
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
                        {t("footer.copyrightVal", { year: currentYear, brand: t("footer.brandName"), developedBy: t("footer.developedBy") })}
                    </Typography>


                    <Stack direction="row" spacing={1.5} component="nav" aria-label="Social media links">
                        {socialLinks.map(({ Icon, label, url }, idx) => (
                            <MotionIconButton
                                key={idx}
                                whileHover={{ y: -4, color: theme.palette.primary.main }}
                                size="medium"
                                {...({ component: "a", href: url, target: "_blank", rel: "noopener noreferrer" } as const)}
                                aria-label={label}
                                sx={{
                                    bgcolor: 'action.hover',
                                    borderRadius: '14px',
                                    color: 'text.secondary',
                                    transition: 'background-color 0.3s'
                                }}
                            >
                                <Icon fontSize="small" />
                            </MotionIconButton>
                        ))}
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}
