import React, { useState } from 'react';
import {
    Button,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Box,
    Typography,
    useTheme,
    alpha
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../Context';

const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇪🇬' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const { mode } = useThemeContext();
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageChange = (lng: string) => {
        i18n.changeLanguage(lng);
        handleClose();
    };

    const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

    return (
        <Box>
            <Button
                id="language-button"
                aria-controls={open ? 'language-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                startIcon={<LanguageIcon />}
                endIcon={<KeyboardArrowDownIcon sx={{
                    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s'
                }} />}
                sx={{
                    color: mode === 'light' ? 'text.primary' : 'text.primary',
                    fontWeight: 600,
                    borderRadius: '12px',
                    px: 2,
                    py: 1,
                    bgcolor: open ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                    }
                }}
            >
                <Typography variant="body2" sx={{ display: { xs: 'none', md: 'block' }, fontWeight: 700 }}>
                    {currentLanguage.name}
                </Typography>
                <Typography variant="body2" sx={{ display: { xs: 'block', md: 'none' }, fontSize: '1.2rem' }}>
                    {currentLanguage.flag}
                </Typography>
            </Button>
            <Menu
                id="language-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'language-button',
                }}
                PaperProps={{
                    sx: {
                        borderRadius: '18px',
                        mt: 1.5,
                        minWidth: 160,
                        boxShadow: '0px 10px 40px rgba(0,0,0,0.12)',
                        border: '1px solid',
                        borderColor: 'divider',
                        p: 1
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {languages.map((lang) => (
                    <MenuItem
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        selected={i18n.language === lang.code}
                        sx={{
                            borderRadius: '12px',
                            mb: 0.5,
                            '&.Mui-selected': {
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.15),
                                }
                            }
                        }}
                    >
                        <ListItemIcon sx={{ fontSize: '1.2rem' }}>{lang.flag}</ListItemIcon>
                        <ListItemText
                            primary={lang.name}
                            primaryTypographyProps={{
                                variant: 'body2',
                                fontWeight: i18n.language === lang.code ? 700 : 500
                            }}
                        />
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
}
