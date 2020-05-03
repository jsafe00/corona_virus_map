import React from 'react';
import { Link } from 'gatsby';
import github from 'assets/images/github.gif';
import globe from 'assets/images/globe.png';

import Container from 'components/Container';

const Header = () => {
  return (
    <header>
      <Container type="content">
        <ul>         
        <li><Link to="/">WORLD</Link></li>
        </ul>
        <ul>
         
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
