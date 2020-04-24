import React from 'react';
import { Link } from 'gatsby';

import Container from 'components/Container';

const Header = () => {
  return (
    <header>
      <Container type="content">
        <p>COVID Tracker </p>
        <ul>
          <li>
            <Link to="/">COVID Tracker</Link>
          </li>
          <li>
            <Link to="/page-2/">TBD</Link>
          </li>
        </ul>
      </Container>
    </header>
  );
};

export default Header;
