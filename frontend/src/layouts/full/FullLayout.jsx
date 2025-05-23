import React, { useState, useEffect, useRef } from "react";
import { styled, Container, Box, Typography, Link, useTheme } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";

import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

const PageWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexGrow: 1,
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: theme.palette.background.default, // Sử dụng màu nền từ theme
  width: "100%",
  overflow: "hidden",
}));

const ContentBox = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  minHeight: "calc(100vh - 64px)",
  width: "100%",
  backgroundColor: theme.palette.background.paper, // Đảm bảo nền nội dung theo theme
}));

const FullLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const mediaPlayPromiseRef = useRef({});
  const theme = useTheme(); // Lấy theme hiện tại

  // Giữ nguyên logic useEffect cho media cleanup
  useEffect(() => {
    const handleBeforeUnload = () => {
      const mediaElements = document.querySelectorAll('audio, video');
      mediaElements.forEach(media => {
        if (!media.paused) {
          try {
            media.pause();
          } catch (e) {
            console.warn('Error pausing media:', e);
          }
        }
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    const cleanup = () => {
      const mediaElements = document.querySelectorAll('audio, video');
      mediaElements.forEach(media => {
        const mediaId = media.id || Math.random().toString(36);
        if (mediaPlayPromiseRef.current[mediaId]) {
          mediaPlayPromiseRef.current[mediaId]
            .then(() => {
              if (!media.paused) {
                media.pause();
              }
            })
            .catch(err => {
              console.warn('Media play promise rejected:', err);
            });
        } else if (!media.paused) {
          media.pause();
        }
      });
    };

    cleanup();
    return () => {
      cleanup();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.pathname]);

  useEffect(() => {
    const handlePlay = (event) => {
      const media = event.target;
      const mediaId = media.id || Math.random().toString(36);
      mediaPlayPromiseRef.current[mediaId] = media.play();
      mediaPlayPromiseRef.current[mediaId]
        .then(() => {
          delete mediaPlayPromiseRef.current[mediaId];
        })
        .catch(() => {
          delete mediaPlayPromiseRef.current[mediaId];
        });
    };

    document.addEventListener('play', handlePlay, true);
    return () => {
      document.removeEventListener('play', handlePlay, true);
    };
  }, []);

  return (
    <MainWrapper className="mainwrapper">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Wrapper */}
      <PageWrapper className="page-wrapper">
        {/* Header */}
        <Header
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          toggleMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        {/* PageContent */}
        <ContentBox>
          <Container
            sx={{
              paddingTop: "20px",
              paddingBottom: "20px",
              maxWidth: "1200px",
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              backgroundColor: theme.palette.background.paper, // Đồng bộ nền Container
            }}
          >
            {/* Page Route */}
            <Box sx={{ flexGrow: 1 }}>
              <Outlet />
            </Box>
          </Container>

          {/* Footer */}
          <Box
            sx={{
              pt: 3,
              pb: 3,
              display: "flex",
              justifyContent: "center",
              width: "100%",
              borderTop: `1px solid ${theme.palette.divider}`, // Sử dụng divider từ theme
              backgroundColor: theme.palette.background.paper, // Nền footer theo theme
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © 2025 Company Name
            </Typography>
          </Box>
        </ContentBox>
      </PageWrapper>
    </MainWrapper>
  );
};

export default FullLayout;