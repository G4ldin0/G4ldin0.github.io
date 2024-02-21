let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let inventory = ["Galho"];
let fighting;
let monsterHealth;

const buttons = [document.querySelector("#button1"), document.querySelector("#button2"), document.querySelector("#button3")];
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#HealthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weaponImg = document.querySelector("#InventoryView").querySelectorAll("img");

const weapons = [
   {
      name: "Galho",
      power: 5
   },
   {
      name: "Martelo",
      power: 50
   },
   {
      name: "Espada",
      power: 100
   },
];

const monsters = [
   {
      name: "Slime",
      level: 2,
      health: 15
   },
   {
      name: "Fanged beast",
      level: 8,
      health: 60
   },
   {
      name: "Dragon",
      level: 20,
      health: 300
   },
]

const locations = [
   {
      name: "Centro da vila",
      "button text": ["Ir à Loja", "Ir à caverna", "Lutar contra dragão"],
      "button function": [goStore, goCave, fightDragon],
      description: "você está no centro da vila. Você vê uma placa escrito \"Loja\"."
   },
   {
      name: "Loja",
      "button text": ["Comprar 10 vida (10 ouro)", "Comprar arma (30 ouro)", "Ir ao centro de vila"],
      "button function": [buyHealth, buyWeapon, goTown],
      description:"Você entra na loja."
   },
   {
      name: "Caverna",
      "button text": ["Lutar contra Slime", "Lutar contra Besta Canina", "Vá para Centro da vila"],
      "button function": [fightSlime, fightBeast, goTown],
      description: `Você entra na cavena. O ar úmido passa pelo seu rosto, e você sente a escuridão do local. 
      Longe dalí, você escuta grunhidos de coisas desconhecidas, mas, ao trespassar o caminho, figuras aparecem na sua frente.`
   },
   {
      name: "Lutar",
      "button text": ["Atacar", "Desviar", "Vá para Centro da vila"],
      "button function": [attack, dodge, goTown],
      description: "Você está lutando contra o monstro."
   },
   {
      name: "Monstro morto",
      "button text": ["Vá para Centro da vila", "Vá para Centro da vila", "Vá para Centro da vila"],
      "button function": [goBack, goBack, goBack],
      description: "O monstro grita 'argh!', e você pega o que foi deixado alí."
   },
   {
      name: "perder",
      "button text": ["REJOGAR?", "REJOGAR?", "REJOGAR?"],
      "button function": [restart, restart, restart],
      description: "Você morre. 💀"
   },
   {
      name: "ganhar" ,
      "button text": ["REJOGAR?", "REJOGAR?", "REJOGAR?"],
      "button function": [restart, restart, restart],
      description: `Depois de um encontro grandioso com o grande e poderoso dragão, você lutou, não só por sua vida, mas pela preservação da vila toda. No golpe final, um rugido obtuso preenche o local, como um símbolo de vitória. Parabéns, você libertou a vila da maldição do dragão.`
   },
   {
      name: "easter egg",
      "button text": ["2", "8", "Vá para Centro da vila?"],
      "button function": [pickTwo, pickEight, goTown],
      description: `Você encontrou o jogo escondido. Esconha um dos números. Dez números serão escolhidos entre 0 e 10. 
      Se o número escolhido for igual a um dos números aleatórios, você ganha!`
   }
]

function update(location)
{
   monsterStats.style.display = "none";
   for(let i = 0; i < buttons.length; ++i){ 
      buttons[i].innerText = location["button text"][i]; 
      buttons[i].onclick = location["button function"][i];
   }
   text.innerText = location.description;
}

function goTown(){ update(locations[0]);}
function goStore(){update(locations[1]);}
function goCave(){update(locations[2]);}
function goBack(){
   if(Math.random() < .01){
      console.log("easter egg!")
      easterEgg();
   } else{
      goTown();
   }
}
function buyHealth()
{
   if(gold >= 10)
   {
      gold -= 10;
      health += 10;
      goldText.innerText = gold;
      healthText.innerText = health;
      text.innerText = "Você restitui parte de seu vigor, usando uma poção fraca, feita na hora. Você se sente pronto para o combate."
   } else{
      text.innerText = "Você não tem ouro suficiente."
   }
}
function buyWeapon()
{
   if(currentWeapon < weapons.length -1)
   {
      if(gold >= 30)
      {
         gold -= 30
         weaponImg[currentWeapon].id = null;
         currentWeapon ++;
         weaponImg[currentWeapon].id = "InventorySelected";
         goldText.innerText = gold;
         let newWeapon = weapons[currentWeapon].name;
         text.innerText = "Você acabou de comprar uma " + newWeapon + ".";
         inventory.push(newWeapon);
      } else{
         text.innerText = "Você não tem ouro suficiente para comprar uma arma.";
      }
   }
   else
   {
      text.innerText = "Você já possui a arma mais poderosa.";
   }
}

function fightSlime(){
   fighting = 0;
   goFight(monsters[0]);
}
function fightBeast(){
   fighting = 1;
   goFight(monsters[1]);
}
function fightDragon(){
   fighting = 2;
   goFight(monsters[2]);
}

function goFight(monster)
{
   update(locations[3]);
   // monsterHealth.innerText = monsters[fighting].health;
   monsterStats.style.display = "block";
   monsterHealth = monsters[fighting].health
   monsterNameText.innerText = monsters[fighting].name;
   monsterHealthText.innerText = monsterHealth;
}

function attack() {
   text.innerText = "O " + monsters[fighting].name + " ataca.";
   text.innerText+= " Você ataca usando " + weapons[currentWeapon].name + ".";

   if(isMonsterHit()){
      health -= getMonsterAttackValue(monsters[fighting].level);
   } else{
      text.innerText = "Você erra o ataque.";
   }

   monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
   monsterHealthText.innerText = monsterHealth;
   healthText.innerText = health;
   if(health <= 0) lose();
   else if(monsterHealth <= 0) {
      fighting == 2 ? winGame() : defeatMonster();
   }

   if(Math.random() <= .1 && inventory.length !== 1){
      text.innerText += " A arma quebra. ";
      inventory.pop();
      weaponImg[currentWeapon].id = "InventoryNotSelected";
      currentWeapon--;
      weaponImg[currentWeapon].id = "InventorySelected";
   }
}



function getMonsterAttackValue(level){
   let hit = (level * 5) - Math.floor(Math.random() * xp);
   console.log(hit);
   return hit;  
}

function isMonsterHit() {
   return Math.random() > .2 || health <= 20;
}

function dodge() {
   text.innerText = " Você desvia do ataque do " + monsters[fighting].name + ".";
}

function defeatMonster(){
   gold += Math.floor(monsters[fighting].level * 6.7);
   xp += monsters[fighting].level;
   goldText.innerText = gold;
   xpText.innerText = xp;
   update(locations[4]);
}
function lose(){update(locations[5]);}
function winGame(){update(locations[6]);}
function restart(){
   xp = 0;
   health = 100;
   gold = 50;
   currentWeapon = 0;
   inventory = ["Galho"];
   goldText.innerText = gold;
   xpText.innerText = xp;
   healthText.innerText = health;
   goTown();
}

function easterEgg() { update(locations[7]);}

function pickTwo() { pick(2);}
function pickEight() { pick(8);}

async function pick(guess) {
   let numbers = [];
   while ( numbers.length < 10){
      numbers.push(Math.floor(Math.random() * 11));
   }

   text.innerText = "Você escolhe " + guess + ". Aqui estão os números recebidos: \n";
   numbers.forEach(element => {
      text.innerText += element + "; ";
   });

   if(numbers.includes(guess)){
      await new Promise(resolve => setTimeout(resolve, 1000));
      text.innerText += "\nVocê ganhou! Aqui está 20 ouro.";
      gold += 20;
      goldText.innerText = gold;
   } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
      text.innerText += "\nErrado! Perca 20 de vida.";
      health -= 20;
      healthText.innerText = health;
      if(health <= 0) lose();
   }
}

window.addEventListener("keydown", function(e) { 
   if(e.defaultPrevented) return;
   switch (e.key) {
      case "1": buttons[0].onclick(); return;
      case "2": buttons[1].onclick(); return;
      case "3": buttons[2].onclick(); return;
      default: return;
   }

   e.preventDefault();
})