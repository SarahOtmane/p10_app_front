"use client";

import { MdHome, MdPlayCircleOutline, MdFlag, MdPerson, MdAccountCircle } from "react-icons/md";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Vérifier si un token existe
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Fonction pour déterminer si le lien est actif
  const isActive = (path: string) => {
    return pathname === path;
  };

  // Fonction pour obtenir les classes CSS
  const getLinkClasses = (path: string) => {
    const baseClasses = "flex flex-col items-center transition-colors";
    if (isActive(path)) {
      return `${baseClasses} text-yellow-300 font-bold`;
    }
    return `${baseClasses} text-white hover:text-yellow-300`;
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-red-700 border-t shadow-inner py-2 px-4 flex justify-between items-center text-xs text-white z-50">
      <a href="/" className={getLinkClasses("/")}>
        <MdHome size={24} />
        Latest
      </a>
      <a href={isLoggedIn ? "/teams" : "/login"} className={getLinkClasses("/teams")}>
        <MdPlayCircleOutline size={24} />
        Leagues
      </a>
      <a href={isLoggedIn ? "/races" : "/login"} className={getLinkClasses("/racing")}>
        <MdFlag size={24} />
        Racing
      </a>
      <a href={isLoggedIn ? "/ranking" : "/login"} className={getLinkClasses("/ranking")}>
        <MdPerson size={24} />
        Ranking
      </a>
      <a href={isLoggedIn ? "/profile" : "/login"} className={getLinkClasses("/profile")}>
        <MdAccountCircle size={24} />
        Profile
      </a>
    </footer>
  );
}