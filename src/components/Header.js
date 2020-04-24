import React from 'react';
import { Link } from 'gatsby';

import Container from 'components/Container';

const Header = () => {
  return (
    <header>
      <Container type="content">
        <p></p>
        <ul>
          <li>
            <Link to="/"></Link>
          </li>
          <li>
            <Link to="/">TBD</Link>
          </li>
        </ul>
      </Container>
    </header>
  );
};

export default Header;
