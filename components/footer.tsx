import Link from "next/link";
import React from "react";
import { AiOutlineGithub } from "react-icons/ai";

export const Footer: React.FC = () => {
  return (
    <footer className="pb-4 pt-20">
      <div className="container mx-auto flex justify-between text-center">
        <h3>Copyright &copy; 2024 Gyute</h3>
        <div className="flex items-center justify-center gap-4">
          <Link href="https://github.com/gyute">
            <AiOutlineGithub className="light-text dark-text hover-color size-8 active:animate-spin" />
          </Link>
        </div>
      </div>
    </footer>
  );
};
