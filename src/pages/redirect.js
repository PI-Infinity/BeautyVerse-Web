import React, { useEffect } from 'react';

export const Redirect = ({ url }) => {
  useEffect(() => {
    // Navigate to the specified URL
    window.location.href = 'beautyverse://' + window.location.search;
  }, [url]); // The effect depends on the 'url' prop

  return null;
};

// Usage example
//
