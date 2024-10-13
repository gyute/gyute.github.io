"use client";

import { AiOutlineMoon, AiOutlineSun } from "react-icons/ai";
import Link from "next/link";
import React from "react";
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
    <header className="pt-4 pb-14">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
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
            <div className="relative flex size-7">
              {themeClicked && (
                <span className="animate-ping absolute inline-flex size-full rounded-full bg-[#9cff9c] opacity-75" />
              )}
              <AiOutlineSun className="block dark:hidden size-7 light-text dark-text hover-color active:animate-ping" />
              <AiOutlineMoon className="hidden dark:block size-7 light-text dark-text hover-color active:animate-ping" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
