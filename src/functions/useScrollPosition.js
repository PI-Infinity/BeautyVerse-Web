import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const restoreScrollPosition = () => {
      const savedScrollPosition = sessionStorage.getItem('scrollPosition');
      if (savedScrollPosition) {
        setScrollPosition(parseInt(savedScrollPosition, 10));
        window.scrollTo(0, parseInt(savedScrollPosition, 10));
      }
    };

    if (location.pathname === '/') {
      restoreScrollPosition();
    }
  }, [location.pathname]);

  const saveScrollPosition = () => {
    setScrollPosition(window.scrollY);
    sessionStorage.setItem('scrollPosition', window.scrollY);
  };
  const saveScrollPositionWhenClose = (y) => {
    setScrollPosition(y);
    sessionStorage.setItem('scrollPosition', y);
  };
  return { scrollPosition, saveScrollPosition, saveScrollPositionWhenClose };
}

export default useScrollPosition;
