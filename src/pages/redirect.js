import React, { useEffect } from 'react';

function RedirectPage() {
  useEffect(() => {
    // Get everything after the '?' in the URL, excluding the '?'
    const path = window.location.search.substring(1);

    // Construct the new URL. This can be done more elegantly depending on your needs
    // const newUrl = 'exp://192.168.0.103:19000?' + path.toString();
    const newUrl = 'beautyverse://?' + path.toString();

    // Try to open the Expo app
    window.location.href = newUrl;

    // If the Expo app doesn't open within 2 seconds, assume it's not installed
    // and redirect to the App Store
    setTimeout(() => {
      window.location.href = 'https://apps.apple.com/app/6448795980'; // Replace with your App Store URL
    }, 2000);
  }, []);

  return null; // Return null since this component doesn't render anything
}

export default RedirectPage;
