"use client";

import Link from "next/link";
import React from "react";
import { AiOutlineGithub } from "react-icons/ai";

const Footer: React.FC = () => {
  return (
    <footer className="pb-4 pt-20">
      <div className="container mx-auto text-center flex justify-between">
        <div>Copyright &copy; 2024 Gyute</div>
        <div className="flex justify-center items-center gap-4">
          <Link href="https://github.com/gyute">
            <AiOutlineGithub className="size-7 light-text dark-text hover-color active:animate-spin" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
