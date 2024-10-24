import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import MazeGenerator from '../components/MazeGenerator';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Maze Generator</title>
        <meta name="description" content="Generate perfect mazes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Maze Generator</h1>
        <MazeGenerator />
      </main>
    </div>
  );
}