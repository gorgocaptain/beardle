import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import mytext from './words.js';
import { gsap, Power4 } from 'gsap';

const wordList = mytext;
const wordArray = wordList.split('\n');
const chosen = wordArray[Math.floor(Math.random() * wordArray.length)];
gsap.set(document.getElementsByClassName("error"), {scaleX: 0});


function App() {
  const squareToAnimateRef = useRef(null);
  const currentRowRef = useRef(null); // Declare currentRowRef
  const [squares, setSquares] = useState(Array(30).fill(null));
  const [colors, setColors] = useState(Array(30).fill(''));
  
  const [message, setMessage] = useState(" ");
  const [i, setI] = useState(0);
  const [currentRow, setCurrentRow] = useState(0);
  const [guess, setGuess] = useState(false);
  const detectKeyDown = (e) => {
    
    if(!guess){
      gsap.set(document.getElementsByClassName("error"), {scaleX: 0});
      console.log(chosen);
      if (e.key === 'Enter') {
        const word = squares.slice(currentRow * 5, (currentRow + 1) * 5).join('');
        console.log(word);

        if (i !== 5) {
          console.log('Too short');
          shakeRow();
          setMessage("Too Short!");
          revealError();
          return;
        } else if (!wordList.includes(word.toLowerCase())) {
          console.log('Not a word');
          shakeRow();
          setMessage("Not a word!");
          revealError();
          return;
        } else {
          if (currentRow === 6 && word.toLowerCase() === chosen) {
            setMessage("YOU WIN 💸")
            revealError();
            setGuess(true);
            return;
          }
          else if(currentRow === 6){
            setMessage("YOU LOSE 😔")
            revealError();
            setGuess(true);
            return;
          }
          revealLetters();
          setI(0);
          setCurrentRow(currentRow + 1);
          if (word.toLowerCase() === chosen) {
            console.log('YOU WIN!!!');
            setMessage("YOU WIN 💸")
            setGuess(true);
            revealError();
          }
          let temp = chosen;
          // Set the background color of the previous row to grey
          const prevRow = currentRow;
          const prevRowColors = Array(5).fill(''); // Grey color
          
          
          for (let i = 0; i < 5; i++) {
            if (!temp.includes(word[i].toLowerCase())) {
              prevRowColors[i] = '#CCCCCC';
            }
            if (temp.includes(word[i].toLowerCase()) && word[i].toLowerCase() === temp[i]) {
              prevRowColors[i] = '#50C878';
              temp = temp.substr(0, i) + ' ' + temp.substr(i + 1); // Replace with space
            } else if (temp.includes(word[i].toLowerCase())) {
              prevRowColors[i] = '#FFD300';
              // temp = temp.substr(0, i) + ' ' + temp.substr(i + 1); // Replace with space
            }
          }
          
          


          setColors([...colors.slice(0, prevRow * 5), ...prevRowColors, ...colors.slice(prevRow * 5 + 5)]);
        }
      } else if (e.key.length === 1 && e.key.toUpperCase() !== e.key.toLowerCase()) {
        if (i < 5 && currentRow < 6) {
          const updatedSquares = [...squares];
          updatedSquares[currentRow * 5 + i] = e.key.toUpperCase();
          setSquares(updatedSquares);
          setI(i + 1);
        }
      } else if (e.key === 'Backspace') {
        if (i > 0) {
          const updatedSquares = [...squares];
          updatedSquares[currentRow * 5 + i - 1] = null;
          setSquares(updatedSquares);
          setI(i - 1);
        }
        // Prevent Backspace from moving to the previous row
        e.preventDefault();
      }
    }
  };

  const shakeRow = () => {
    const rowSquares = Array.from(currentRowRef.current.children);

    rowSquares.forEach((square) => {
      gsap.to(square, {
        x: 10, // Adjust the shaking distance
        duration: 0.05,
        ease: Power4.easeInOut,
        repeat: 3, // Number of shakes
        yoyo: true, // Back and forth shaking
      });
    });
  };
  const revealLetters = () =>{
    const rowSquares = Array.from(currentRowRef.current.children);

    
      gsap.set(rowSquares, {scaleY: 0})
      gsap.to(rowSquares, { scaleY:1, duration: 0.5, stagger: 0.2});
    
  }
  const revealError = () =>{
    gsap.set(document.getElementsByClassName("error"), {scaleX: 0});
    gsap.to(document.getElementsByClassName("error"), { scaleX:1, duration: 0.1, stagger: 0.2});
  }

  useEffect(() => {
    document.addEventListener('keydown', detectKeyDown);
    return () => {
      document.removeEventListener('keydown', detectKeyDown);
    };
  }, [squares, i, currentRow]);

  const rows = [];
  for (let row = 0; row <= 6; row++) {
    const rowSquares = squares.slice(row * 5, (row + 1) * 5);
    const rowColors = colors.slice(row * 5, (row + 1) * 5);

    rows.push(
      <div className='row' key={row} ref={row === currentRow ? currentRowRef : null}>
        {rowSquares.map((square, index) => (
          <div
            className='square'
            key={index}
            style={{ backgroundColor: rowColors[index] }}
            ref={squareToAnimateRef} // Keep this ref for individual square animation if needed
          >
            {square}
          </div>
        ))}
      </div>
    );
  }

  return <>
    <div className='title'>
      <h1 className='bear'>Bear</h1>
      <h1 className='dle'>dle</h1>
    </div>
    <h1 className='error' >{message}</h1>
    {rows}
  </>;
}

export default App;
