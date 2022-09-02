import type { NextPage } from "next";
import Head from "next/head";
import Timeline from "../components/timeline";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>NAV</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Timeline />
      </main>
    </div>
  );
};

export default Home;
