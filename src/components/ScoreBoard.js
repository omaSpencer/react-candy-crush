import React from 'react';

const ScoreBoard = ({ score, moves }) => {
	return (
		<div className="score-board">
			<h2>Score: {score}</h2>
			<h3>Moves: {moves}</h3>
		</div>
	);
};

export default ScoreBoard;
