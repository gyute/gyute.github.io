"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import React from "react";

type HeaderProps = {
  theme: string;
  toggleTheme: () => void;
};

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }: HeaderProps) => {
  return (
    <header className="py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gyute&apos;s Blog</h1>
        </div>
        <div className="flex space-x-5">
          {/*
          <nav>
            <ul className="flex space-x-5">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/">About</a>
              </li>
            </ul>
          </nav>
          */}
          <button onClick={toggleTheme}>
            {theme === "light" ? (
              <>
                <SunIcon className="size-6 light-text dark-text hover-color" />
              </>
            ) : (
              <>
                <MoonIcon className="size-6 light-text dark-text hover-color" />
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
