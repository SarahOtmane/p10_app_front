import { MdHome, MdPlayCircleOutline, MdFlag, MdPerson, MdAccountCircle } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-red-700 border-t shadow-inner py-2 px-4 flex justify-between items-center text-xs text-white z-50">
      <a href="/" className="flex flex-col items-center text-yellow-300 font-bold">
        <MdHome size={24} />
        Latest
      </a>
      <a href="/login" className="flex flex-col items-center hover:text-yellow-300 transition-colors">
        <MdPlayCircleOutline size={24} />
        Leagues
      </a>
      <a href="/login" className="flex flex-col items-center hover:text-yellow-300 transition-colors">
        <MdFlag size={24} />
        Racing
      </a>
      <a href="/login" className="flex flex-col items-center hover:text-yellow-300 transition-colors">
        <MdPerson size={24} />
        Pilotes
      </a>
      <a href="/login" className="flex flex-col items-center hover:text-yellow-300 transition-colors">
        <MdAccountCircle size={24} />
        Profile
      </a>
    </footer>
  );
}