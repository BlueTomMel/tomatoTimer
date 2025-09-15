import { useState, useEffect, useCallback } from 'react';

export const useFullscreen = (isIOS) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scrollInterval, setScrollInterval] = useState(null);

  const preventScroll = useCallback((e) => {
    if (isFullscreen) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
  }, [isFullscreen]);

  const startContinuousScrolling = useCallback(() => {
    if (scrollInterval) clearInterval(scrollInterval);
    
    const interval = setInterval(() => {
      if (isFullscreen && window.pageYOffset === 0) {
        window.scrollTo(0, 1);
      }
    }, 2000);
    
    setScrollInterval(interval);
  }, [isFullscreen, scrollInterval]);

  const stopContinuousScrolling = useCallback(() => {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      setScrollInterval(null);
    }
  }, [scrollInterval]);

  const enterIOSFullscreen = useCallback(() => {
    const body = document.body;
    const html = document.documentElement;
    
    try {
      // Step 1: Force scroll to hide address bar
      window.scrollTo(0, 1);
      
      // Step 2: Manipulate viewport
      let viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, minimal-ui');
      } else {
        viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, minimal-ui';
        document.head.appendChild(viewport);
      }
      
      // Step 3: Add status bar meta
      let statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
      if (!statusBarMeta) {
        statusBarMeta = document.createElement('meta');
        statusBarMeta.name = 'apple-mobile-web-app-status-bar-style';
        statusBarMeta.content = 'black-translucent';
        document.head.appendChild(statusBarMeta);
      }
      
      // Step 4: Apply fullscreen styles
      const fullscreenStyles = {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden',
        margin: '0',
        padding: '0',
        webkitUserSelect: 'none',
        webkitTouchCallout: 'none',
        webkitTapHighlightColor: 'transparent',
        webkitOverflowScrolling: 'touch',
        webkitTransform: 'translate3d(0, 0, 0)',
        transform: 'translate3d(0, 0, 0)',
        webkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden'
      };
      
      Object.assign(html.style, fullscreenStyles);
      Object.assign(body.style, fullscreenStyles);
      body.style.minHeight = '100vh';
      body.style.background = '#000';
      
      // Step 5: Add classes
      body.classList.add('ios-fullscreen');
      html.classList.add('ios-fullscreen');
      
      setIsFullscreen(true);
      
      // Step 6: Prevent scrolling
      document.addEventListener('touchmove', preventScroll, { passive: false });
      document.addEventListener('wheel', preventScroll, { passive: false });
      document.addEventListener('scroll', preventScroll, { passive: false });
      
      // Step 7: Multiple scroll attempts
      const scrollAttempts = [0, 50, 100, 200, 300, 500, 800, 1000];
      scrollAttempts.forEach(delay => {
        setTimeout(() => {
          window.scrollTo(0, 1);
          body.style.transform = 'translateZ(0)';
          void body.offsetHeight;
          body.style.transform = '';
        }, delay);
      });
      
      // Step 8: Start continuous scrolling
      setTimeout(() => {
        startContinuousScrolling();
      }, 1000);
      
    } catch (error) {
      console.log('iOS fullscreen setup error:', error);
    }
  }, [preventScroll, startContinuousScrolling]);

  const exitIOSFullscreen = useCallback(() => {
    const body = document.body;
    const html = document.documentElement;
    
    try {
      stopContinuousScrolling();
      
      // Restore viewport
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
      
      // Remove status bar meta
      const statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
      if (statusBarMeta) {
        statusBarMeta.remove();
      }
      
      // Reset styles
      const resetStyles = {
        position: '',
        top: '',
        left: '',
        width: '',
        height: '',
        maxHeight: '',
        overflow: '',
        margin: '',
        padding: '',
        webkitUserSelect: '',
        webkitTouchCallout: '',
        webkitTapHighlightColor: '',
        webkitOverflowScrolling: '',
        webkitTransform: '',
        transform: '',
        webkitBackfaceVisibility: '',
        backfaceVisibility: '',
        minHeight: '',
        background: ''
      };
      
      Object.assign(html.style, resetStyles);
      Object.assign(body.style, resetStyles);
      
      // Remove classes
      body.classList.remove('ios-fullscreen');
      html.classList.remove('ios-fullscreen');
      
      setIsFullscreen(false);
      
      // Remove event listeners
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('scroll', preventScroll);
      
    } catch (error) {
      console.log('iOS fullscreen exit error:', error);
    }
  }, [preventScroll, stopContinuousScrolling]);

  const toggleFullscreen = useCallback(() => {
    if (isIOS) {
      if (isFullscreen) {
        exitIOSFullscreen();
      } else {
        enterIOSFullscreen();
      }
    } else {
      // Standard fullscreen API
      if (!document.fullscreenElement) {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          elem.requestFullscreen().catch(() => enterIOSFullscreen());
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        } else {
          enterIOSFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    }
  }, [isIOS, isFullscreen, enterIOSFullscreen, exitIOSFullscreen]);

  // Handle orientation and resize events
  useEffect(() => {
    const handleOrientationChange = () => {
      if (isFullscreen) {
        stopContinuousScrolling();
        
        setTimeout(() => {
          const orientationScrollAttempts = [0, 100, 200, 300, 500, 800];
          orientationScrollAttempts.forEach(delay => {
            setTimeout(() => {
              window.scrollTo(0, 1);
              
              const body = document.body;
              const html = document.documentElement;
              body.style.height = '100vh';
              body.style.width = '100vw';
              html.style.height = '100vh';
              html.style.width = '100vw';
              
              void body.offsetHeight;
            }, delay);
          });
          
          setTimeout(() => {
            startContinuousScrolling();
          }, 1000);
        }, 100);
      }
    };

    const handleResize = () => {
      if (isFullscreen) {
        setTimeout(() => {
          window.scrollTo(0, 1);
          
          const body = document.body;
          const html = document.documentElement;
          body.style.height = '100vh';
          body.style.width = '100vw';
          html.style.height = '100vh';
          html.style.width = '100vw';
          
          void body.offsetHeight;
        }, 50);
      }
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleResize);
      if (scrollInterval) clearInterval(scrollInterval);
    };
  }, [isFullscreen, startContinuousScrolling, stopContinuousScrolling, scrollInterval]);

  return {
    isFullscreen,
    toggleFullscreen
  };
};