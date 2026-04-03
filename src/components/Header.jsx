import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled, { keyframes } from "styled-components";
import { signOutAPI } from "../action";

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-light);
  box-shadow: 0 1px 8px rgba(0,0,0,0.06);
`;

const NavInner = styled.div`
  max-width: 1128px;
  margin: 0 auto;
  padding: 0 16px;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Logo = styled.a`
  flex-shrink: 0;
  svg {
    width: 34px;
    height: 34px;
    fill: var(--primary);
    transition: var(--transition);
    &:hover { opacity: 0.85; transform: scale(1.05); }
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  margin-left: 4px;

  @media (max-width: 600px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  width: 220px;
  height: 36px;
  padding: 0 12px 0 36px;
  background: var(--surface-3);
  border: 1.5px solid transparent;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  color: var(--text-primary);
  outline: none;
  transition: var(--transition);

  &::placeholder { color: var(--text-muted); }

  &:focus {
    background: var(--surface);
    border-color: var(--primary);
    width: 260px;
    box-shadow: 0 0 0 3px rgba(10, 102, 194, 0.12);
  }

  @media (max-width: 900px) {
    width: 180px;
    &:focus { width: 200px; }
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: 2px;

  @media (max-width: 768px) {
    gap: 0;
  }
`;

const NavItem = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  height: 52px;
  min-width: 56px;
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 500;
  gap: 3px;
  cursor: pointer;
  transition: var(--transition);
  position: relative;

  svg, img { width: 22px; height: 22px; }

  &:hover {
    color: var(--text-primary);
    background: var(--surface-2);
  }

  &.active {
    color: var(--text-primary);
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 10%;
      right: 10%;
      height: 2.5px;
      background: var(--text-primary);
      border-radius: 2px 2px 0 0;
    }
  }

  @media (max-width: 600px) {
    min-width: 44px;
    padding: 0 6px;
    span { display: none; }
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 28px;
  background: var(--border);
  margin: 0 4px;

  @media (max-width: 600px) { display: none; }
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserBtn = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  height: 52px;
  min-width: 56px;
  background: none;
  border: none;
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 500;
  gap: 3px;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    color: var(--text-primary);
    background: var(--surface-2);
  }

  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
    border: 1.5px solid var(--border);
  }

  @media (max-width: 600px) {
    min-width: 44px;
    padding: 0 6px;
    span { display: none; }
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  width: 220px;
  background: var(--surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-light);
  overflow: hidden;
  animation: ${slideDown} 0.2s ease both;
  z-index: 200;
`;

const DropdownUser = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-light);

  img {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--primary-light);
  }
`;

const DropdownUserInfo = styled.div`
  overflow: hidden;
  strong {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  span {
    font-size: 12px;
    color: var(--text-muted);
  }
`;

const ViewProfile = styled.a`
  display: block;
  margin: 10px 12px;
  padding: 7px 16px;
  border: 1.5px solid var(--primary);
  border-radius: 20px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  transition: var(--transition);
  cursor: pointer;
  &:hover {
    background: var(--primary-light);
  }
`;

const SignOutBtn = styled.button`
  display: block;
  width: 100%;
  padding: 10px 16px;
  background: none;
  border: none;
  border-top: 1px solid var(--border-light);
  text-align: left;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
  font-family: inherit;
  &:hover { background: var(--surface-2); color: var(--text-primary); }
`;

function Header({ user, signOut }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const close = (e) => { if (!e.target.closest('[data-menu]')) setMenuOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <Nav style={scrolled ? { boxShadow: '0 2px 16px rgba(0,0,0,0.10)' } : {}}>
      <NavInner>
        <Logo href="/">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </Logo>

        <SearchWrapper>
          <SearchIcon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </SearchIcon>
          <SearchInput placeholder="Search..." />
        </SearchWrapper>

        <NavItems>
          <NavItem className="active">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span>Home</span>
          </NavItem>
          <NavItem>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
            <span>Network</span>
          </NavItem>
          <NavItem>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 6h-2.18c.07-.44.18-.88.18-1.35C18 2.55 15.86.5 13.5.5c-1.3 0-2.4.56-3.2 1.46L10 2.4l-.3-.44C8.9 1.06 7.7.5 6.5.5 4.14.5 2 2.55 2 4.65c0 .47.11.91.18 1.35H0v2h2v12h8v-4h4v4h8V8h2V6zm-8 10h-2v-2h-2v2H4V8h12v8z"/>
            </svg>
            <span>Jobs</span>
          </NavItem>
          <NavItem>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
            <span>Messages</span>
          </NavItem>
          <NavItem>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
            <span>Alerts</span>
          </NavItem>

          <Divider />

          <UserMenu data-menu="user">
            <UserBtn onClick={() => setMenuOpen(!menuOpen)}>
              {user?.photoURL
                ? <img src={user.photoURL} alt={user.displayName} />
                : <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
              }
              <span>Me ▾</span>
            </UserBtn>

            {menuOpen && (
              <Dropdown>
                <DropdownUser>
                  {user?.photoURL
                    ? <img src={user.photoURL} alt={user.displayName} />
                    : <svg width="42" height="42" viewBox="0 0 24 24" fill="var(--text-muted)"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                  }
                  <DropdownUserInfo>
                    <strong>{user?.displayName || 'User'}</strong>
                    <span>{user?.email || ''}</span>
                  </DropdownUserInfo>
                </DropdownUser>
                <ViewProfile>View Profile</ViewProfile>
                <SignOutBtn onClick={() => { signOut(); setMenuOpen(false); }}>
                  Sign Out
                </SignOutBtn>
              </Dropdown>
            )}
          </UserMenu>
        </NavItems>
      </NavInner>
    </Nav>
  );
}

const mapStateToProps = (state) => ({ user: state.userState.user });
const mapDispatchToProps = (dispatch) => ({ signOut: () => dispatch(signOutAPI()) });

export default connect(mapStateToProps, mapDispatchToProps)(Header);