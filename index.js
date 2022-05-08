const canvas = document.querySelector('canvas');

const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const offset = {
	x: -400,
	y: -850,
};

const collisionsMap = [];
for (let i = 0; i < collisions.length - 1; i += 70) {
	collisionsMap.push(collisions.slice(i, 70 + i));
}

const battleZonesMap = [];
for (let i = 0; i < battleZones.length - 1; i += 70) {
	battleZonesMap.push(battleZones.slice(i, 70 + i));
}

const boundaries = [];

collisionsMap.forEach((row, i) => {
	row.forEach((symbol, j) => {
		if (symbol !== 1025) return;
		boundaries.push(
			new Boundary({
				position: {
					x: j * Boundary.width + offset.x,
					y: i * Boundary.height + offset.y,
				},
			})
		);
	});
});

const battleZonesTiles = [];

battleZonesMap.forEach((row, i) => {
	row.forEach((symbol, j) => {
		if (symbol !== 1025) return;
		battleZonesTiles.push(
			new Boundary({
				position: {
					x: j * Boundary.width + offset.x,
					y: i * Boundary.height + offset.y,
				},
			})
		);
	});
});

const playerDown = new Image();
playerDown.src = './Assets/playerDown.png';

const playerUp = new Image();
playerUp.src = './Assets/playerUp.png';

const playerLeft = new Image();
playerLeft.src = './Assets/playerLeft.png';

const playerRight = new Image();
playerRight.src = './Assets/playerRight.png';

const backgroundImage = new Image();
backgroundImage.src = './Assets/zoomed.png';

const foregroundImage = new Image();
foregroundImage.src = './Assets/foreground.png';

const player = new Sprite({
	position: {
		x: canvas.width / 2 - 192 / 4 / 2,
		y: canvas.height / 2 - 68 / 2,
	},
	image: playerDown,
	frames: { max: 4 },
	sprites: {
		up: playerUp,
		down: playerDown,
		left: playerLeft,
		right: playerRight,
	},
});

const background = new Sprite({
	position: { x: offset.x, y: offset.y },
	image: backgroundImage,
});

const foreground = new Sprite({
	position: { x: offset.x, y: offset.y },
	image: foregroundImage,
});

const keys = {
	w: {
		pressed: false,
	},
	a: {
		pressed: false,
	},
	s: {
		pressed: false,
	},
	d: {
		pressed: false,
	},
};

const movables = [background, foreground, ...battleZonesTiles, ...boundaries];

function rectangularCollision(r1, r2) {
	return (
		r1.position.x + r1.width + 1 >= r2.position.x &&
		r1.position.x + 1 <= r2.position.x + r2.width &&
		r1.position.y + 1 <= r2.position.y + r2.height &&
		r1.position.y + 1 + r1.height >= r2.position.y
	);
}
function animate() {
	window.requestAnimationFrame(animate);

	background.draw();
	boundaries.forEach(boundary => {
		boundary.draw();
	});
	battleZonesTiles.forEach(tile => tile.draw());
	player.draw();
	foreground.draw();
	let moving = true;

	if (keys.a.pressed || keys.d.pressed || keys.s.pressed || keys.w.pressed) {
		for (let battleZ of battleZonesTiles) {
			const overlap =
				(Math.min(
					player.position.x + player.width,
					battleZ.position.x + battleZ.width
				) -
					Math.max(player.position.x, battleZ.position.x)) *
				(Math.min(
					player.position.y + player.height,
					battleZ.position.y + battleZ.height
				) -
					Math.max(player.position.y, battleZ.position.y));

			// console.log(boundary);
			if (
				rectangularCollision(player, battleZ) &&
				overlap > (player.width * player.height) / 2
			) {
				console.log('btzon');
				break;
			}
		}
	}

	player.moving = false;
	if (keys.w.pressed && lastKey === 'w') {
		player.moving = true;
		player.image = player.sprites.up;
		for (let boundary of boundaries) {
			// console.log(boundary);
			if (
				rectangularCollision(player, {
					...boundary,
					position: {
						x: boundary.position.x,
						y: boundary.position.y + 3,
					},
				})
			) {
				moving = false;

				break;
			}
		}

		if (moving) movables.forEach(movable => (movable.position.y += 3));
	} else if (keys.a.pressed && lastKey === 'a') {
		player.moving = true;
		player.image = player.sprites.left;

		for (let boundary of boundaries) {
			// console.log(boundary);
			if (
				rectangularCollision(player, {
					...boundary,
					position: {
						x: boundary.position.x + 3,
						y: boundary.position.y,
					},
				})
			) {
				moving = false;
				break;
			}
		}

		if (moving) movables.forEach(movable => (movable.position.x += 3));
	} else if (keys.s.pressed && lastKey === 's') {
		player.moving = true;
		player.image = player.sprites.down;

		for (let boundary of boundaries) {
			// console.log(boundary);
			if (
				rectangularCollision(player, {
					...boundary,
					position: {
						x: boundary.position.x,
						y: boundary.position.y - 3,
					},
				})
			) {
				moving = false;
				break;
			}
		}
		if (moving) movables.forEach(movable => (movable.position.y -= 3));
	} else if (keys.d.pressed && lastKey === 'd') {
		player.moving = true;
		player.image = player.sprites.right;

		for (let boundary of boundaries) {
			// console.log(boundary);
			if (
				rectangularCollision(player, {
					...boundary,
					position: {
						x: boundary.position.x - 3,
						y: boundary.position.y,
					},
				})
			) {
				moving = false;
				break;
			}
		}
		if (moving) movables.forEach(movable => (movable.position.x -= 3));
	}
}
animate();

let lastKey = '';
const handleKeydown = e => {
	switch (e.key) {
		case 'w':
			keys.w.pressed = true;
			lastKey = 'w';
			break;
		case 'a':
			keys.a.pressed = true;
			lastKey = 'a';
			break;
		case 's':
			keys.s.pressed = true;
			lastKey = 's';
			break;
		case 'd':
			keys.d.pressed = true;
			lastKey = 'd';
			break;
	}
};

const handleKeyup = e => {
	switch (e.key) {
		case 'w':
			keys.w.pressed = false;
			break;
		case 'a':
			keys.a.pressed = false;
			break;
		case 's':
			keys.s.pressed = false;
			break;
		case 'd':
			keys.d.pressed = false;
			break;
	}
};

window.addEventListener('keydown', handleKeydown);

window.addEventListener('keyup', handleKeyup);
