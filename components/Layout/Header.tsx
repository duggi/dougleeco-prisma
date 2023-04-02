import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="">
      <div className="">
        <Link href="/" className="">
          Home
        </Link>
        <nav className="">
          {/* {user ? (
            <div className="">
              <Link href="/favorites" className="">
                  My Favorites
              </Link>
              <Link href="/api/auth/logout"  className="">
                  Logout
              </Link>
            </div>
          ) : (
            <Link href="/api/auth/login" className="">
                Login
            </Link>
          )} */}
        </nav>
      </div>
    </header>
  );
};

export default Header;
