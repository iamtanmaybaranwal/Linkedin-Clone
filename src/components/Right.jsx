import React from "react";
import styled from "styled-components";

const Sidebar = styled.div`
  grid-area: right;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const Card = styled.div`
  background: var(--surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
  padding: 16px;
  animation: fadeInUp 0.35s ease both;
`;

const CardTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  a {
    font-size: 12px;
    font-weight: 500;
    color: var(--primary);
    cursor: pointer;
    &:hover { text-decoration: underline; }
  }
`;

const NewsItem = styled.div`
  display: flex;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-light);
  cursor: pointer;
  transition: var(--transition);

  &:last-child { border-bottom: none; padding-bottom: 0; }
  &:first-of-type { padding-top: 0; }

  &:hover { opacity: 0.8; }
`;

const NewsNumber = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: var(--text-muted);
  flex-shrink: 0;
  width: 16px;
  padding-top: 1px;
`;

const NewsContent = styled.div`
  strong {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.3;
    margin-bottom: 2px;
  }
  span {
    font-size: 11px;
    color: var(--text-muted);
  }
`;

const SuggestionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-light);

  &:last-child { border-bottom: none; padding-bottom: 0; }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.color || '#0a66c2'} 0%, ${props => props.color2 || '#004182'} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
`;

const SuggestionInfo = styled.div`
  flex: 1;
  overflow: hidden;
  strong {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  span {
    font-size: 11px;
    color: var(--text-muted);
  }
`;

const ConnectBtn = styled.button`
  padding: 5px 14px;
  border: 1.5px solid var(--primary);
  border-radius: 16px;
  background: none;
  color: var(--primary);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
  font-family: inherit;

  &:hover {
    background: var(--primary-light);
  }
`;

const FooterLinks = styled.div`
  padding: 12px 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;

  a {
    font-size: 11px;
    color: var(--text-muted);
    cursor: pointer;
    &:hover { color: var(--primary); text-decoration: underline; }
  }
`;

const suggestions = [
  { name: "Priya Sharma", role: "Frontend Dev @ Google", initials: "PS", color: "#7c3aed", color2: "#4c1d95" },
  { name: "Rohit Kumar", role: "SDE-2 @ Amazon", initials: "RK", color: "#dc2626", color2: "#991b1b" },
  { name: "Ananya Singh", role: "Product Manager @ Swiggy", initials: "AS", color: "#059669", color2: "#065f46" },
];

const news = [
  { title: "India's startup ecosystem hits record funding", time: "2h ago · 4,821 readers" },
  { title: "AI tools reshaping software development in 2026", time: "4h ago · 12.4K readers" },
  { title: "Remote work trends: What's changed in tech hiring", time: "6h ago · 8,102 readers" },
  { title: "LinkedIn rolls out new creator monetization features", time: "1d ago · 3,240 readers" },
];

export default function Right() {
  return (
    <Sidebar>
      <Card>
        <CardTitle>
          LinkedIn News
          <a>ⓘ</a>
        </CardTitle>
        {news.map((item, i) => (
          <NewsItem key={i}>
            <NewsNumber>{i + 1}</NewsNumber>
            <NewsContent>
              <strong>{item.title}</strong>
              <span>{item.time}</span>
            </NewsContent>
          </NewsItem>
        ))}
      </Card>

      <Card style={{ animationDelay: '0.1s' }}>
        <CardTitle>People you may know</CardTitle>
        {suggestions.map((s, i) => (
          <SuggestionItem key={i}>
            <Avatar color={s.color} color2={s.color2}>{s.initials}</Avatar>
            <SuggestionInfo>
              <strong>{s.name}</strong>
              <span>{s.role}</span>
            </SuggestionInfo>
            <ConnectBtn>+ Connect</ConnectBtn>
          </SuggestionItem>
        ))}
      </Card>

      <FooterLinks>
        {['About','Help','Privacy','Terms','Advertising','Services','More'].map(l => (
          <a key={l}>{l}</a>
        ))}
        <a style={{width:'100%', marginTop:2}}>LinkedIn Corp © 2026</a>
      </FooterLinks>
    </Sidebar>
  );
}