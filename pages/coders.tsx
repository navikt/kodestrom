import type { NextPage } from "next";
import Head from "next/head";
import Coders from "../components/coders";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>NAV</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Coders />
      </main>
    </div>
  );
};

export default Home;
