export const Navbar = () => {
  return (
    <header className="border-b md:flex md:items-center md:justify-between p-4 pb-0 shadow-lg md:pb-4 rounded-b-xl bg-black">
      <div className="flex items-center justify-between mb-4 md:mb-0">
        <p className="leading-none text-2xl text-grey-darkest">
          <a className="no-underline text-white hover:text-black" href="/#">
            Cards Against Humanity Online
          </a>
        </p>
      </div>
      <nav>
        <ul className="list-reset md:flex md:items-center">
          <li className="md:ml-4">
            <a
              className="block no-underline hover:underline py-2 text-white hover:text-gray-200 md:border-none md:p-0"
              href="https://youtu.be/Uyciy8LmmXg"
              target="_blank"
              rel="noreferrer"
            >
              How to Play
            </a>
          </li>
          <li className="md:ml-4">
            <a
              className="border-t block no-underline hover:underline py-2 text-white hover:text-gray-200 md:border-none md:p-0"
              href="https://github.com/zwemsoe/cah-webgame.git"
              target="_blank"
              rel="noreferrer"
            >
              About
            </a>
          </li>
          <li className="md:ml-4">
            <a
              className="border-t block no-underline hover:underline py-2 text-white hover:text-gray-200 md:border-none md:p-0"
              href="https://www.linkedin.com/in/zwe-min-soe-0b15091a8/"
              target="_blank"
              rel="noreferrer"
            >
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};
