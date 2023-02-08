import React from "react";

export const IsMobile = () => {
  // define mobile or desktop

  const [widths, setWidths] = React.useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidths(window.innerWidth);
  }
  React.useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = widths <= 768;

  return isMobile;
};
