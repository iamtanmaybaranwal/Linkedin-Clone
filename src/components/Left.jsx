import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

const Sidebar = styled.div`
  grid-area: left;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const ProfileCard = styled.div`
  background: var(--surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  animation: fadeInUp 0.3s ease both;
`;

const ProfileBg = styled.div`
  height: 72px;
  background: linear-gradient(135deg, #0a66c2 0%, #0d4f96 50%, #064279 100%);
  position: relative;
`;

const ProfileAvatar = styled.div`
  position: absolute;
  bottom: -28px;
  left: 50%;
  transform: translateX(-50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 3px solid var(--surface);
  overflow: hidden;
  background: var(--surface-2);
  box-shadow: var(--shadow-sm);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileBody = styled.div`
  padding: 36px 16px 16px;
  text-align: center;
`;

const ProfileName = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 3px;
  line-height: 1.3;
`;

const ProfileBio = styled.p`
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 12px;
  line-height: 1.4;
`;

const ProfileStats = styled.div`
  border-top: 1px solid var(--border-light);
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatRow = styled.a`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 6px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition);
  text-decoration: none;

  &:hover { background: var(--surface-2); }

  span:first-child {
    font-size: 12px;
    color: var(--text-secondary);
    font-weight: 500;
  }
  span:last-child {
    font-size: 13px;
    font-weight: 700;
    color: var(--primary);
  }
`;

const PremiumCard = styled.div`
  background: var(--surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
  padding: 14px 16px;
  animation: fadeInUp 0.35s ease 0.1s both;
`;

const PremiumLink = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
  padding: 6px;
  border-radius: var(--radius-sm);

  &:hover { background: var(--surface-2); color: var(--text-primary); }

  svg { flex-shrink: 0; }
`;

const PremiumText = styled.div`
  strong { display: block; font-size: 13px; color: var(--text-primary); font-weight: 600; }
  span { font-size: 12px; color: var(--text-muted); }
`;

const QuickLinksCard = styled.div`
  background: var(--surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
  padding: 14px 16px;
  animation: fadeInUp 0.35s ease 0.15s both;
`;

const QuickLink = styled.a`
  display: block;
  padding: 6px 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition);

  &:hover { background: var(--surface-2); color: var(--primary); padding-left: 10px; }
`;

function Left({ user }) {
  return (
    <Sidebar>
      <ProfileCard>
        <ProfileBg>
          <ProfileAvatar>
            {user?.photoURL
              ? <img src={user.photoURL} alt={user.displayName} />
              : <svg viewBox="0 0 24 24" fill="var(--text-muted)" style={{width:'100%',height:'100%'}}><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
            }
          </ProfileAvatar>
        </ProfileBg>
        <ProfileBody>
          <ProfileName>{user?.displayName || 'Tanmay Baranwal'}</ProfileName>
          <ProfileBio>Full Stack Developer · Building cool things</ProfileBio>
          <ProfileStats>
            <StatRow>
              <span>Profile viewers</span>
              <span>142</span>
            </StatRow>
            <StatRow>
              <span>Post impressions</span>
              <span>1,847</span>
            </StatRow>
          </ProfileStats>
        </ProfileBody>
      </ProfileCard>

      <PremiumCard>
        <PremiumLink>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="gold">
            <path d="M12 1L15.5 8.5L24 9.27L18 15.14L19.18 24L12 20.27L4.82 24L6 15.14L0 9.27L8.5 8.5L12 1Z"/>
          </svg>
          <PremiumText>
            <strong>Try Premium free</strong>
            <span>Get hired faster, grow your career</span>
          </PremiumText>
        </PremiumLink>
      </PremiumCard>

      <QuickLinksCard>
        <QuickLink>Groups</QuickLink>
        <QuickLink>Events</QuickLink>
        <QuickLink>Followed Hashtags</QuickLink>
        <QuickLink style={{color:'var(--primary)', fontWeight:600, marginTop:4}}>
          Discover more →
        </QuickLink>
      </QuickLinksCard>
    </Sidebar>
  );
}

const mapStateToProps = (state) => ({ user: state.userState.user });

export default connect(mapStateToProps)(Left);