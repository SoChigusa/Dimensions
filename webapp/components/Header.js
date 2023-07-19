import { AppBar, Avatar, Box, Button, Container, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import TranslateIcon from '@mui/icons-material/Translate';
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

          {/* Logo for medium size window */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
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

          {/* Menu for medium size window */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Box key={page.name}>
                <Link href={page.url} color='inherit' target={page.target}>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white' }}
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