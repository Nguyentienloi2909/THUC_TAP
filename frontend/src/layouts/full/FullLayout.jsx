import React, { useState, useEffect, useRef } from "react";
import { styled, Container, Box, Typography, Link } from "@mui/material";
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
  backgroundColor: "#f0f2f5", // Changed from theme.palette.background.default to #f0f2f5
  width: "100%", // Ensure it takes full width
  overflow: "hidden", // Prevent any overflow issues
}));

const ContentBox = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  minHeight: "calc(100vh - 64px)", // Account for header height
  width: "100%",
}));

const FullLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const mediaPlayPromiseRef = useRef({});

  // Enhanced cleanup for media elements to prevent AbortError
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

    // Add event listener for page navigation
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup function for route changes
    const cleanup = () => {
      const mediaElements = document.querySelectorAll('audio, video');
      mediaElements.forEach(media => {
        const mediaId = media.id || Math.random().toString(36);

        // If there's a pending play promise, handle it properly
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

    // Run cleanup when location changes
    cleanup();

    return () => {
      cleanup();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.pathname]);

  // Add global handler for play events to track promises
  useEffect(() => {
    const handlePlay = (event) => {
      const media = event.target;
      const mediaId = media.id || Math.random().toString(36);

      // Store the play promise to handle it properly later
      mediaPlayPromiseRef.current[mediaId] = media.play();

      // Clean up the reference when the promise resolves or rejects
      mediaPlayPromiseRef.current[mediaId]
        .then(() => {
          delete mediaPlayPromiseRef.current[mediaId];
        })
        .catch(() => {
          delete mediaPlayPromiseRef.current[mediaId];
        });
    };

    // Add global event listener for play events
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
            }}
          >
            {/* Page Route */}
            <Box sx={{ flexGrow: 1 }}>
              <Outlet />
            </Box>
          </Container>

          {/* Footer */}
          <Box sx={{
            pt: 3,
            pb: 3,
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            borderTop: '1px solid rgba(0,0,0,0.1)'
          }}>
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
