import { AppBar, Avatar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import TranslateIcon from '@mui/icons-material/Translate';
import MenuIcon from "@mui/icons-material/Menu";
import Link from "./Link";
import { useState } from "react";
import useLocale from "@/utils/useLocale";

const Header = ({ slug }) => {
  const { locale, t } = useLocale();
  const pages = [
    { name: t.APP, url: '/', target: '' },
    { name: t.DOCUMENTATION, url: 'documentation', target: '' },
    { name: t.GITHUB, url: 'https://github.com/SoChigusa/Dimensions', target: '_blank' },
  ];

  // for menu icon button
  const [anchorElNav, setAnchorElNav] = useState(null);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Container maxWidth='lg'>
        <Toolbar disableGutters>

          {/* Dropdown menu for extra small size window */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', sm: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', sm: 'none' },
              }}
            >
              {pages.map((page) => {
                return (
                  <Link key={page.name} href={page.url} target={page.target} color='inherit'>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">{page.name}</Typography>
                    </MenuItem>
                  </Link>
                );
              })}
            </Menu>
          </Box>

          {/* Logo for medium size window */}
          <Box sx={{ flexGrow: { xs: 1, sm: 0 }, display: 'flex' }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                mr: 2,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: 'inherit',
                textDecoration: 'none',
              }}>
              Dimensions
            </Typography>
          </Box>

          {/* Menu for small size window and larger */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
            {pages.map((page) => (
              <Box key={page.name}>
                <Link href={page.url} color='inherit' target={page.target}>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'inherit' }}
                  >
                    {page.name}
                  </Button>
                </Link>
              </Box>
            ))}
          </Box>

          {/* translate button */}
          <Box sx={{ mr: 1 }}>
            <Link href='' color="white" query={slug === undefined ? {} : { slug: slug }} localeChange>
              <Tooltip title={t.TRANSLATE} placement="bottom" arrow>
                <IconButton
                  size="large"
                  aria-label="change language"
                  color="inherit"
                >
                  <TranslateIcon />
                </IconButton>
              </Tooltip>
            </Link>
          </Box>

          {/* Avatar */}
          <Link href='https://website-sochigusa.vercel.app/' target='_blank'>
            <Tooltip title={t.WEBSITE} placement="bottom" arrow>
              <Avatar alt="So Chigusa" src="/avatars/1.jpg" />
            </Tooltip>
          </Link>

        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;