import { useState, useEffect, useCallback } from 'react';
//
import ScoreBoard from './components/ScoreBoard';
//
import blueCandy from './images/blue-candy.png';
import greenCandy from './images/green-candy.png';
import orangeCandy from './images/orange-candy.png';
import purpleCandy from './images/purple-candy.png';
import redCandy from './images/blue-candy.png';
import yellowCandy from './images/yellow-candy.png';
import blank from './images/blank.png';

const width = 8;
const candyColors = [blueCandy, greenCandy, orangeCandy, purpleCandy, redCandy, yellowCandy];

const App = () => {
	const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
	const [squareBeingDragged, setSquareBeingDragged] = useState(null);
	const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);
	const [scoreDisplay, setScoreDisplay] = useState(0);
	const [movesDisplay, setMovesDisplay] = useState(0);

	const createBoard = () => {
		const randomColorArrangement = [];

		for (let i = 0; i < width * width; i++) {
			const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];

			randomColorArrangement.push(randomColor);
		}

		setCurrentColorArrangement(randomColorArrangement);
	};

	const checkForColumnOfThree = useCallback(() => {
		for (let i = 0; i <= 47; i++) {
			const columnOfThree = [i, i + width, i + width * 2];
			const decidedColor = currentColorArrangement[i];
			const isBlank = currentColorArrangement[i] === blank;

			if (columnOfThree.every((square) => currentColorArrangement[square] === decidedColor && !isBlank)) {
				setScoreDisplay((prevScore) => prevScore + 3);

				columnOfThree.forEach((square) => (currentColorArrangement[square] = blank));
				return true;
			}
		}
	}, [currentColorArrangement]);

	const checkForRowOfThree = useCallback(() => {
		for (let i = 0; i < 64; i++) {
			const rowOfThree = [i, i + 1, i + 2];
			const decidedColor = currentColorArrangement[i];
			const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64];
			const isBlank = currentColorArrangement[i] === blank;

			if (notValid.includes(i)) continue;

			if (rowOfThree.every((square) => currentColorArrangement[square] === decidedColor && !isBlank)) {
				setScoreDisplay((prevScore) => prevScore + 3);

				rowOfThree.forEach((square) => (currentColorArrangement[square] = blank));
				return true;
			}
		}
	}, [currentColorArrangement]);

	const checkForColumnOfFour = useCallback(() => {
		for (let i = 0; i <= 39; i++) {
			const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
			const decidedColor = currentColorArrangement[i];
			const isBlank = currentColorArrangement[i] === blank;

			if (columnOfFour.every((square) => currentColorArrangement[square] === decidedColor && !isBlank)) {
				setScoreDisplay((prevScore) => prevScore + 4);

				columnOfFour.forEach((square) => (currentColorArrangement[square] = blank));
				return true;
			}
		}
	}, [currentColorArrangement]);

	const checkForRowOfFour = useCallback(() => {
		for (let i = 0; i < 64; i++) {
			const rowOfFour = [i, i + 1, i + 2, i + 3];
			const decidedColor = currentColorArrangement[i];
			const notValid = [
				5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64,
			];
			const isBlank = currentColorArrangement[i] === blank;

			if (notValid.includes(i)) continue;

			if (rowOfFour.every((square) => currentColorArrangement[square] === decidedColor && !isBlank)) {
				setScoreDisplay((prevScore) => prevScore + 4);

				rowOfFour.forEach((square) => (currentColorArrangement[square] = blank));
				return true;
			}
		}
	}, [currentColorArrangement]);

	const moveIntoSquareBelow = useCallback(() => {
		for (let i = 0; i <= 55; i++) {
			const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
			const isFirstRow = firstRow.includes(i);

			if (isFirstRow && currentColorArrangement[i] === blank) {
				let randomNumber = Math.floor(Math.random() * candyColors.length);
				currentColorArrangement[i] = candyColors[randomNumber];
			}

			if (currentColorArrangement[i + width] === blank) {
				currentColorArrangement[i + width] = currentColorArrangement[i];
				currentColorArrangement[i] = blank;
			}
		}
	}, [currentColorArrangement]);

	const dragStart = (e) => {
		setSquareBeingDragged(e.target);
	};

	const dragDrop = (e) => {
		setSquareBeingReplaced(e.target);
	};

	const dragEnd = () => {
		const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'));
		const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'));

		currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.getAttribute('src');
		currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src');

		const validMoves = [
			squareBeingDraggedId - 1,
			squareBeingDraggedId - width,
			squareBeingDraggedId + 1,
			squareBeingDraggedId + width,
		];

		const validMove = validMoves.includes(squareBeingReplacedId);

		const isAColumnOfFour = checkForColumnOfFour();
		const isARowOfFour = checkForRowOfFour();
		const isAColumnOfThree = checkForColumnOfThree();
		const isARowOfThree = checkForRowOfThree();

		if (
			squareBeingDraggedId &&
			validMove &&
			(isAColumnOfFour || isAColumnOfThree || isARowOfFour || isARowOfThree)
		) {
			setSquareBeingDragged(null);
			setSquareBeingReplaced(null);
			setMovesDisplay((prevMoves) => prevMoves + 1);
		} else {
			currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src');
			currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute('src');
			setCurrentColorArrangement([...currentColorArrangement]);
		}
	};

	useEffect(() => {
		createBoard();
	}, []);

	useEffect(() => {
		const timer = setInterval(() => {
			checkForColumnOfFour();
			checkForRowOfFour();
			checkForColumnOfThree();
			checkForRowOfThree();
			moveIntoSquareBelow();
			setCurrentColorArrangement([...currentColorArrangement]);
		}, 100);

		return () => clearInterval(timer);
	}, [
		checkForColumnOfFour,
		checkForRowOfFour,
		checkForColumnOfThree,
		checkForRowOfThree,
		moveIntoSquareBelow,
		currentColorArrangement,
	]);

	return (
		<div className="app">
			<ScoreBoard score={scoreDisplay} moves={movesDisplay} />
			<div className="game">
				{currentColorArrangement.map((candyColor, idx) => (
					<img
						key={idx}
						src={candyColor}
						alt={candyColor}
						data-id={idx}
						draggable
						onDragStart={dragStart}
						onDragOver={(e) => e.preventDefault()}
						onDragEnter={(e) => e.preventDefault()}
						onDragLeave={(e) => e.preventDefault()}
						onDrop={dragDrop}
						onDragEnd={dragEnd}
					/>
				))}
			</div>
		</div>
	);
};

export default App;
