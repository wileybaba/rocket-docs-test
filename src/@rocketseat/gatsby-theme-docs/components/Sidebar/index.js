import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql, Link, useScrollRestoration } from 'gatsby';
import { useSidebar } from '@rocketseat/gatsby-theme-docs-core';

import {
  Container,
  LogoContainer,
  List,
  Heading,
  Item,
  SubItem,
} from './styles';
import { isExternalUrl } from '@rocketseat/gatsby-theme-docs/src/util/url';
import ExternalLink from '@rocketseat/gatsby-theme-docs/src/components/Sidebar/ExternalLink/index';
import InternalLink from '@rocketseat/gatsby-theme-docs/src/components/Sidebar/InternalLink/index';

function ListWithSubItems({ children, text }) {
  return (
    <>
      <Heading>{text}</Heading>
      <SubItem>{children}</SubItem>
    </>
  );
}

function renderLink(link, label) {
  return isExternalUrl(link) ? (
    <ExternalLink link={link} label={label} />
  ) : (
    <InternalLink link={link} label={label} />
  );
}

export default function Sidebar({ isMenuOpen }) {
  const {
    site: {
      siteMetadata: { basePath },
    },
  } = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          basePath
        }
      }
    }
  `);

  const data = useSidebar();

  const sideBarScrollRestoration = useScrollRestoration('sidebar-container');

  return (
    <Container isMenuOpen={isMenuOpen} {...sideBarScrollRestoration}>
      <LogoContainer>
        <Link to={basePath} aria-label="Go to home page">
          <h1>LOGO</h1>
        </Link>
      </LogoContainer>
      <nav>
        <List>
          {data.map(({ node: { label, link, items, id } }) => {
            if (Array.isArray(items)) {
              const subitems = items.map((item) => (
                <Item key={item.link}>{renderLink(item.link, item.label)}</Item>
              ));

              return (
                <ListWithSubItems key={id} text={label}>
                  {subitems}
                </ListWithSubItems>
              );
            }

            return <Item key={id}>{renderLink(link, label)}</Item>;
          })}
        </List>
      </nav>
    </Container>
  );
}

ListWithSubItems.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.node,
  ]).isRequired,
  text: PropTypes.string.isRequired,
};

Sidebar.propTypes = {
  isMenuOpen: PropTypes.bool.isRequired,
};