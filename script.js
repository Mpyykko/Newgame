const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)


const gravity = 0.7

let gameOver = false;

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background.png'
})

const shop = new Sprite({
  position: {
    x: 670,
    y: 184
  },
  imageSrc: './img/shop.png',
  scale: 2.75,
  framesMax: 6
})

const player = new Fighter({
  position: {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: './img/Evil Wizard 2/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 210
  },

  sprites: {
    idle: {
      imageSrc: './img/Evil Wizard 2/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './img/Evil Wizard 2/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/Evil Wizard 2/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/Evil Wizard 2/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/Evil Wizard 2/Attack1.png',
      framesMax: 8
    },
    takeHit: {
      imageSrc: './img/Evil Wizard 2/Take Hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: './img/Evil Wizard 2/Death.png',
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50
    },
    width: 160,
    height: 50
  }
})

const enemy = new Fighter({
  position: {
    x: 800,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  },
  imageSrc: './img/kenji/Idle.png',
  framesMax: 6,
  scale: 1.6,
  offset: {
    x: 100,
    y: 20
  },
  sprites: {
    idle: {
      imageSrc: './img/kenji/Idle.png',
      framesMax: 6
    },
    run: {
      imageSrc: './img/kenji/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/kenji/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/kenji/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/kenji/Attack1.png',
      framesMax: 8
    },
    takeHit: {
      imageSrc: './img/kenji/Take hit.png',
      framesMax: 4
    },
    death: {
      imageSrc: './img/kenji/Death.png',
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x: -200,
      y: 50
    },
    width: 170,
    height: 50
  }
})

console.log(player)

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}




function animate() {
 
 
    window.requestAnimationFrame(animate);

  
  
  
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  shop.update()
  c.fillStyle = 'rgba(255, 255, 255, 0.15)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  

  
  player.velocity.x = 0
  enemy.velocity.x = 0

  // player movement


  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5
    player.switchSprite('run')
    player.facing = -1;
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5
    player.switchSprite('run')
    player.facing = 1;
  } else {
    player.switchSprite('idle')
  }

  // jumping
  if (player.velocity.y < 0) {
    player.switchSprite('jump')
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
  }

  // Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5
    enemy.switchSprite('run')
    enemy.facing = 1;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5
    enemy.switchSprite('run')
    enemy.facing = -1;
  } else {
    enemy.switchSprite('idle')
  }

  // jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }

  
  // detect for collision & enemy gets hit
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4 &&
    !gameOver
  ) {
    enemy.takeHit()
    player.isAttacking = false

    gsap.to('#enemyHealth', {
      width: enemy.health + '%'
    })
  }

  // if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false
  }

  // this is where our player gets hit
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2 &&
    !gameOver
  ) {
    player.takeHit()
    enemy.isAttacking = false

    gsap.to('#playerHealth', {
      width: player.health + '%'
    })
  }

  // if player misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false
  }

  

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0 || timer === 0) {
    determineWinner({ player, enemy, timerId })
  
    gameOver = true;
  
  }

 
  
} 











window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break
      case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
      case 'w':
        player.velocity.y = -20
        break
      case ' ':
        player.attack()
        break
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        enemy.velocity.y = -20
        break
      case 'ArrowDown':
        enemy.attack()

        break
    }
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }

  // enemy keys
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }
})





// this is for the new game



function newGameKey(event) {
  if (event.key === 'y' || event.key === 'Y') {
    document.removeEventListener('keydown', newGameKey);
    gameOver = false;
    newGame();
   
  }
}

function newGame() {
  
  animate();
  console.log('Uusi peli');
}


function startGame() {
  const element = document.getElementById('startMenu');
  element.style.display = 'none';
  animate();
  decreaseTimer();
}












