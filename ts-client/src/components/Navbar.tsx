
export const Navbar = () => {
    return (
      <div>
        <nav className='navbar navbar-light bg-light'>
          <div className='container-fluid'>
            <a className='navbar-brand' href='#'>
              <img
                src='/docs/5.0/assets/brand/bootstrap-logo.svg'
                alt=''
                width='30'
                height='24'
                className='d-inline-block align-top'
              />
              Bootstrap
            </a>
            <div className='d-flex'>
              <a className='nav-link' href='#'>
                <u>How To Play</u>
              </a>
              <a className='nav-link' href='#'>
                <u>About</u>
              </a>
            </div>
          </div>
        </nav>
      </div>
    );
  };
  