"use client";

import Link from "next/link";
import React from "react";
import { AiOutlineMoon, AiOutlineSun } from "react-icons/ai";

import { useTheme } from "@/lib/useTheme";

const Header: React.FC = () => {
  const { toggleTheme } = useTheme();
  const [themeClicked, setThemeClicked] = React.useState(false);

  const onClickHandler = () => {
    setThemeClicked(true);
    toggleTheme();
    setTimeout(() => setThemeClicked(false), 500);
  };

  return (
    <header className="pb-14 pt-4">
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <h1 className="my-0">
            <Link href={"/"}>@gyute</Link>
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
          <div
            className="cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={onClickHandler}
          >
            <div className="relative flex size-8">
              {themeClicked && (
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#9cff9c] opacity-75" />
              )}
              <AiOutlineSun className="light-text dark-text hover-color block size-8 active:animate-ping dark:hidden" />
              <AiOutlineMoon className="light-text dark-text hover-color hidden size-8 active:animate-ping dark:block" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
