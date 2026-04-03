import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Left from "./Left";
import Main from "./Main";
import Right from "./Right";

const Layout = styled.div`
  max-width: 1128px;
  margin: 0 auto;
  padding: 24px 16px;
  display: grid;
  grid-template-areas: "left main right";
  grid-template-columns: 225px 1fr 300px;
  gap: 20px;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-areas: "left main";
    grid-template-columns: 210px 1fr;
  }

  @media (max-width: 768px) {
    grid-template-areas: "main";
    grid-template-columns: 1fr;
    padding: 12px 12px;
    gap: 10px;
  }
`;

function Home(props) {
  if (!props.user) return null;

  return (
    <Layout>
      <Left />
      <Main />
      <Right />
    </Layout>
  );
}

const mapStateToProps = (state) => ({ user: state.userState.user });

export default connect(mapStateToProps)(Home);