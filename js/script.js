var vm = new Vue({
	el: '#vm',
	data: {
		gridWidth: 10,
		gridHeight: 20,
		totalMines: 40,
		squareData: [],
		windowHeight: 0,
		firstClick: true,
		gameOver: false,
		safeRemaining: 0
	},
	computed: {
		totalSquares: function() {
			return this.gridWidth * this.gridHeight;
		},
		safeSquares: function() {
			return this.totalSquares - this.totalMines;
		},
		squareWidth: function() {
			return 100 / this.gridWidth;
		},
		gridMaxWidth: function() {
			return this.gridWidth * 50;
		}
	},
	methods: {
		clickSquare: function(thisNumber) {
			if(!this.squareData[thisNumber].clicked && !this.squareData[thisNumber].flagged && !this.gameOver) {
				this.squareData[thisNumber].clicked = true;

				if(this.squareData[thisNumber].hasMine) {
					if(this.firstClick) {
						this.newGame();
						this.clickSquare(thisNumber);
					} else {
						if(!this.gameOver) {
							this.showAllMines();
							this.gameOver = true;
							alert('YOU HIT A MINE!');
						}
					}
				} else {
					this.safeRemaining --;
					this.firstClick = false;
					var thisNeighbours = this.getNeighbours(thisNumber).slice(0);
					var thisTotalSurroundingMines = this.getSurroundingMines(thisNeighbours);
					this.squareData[thisNumber].surroundingMines = thisTotalSurroundingMines;
					if (!thisTotalSurroundingMines) {
						for (var i = 0; i < thisNeighbours.length; i++) {
							var neighbourNo = thisNeighbours[i];
							if(!this.squareData[neighbourNo].clicked) {
								this.clickSquare(thisNeighbours[i]);
							}
						}
					}
				}
			}
		},
		rightClickSquare: function(thisNumber) {
			if(!this.gameOver) {
				if(this.squareData[thisNumber].clicked) {
					var thisNeighbours = this.getNeighbours(thisNumber).slice(0);
					for (var i = 0; i < thisNeighbours.length; i++) {
						var neighbourNo = thisNeighbours[i];
						if(!this.squareData[neighbourNo].clicked) {
							this.clickSquare(thisNeighbours[i]);
						}
					}
				} else {
					if(this.squareData[thisNumber].flagged) {
						this.squareData[thisNumber].flagged = false;
					} else {
						this.squareData[thisNumber].flagged = true;
					}
				}
			}
		},
		getNeighbours: function(thisNumber) {
			var neighbours = [];
			// top
			if(thisNumber >= this.gridWidth) {
				if (thisNumber % this.gridWidth) {
					neighbours.push((thisNumber - this.gridWidth - 1));
				}
				neighbours.push((thisNumber - this.gridWidth));
				if ((thisNumber + 1) % this.gridWidth) {
					neighbours.push((thisNumber - this.gridWidth + 1));
				}
			}
			// left
			if (thisNumber % this.gridWidth) {
				neighbours.push((thisNumber - 1));
			}
			// right
			if ((thisNumber + 1) % this.gridWidth) {
				neighbours.push((thisNumber + 1));
			}
			// bottom
			if(thisNumber < (this.totalSquares - this.gridWidth)) {
				if (thisNumber % this.gridWidth) {
					neighbours.push((thisNumber + this.gridWidth - 1));
				}
				neighbours.push((thisNumber + this.gridWidth));
				if ((thisNumber + 1) % this.gridWidth) {
					neighbours.push((thisNumber + this.gridWidth + 1));
				}
			}
			return neighbours;
		},
		newGame: function() {
			this.squareData = [];
			this.gameOver = false;
			this.firstClick = true;

			for (var i = 0; i < this.totalSquares; i++) {
				var thisSquareData = {
					surroundingMines: 0,
					clicked: false,
					hasMine: false,
					flagged: false
				};
				if(i < this.totalMines) {
					thisSquareData.hasMine = 1;
				}

				this.safeRemaining = this.totalSquares - this.totalMines;
				this.squareData.push(thisSquareData);
			}

			this.shuffle(this.squareData);
		},
		getSurroundingMines: function(neighboursArray) {
			var totalMines = 0;
			for (var i = 0; i < neighboursArray.length; i++) {
				var neighbourNo = neighboursArray[i];
				totalMines += this.squareData[neighbourNo].hasMine
			}
			return totalMines;
		},
		showAllMines: function() {
			for (var i = 0; i < this.totalSquares; i++) {
				if(this.squareData[i].hasMine) {
					this.squareData[i].clicked = true;
				}
			}
		},
		shuffle: function(array) {
			var currentIndex = array.length, temporaryValue, randomIndex;
			while (0 !== currentIndex) {
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;
				temporaryValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = temporaryValue;
			}
			return array;
		},
		getWindowHeight(event) {
			this.windowHeight = window.innerHeight + 'px';
		}
	},
	beforeMount() {
		this.newGame();
	},
	mounted() {
		this.$nextTick(function() {
			window.addEventListener('resize', this.getWindowHeight);
			this.getWindowHeight()
		})
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.getWindowHeight);
	}
})