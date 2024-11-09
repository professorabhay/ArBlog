import React, { useState } from 'react';
import { Footer, Header, Loader } from './Components';
import { Outlet } from 'react-router-dom';

function App() {

  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 2000);

  return (
    <div className='min-h-screen flex flex-wrap content-between text-white bg-[#000000] items-center justify-center'>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#000000]">
          <Loader />
        </div>
      )}
      {!loading && (
        <>
          <div className="w-full block">
            <Header />
            <main>
              <Outlet />
            </main>
            <Footer />
          </div>
          <div className="absolute z-[3] -left-1/2 top-0 w-[50%] h-[50%] rounded-full white__gradient" />
        </>
      )}
    </div>
  );
}

export default App;
