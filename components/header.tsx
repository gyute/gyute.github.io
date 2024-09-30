"use client";

import { AiOutlineMoon, AiOutlineSun } from "react-icons/ai";
import Link from "next/link";
import React from "react";

type HeaderProps = {
  theme: string;
  toggleTheme: () => void;
};

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }: HeaderProps) => {
  return (
    <header className="pt-4 pb-14">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            <Link href={"/"}>Gyute&apos;s Blog</Link>
          </h1>
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
                <AiOutlineSun className="size-7 light-text dark-text hover-color active:animate-spin" />
              </>
            ) : (
              <>
                <AiOutlineMoon className="size-7 light-text dark-text hover-color active:animate-spin" />
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
