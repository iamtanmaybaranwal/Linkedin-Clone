import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ReactPlayer from "react-player";
import styled, { keyframes, css } from "styled-components";
import { getArticlesAPI, updateArticleAPI } from "../action";
import PostalModal from "./PostalModal";
import db from "../firebase";

// ─── Animations ───────────────────────────────────────────────
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const likePopkf = keyframes`
  0%   { transform: scale(1); }
  40%  { transform: scale(1.35); }
  70%  { transform: scale(0.9); }
  100% { transform: scale(1); }
`;

// ─── Layout ───────────────────────────────────────────────────
const Container = styled.div`
  grid-area: main;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// ─── Share Box ────────────────────────────────────────────────
const ShareBox = styled.div`
  background: var(--surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
  padding: 14px 16px 10px;
  animation: ${fadeInUp} 0.3s ease both;
`;

const ShareTop = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const UserAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid var(--border-light);
  background: var(--surface-2);

  img { width: 100%; height: 100%; object-fit: cover; display: block; }
`;

const StartPostBtn = styled.button`
  flex: 1;
  height: 44px;
  padding: 0 16px;
  background: none;
  border: 1.5px solid var(--border);
  border-radius: 22px;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  font-family: inherit;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    border-color: var(--primary);
    background: var(--surface-3);
    color: var(--text-primary);
  }

  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const ShareActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  border-top: 1px solid var(--border-light);
  padding-top: 6px;
`;

const ShareActionBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  background: none;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
  font-family: inherit;

  &:hover { background: var(--surface-2); color: var(--text-primary); }

  img { width: 20px; height: 20px; }

  @media (max-width: 500px) {
    padding: 8px;
    span { display: none; }
  }
`;

// ─── Post Card ────────────────────────────────────────────────
const Article = styled.div`
  background: var(--surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  animation: ${fadeInUp} 0.35s ease both;
  animation-delay: ${props => props.$delay || '0s'};
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: var(--shadow-md);
  }
`;

const PostHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 14px 16px 10px;
`;

const ActorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
`;

const ActorAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid var(--border-light);
  background: var(--surface-2);
  cursor: pointer;

  img { width: 100%; height: 100%; object-fit: cover; display: block; }
`;

const ActorDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ActorName = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  cursor: pointer;
  &:hover { color: var(--primary); text-decoration: underline; }
`;

const ActorEmail = styled.span`
  font-size: 12px;
  color: var(--text-secondary);
`;

const ActorDate = styled.span`
  font-size: 11px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 3px;

  &::before {
    content: '·';
    margin-right: 2px;
  }
`;

const EllipsisBtn = styled.button`
  background: none;
  border: none;
  padding: 6px;
  border-radius: 50%;
  cursor: pointer;
  color: var(--text-muted);
  transition: var(--transition);
  display: flex;
  align-items: center;
  flex-shrink: 0;

  &:hover { background: var(--surface-2); color: var(--text-primary); }
`;

const PostDescription = styled.p`
  padding: 0 16px 12px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-primary);
  white-space: pre-wrap;
`;

const PostMedia = styled.div`
  width: 100%;
  background: var(--surface-2);
  overflow: hidden;

  img {
    width: 100%;
    height: auto;
    display: block;
    max-height: 500px;
    object-fit: cover;
  }
`;

// ─── Social Count ─────────────────────────────────────────────
const SocialCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-bottom: 1px solid var(--border-light);
`;

const LikeCount = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-muted);
  cursor: pointer;
  &:hover { color: var(--primary); text-decoration: underline; }
`;

const LikeBubble = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: #0a66c2;
  border-radius: 50%;
  font-size: 11px;
`;

// ─── Social Actions ───────────────────────────────────────────
const SocialActions = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  flex-wrap: wrap;
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  border: none;
  background: none;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
  font-family: inherit;
  flex: 1;
  justify-content: center;

  &:hover {
    background: var(--surface-2);
    color: var(--text-primary);
  }

  &.liked {
    color: var(--primary);
    svg { fill: var(--primary); animation: ${likePopkf} 0.4s ease; }
  }

  svg { width: 20px; height: 20px; fill: currentColor; flex-shrink: 0; }
  img { width: 20px; height: 20px; flex-shrink: 0; }

  @media (max-width: 500px) {
    padding: 8px 6px;
    span { display: none; }
  }
`;

const DeleteBtn = styled(ActionBtn)`
  color: #dc2626;
  &:hover { background: #fef2f2; color: #b91c1c; }
`;

// ─── Empty State ──────────────────────────────────────────────
const EmptyState = styled.div`
  background: var(--surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  padding: 48px 24px;
  text-align: center;
  animation: ${fadeInUp} 0.3s ease both;

  svg { width: 56px; height: 56px; fill: var(--border); margin: 0 auto 12px; }
  h3 { font-size: 16px; color: var(--text-secondary); margin-bottom: 4px; }
  p { font-size: 13px; color: var(--text-muted); }
`;

// ─── Loader ───────────────────────────────────────────────────
const LoaderWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: 32px;
`;

const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;

  @keyframes spin { to { transform: rotate(360deg); } }
`;

// ─── Component ────────────────────────────────────────────────
function Main(props) {
  const [showModal, setShowModal] = useState("close");

  useEffect(() => {
    props.getArticles();
  }, []);

  const clickHandler = (event) => {
    event.preventDefault();
    if (event.target !== event.currentTarget) return;
    setShowModal(prev => prev === "open" ? "close" : "open");
  };

  const handleDelete = (articleId) => {
    if (window.confirm("Delete this post?")) {
      db.collection("articles").doc(articleId).delete()
        .then(() => props.getArticles())
        .catch(err => { console.error(err); alert("Failed to delete."); });
    }
  };

  const likeHandler = (event, postIndex, id) => {
    event.preventDefault();
    let currentLikes = props.articles[postIndex].likes.count;
    let whoLiked = [...props.articles[postIndex].likes.whoLiked];
    const user = props.user.email;
    const userIndex = whoLiked.indexOf(user);

    if (userIndex >= 0) {
      currentLikes--;
      whoLiked.splice(userIndex, 1);
    } else {
      currentLikes++;
      whoLiked.push(user);
    }

    props.likeHandler({ update: { likes: { count: currentLikes, whoLiked } }, id });
  };

  return (
    <Container>
      {/* ── Share Box ── */}
      <ShareBox>
        <ShareTop>
          <UserAvatar>
            {props.user?.photoURL
              ? <img src={props.user.photoURL} alt="" />
              : <svg viewBox="0 0 24 24" fill="var(--text-muted)" style={{width:'100%',height:'100%'}}><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
            }
          </UserAvatar>
          <StartPostBtn
            onClick={clickHandler}
            disabled={!!props.loading}
          >
            What's on your mind, {props.user?.displayName?.split(' ')[0] || 'you'}?
          </StartPostBtn>
        </ShareTop>
        <ShareActions>
          <ShareActionBtn>
            <img src="/images/photo-icon.svg" alt="" />
            <span>Photo</span>
          </ShareActionBtn>
          <ShareActionBtn>
            <img src="/images/video-icon.svg" alt="" />
            <span>Video</span>
          </ShareActionBtn>
          <ShareActionBtn>
            <img src="/images/event-icon.svg" alt="" />
            <span>Event</span>
          </ShareActionBtn>
          <ShareActionBtn>
            <img src="/images/article-icon.svg" alt="" />
            <span>Article</span>
          </ShareActionBtn>
        </ShareActions>
      </ShareBox>

      {/* ── Feed ── */}
      {props.loading && (
        <LoaderWrap><Spinner /></LoaderWrap>
      )}

      {!props.loading && props.articles.length === 0 && (
        <EmptyState>
          <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
          <h3>No posts yet</h3>
          <p>Be the first to share something with your network!</p>
        </EmptyState>
      )}

      {props.articles.map((article, key) => {
        const isOwner = props.user && article.actor.description === props.user.email;
        const isLiked = props.articles[key].likes.whoLiked.indexOf(props.user?.email) >= 0;

        return (
          <Article key={key} $delay={`${key * 0.05}s`}>
            {/* Header */}
            <PostHeader>
              <ActorInfo>
                <ActorAvatar>
                  {article.actor.image
                    ? <img src={article.actor.image} alt={article.actor.title} />
                    : <svg viewBox="0 0 24 24" fill="var(--text-muted)" style={{width:'100%',height:'100%'}}><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                  }
                </ActorAvatar>
                <ActorDetails>
                  <ActorName>{article.actor.title}</ActorName>
                  <ActorEmail>{article.actor.description}</ActorEmail>
                  <ActorDate>{article.actor.date.toDate().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</ActorDate>
                </ActorDetails>
              </ActorInfo>
              <EllipsisBtn title="More options">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
                </svg>
              </EllipsisBtn>
            </PostHeader>

            {/* Description */}
            {article.description && (
              <PostDescription>{article.description}</PostDescription>
            )}

            {/* Media */}
            {(article.sharedImg || article.video) && (
              <PostMedia>
                {article.video
                  ? <ReactPlayer width="100%" url={article.video} controls />
                  : <img src={article.sharedImg} alt="Post media" />
                }
              </PostMedia>
            )}

            {/* Counts */}
            {props.articles[key].likes.count > 0 && (
              <SocialCount>
                <LikeCount>
                  <LikeBubble>👍</LikeBubble>
                  {props.articles[key].likes.count} {props.articles[key].likes.count === 1 ? 'like' : 'likes'}
                </LikeCount>
                <span style={{fontSize:13, color:'var(--text-muted)', cursor:'pointer'}}>
                  {article.comments || 0} comments
                </span>
              </SocialCount>
            )}

            {/* Actions */}
            <SocialActions>
              <ActionBtn
                onClick={(e) => likeHandler(e, key, props.ids[key])}
                className={isLiked ? 'liked' : ''}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M19.46 11l-3.91-3.91a7 7 0 01-1.69-2.74l-.49-1.47A2.76 2.76 0 0010.76 1 2.75 2.75 0 008 3.74v1.12a9.19 9.19 0 00.46 2.85L8.89 9H4.12A2.12 2.12 0 002 11.12a2.16 2.16 0 00.92 1.76A2.11 2.11 0 002 14.62a2.14 2.14 0 001.28 2 2 2 0 00-.28 1 2.12 2.12 0 002 2.12v.14A2.12 2.12 0 007.12 22h7.49a8.08 8.08 0 003.58-.84l.31-.16H21V11zM19 19h-1l-.73.37a6.14 6.14 0 01-2.69.63H7.72a1 1 0 01-1-.72l-.25-.87-.85-.41A1 1 0 015 17l.17-1-.76-.74A1 1 0 014.27 14l.66-1.09-.73-1.1a.49.49 0 01.08-.7.48.48 0 01.34-.11h7.05l-1.31-3.92A7 7 0 0110 4.86V3.75a.77.77 0 01.75-.75.75.75 0 01.71.51L12 5a9 9 0 002.13 3.5l4.5 4.5H19z"/>
                </svg>
                <span>{isLiked ? 'Liked' : 'Like'}</span>
              </ActionBtn>

              <ActionBtn>
                <img src="/images/comment-icon.svg" alt="" />
                <span>Comment</span>
              </ActionBtn>

              <ActionBtn>
                <img src="/images/share-icon.svg" alt="" />
                <span>Share</span>
              </ActionBtn>

              <ActionBtn>
                <img src="/images/send-icon.svg" alt="" />
                <span>Send</span>
              </ActionBtn>

              {isOwner && (
                <DeleteBtn onClick={() => handleDelete(props.ids[key])} title="Delete post">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                  <span>Delete</span>
                </DeleteBtn>
              )}
            </SocialActions>
          </Article>
        );
      })}

      <PostalModal showModal={showModal} clickHandler={clickHandler} />
    </Container>
  );
}

const mapStateToProps = (state) => ({
  user: state.userState.user,
  loading: state.articleState.loading,
  articles: state.articleState.articles,
  ids: state.articleState.ids,
});

const mapDispatchToProps = (dispatch) => ({
  getArticles: () => dispatch(getArticlesAPI()),
  likeHandler: (payload) => dispatch(updateArticleAPI(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);