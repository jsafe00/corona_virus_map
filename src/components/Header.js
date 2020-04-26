import React from 'react';
import { Link } from 'gatsby';
import github from 'assets/images/github.gif';

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
            <a target='_blank' href={'https://github.com/jsafe00/corona_virus_map'}>
            <img src={github} /></a>
          </li>
        </ul>
      </Container>
    </header>
  );
};

export default Header;
