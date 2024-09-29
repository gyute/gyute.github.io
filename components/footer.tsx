"use client";

import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="py-6">
      <div className="container mx-auto text-center flex justify-between">
        <div>&copy; 2024 Gyute&apos;s Blog. All Rights Reserved.</div>
        <div className="flex justify-center items-center gap-4">
          <a href="https://github.com/gyute">GitHub</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
