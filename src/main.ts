import { Actor, CollisionType, Color, Text, Engine, vec, Font, Label, FontUnit, Sound, Loader, randomInRange, Random } from "excalibur"
// 1 - Criar uma instancia de engine que representa o jogo
let pontos = 0
const impacto = new Sound('/sons/ump.wav')
		const sons = new Loader([impacto])
const game = new Engine({
	width: 800,
	height: 600
})
let coresBolinha = [
	Color.Black,
	Color.Blue,
	Color.Chartreuse,
	Color.Gray,
	Color.Green,
	Color.Magenta,
	Color.Orange,
	Color.ExcaliburBlue,
	Color.Rose,
	Color.Violet,
	Color.Transparent
]
let numeroCores = coresBolinha.length
// 2 - Criar a barra do player
const barra = new Actor({
	x: 150,
	y: game.drawHeight - 40,
	width: 10,
	height: 20,
	color: Color.Chartreuse,
	name: "BarraJogador"
})

barra.body.collisionType = CollisionType.Fixed

// Adiciona o Actor barra(player) no game
game.add(barra)

// 3 - Movimentar a barra de acordo com a posição do mouse

game.input.pointers.primary.on("move", (event) => {
	barra.pos.x = event.worldPos.x
})

// 4 - Criar o ator bolinha
const bolinha = new Actor({
	x: 100,
	y: 300,
	radius: 10,
	color: Color.Red

})
// colisão
bolinha.body.collisionType = CollisionType.Passive

// 5 - Criar movimentação da bolinha

const velocidadeBolinha = vec(1000, 1000)

setTimeout(() => {

	bolinha.vel = velocidadeBolinha

}, 1000)

// 6 - Fazer a bolinha rebater na parede
bolinha.on("postupdate", () => {

	//Se a bolinha colidir com o lado esquerdo
	if (bolinha.pos.x < bolinha.width / 2) {
		bolinha.vel.x = velocidadeBolinha.x
	}

	//Se a bolinha colidir com o lado direito
	if (bolinha.pos.x + bolinha.width / 2 > game.drawWidth) {
		bolinha.vel.x = -velocidadeBolinha.x
	}
	//Se a bolinha colidir com o lado de cima  
	if (bolinha.pos.y < bolinha.height / 2) {
		bolinha.vel.y = velocidadeBolinha.y
	}
})

//adiciona o ator bolinha (de gorfe)
game.add(bolinha)

//7 - Criar os blocos
//configuração de tamanho e espaçamento dos blocos
const padding = 20
const xoffset = 65
const yoffset = 20
const colunas = 5
const linhas = 3

const corBloco = [Color.Violet, Color.Orange, Color.Yellow]

const alturaBloco = 30
const larguraBloco = (game.drawWidth / colunas) - padding - (padding / colunas)

const listaBlocos: Actor[] = []
//Renderiza 3 linhas


for (let j = 0; j < linhas; j++) {
	//Renderiza 5 blocos

	for (let i = 0; i < colunas; i++) {
		listaBlocos.push(

			new Actor({
				x: xoffset + i * (larguraBloco + padding) + padding,
				y: yoffset + j * (alturaBloco + padding) + padding,
				width: larguraBloco,
				height: alturaBloco,
				color: corBloco[j]
			})


		)
		listaBlocos.forEach(bloco => {
			//Define o tipo de colisor de cada bloco
			bloco.body.collisionType = CollisionType.Active

			//Adiciona cada bloco no game
			game.add(bloco)

		}
		)

	}

}
let colidindo: boolean = false

let textoPontos = new Label({

	text: "Pontos: " + pontos.toString(),
	font: new Font({
		size: 40,
		color: Color.White,
		strokeColor: Color.Black,
		unit: FontUnit.Px
	}),
	pos: vec(600, 500)
})
game.add(textoPontos)

bolinha.on("collisionstart", (event) => {
	//Verificar se a bolinha colidiu com algum bloco destrutível
	if (listaBlocos.includes(event.other)) {
		//Destroe a bolinha
		event.other.kill()
		//Adiciona e atualiza os pontos
		pontos++
		textoPontos.text = "Pontos: " + pontos.toString(),
		//Da play no audio
		impacto.play(1.0)
		//Muda a cor da bolinha
		bolinha.color = coresBolinha[Math.trunc(Math.random() * numeroCores)]
		//Tela de vitória
		if(pontos == 15){
			alert("Uau, você venceu!!!")
			window.location.reload()
		}
	}
	//Rebater a bolinha - Iverter as direções
	let interseccao = event.contact.mtv.normalize()

	if (!colidindo) {
		colidindo = true
		if (Math.abs(interseccao.x) > Math.abs(interseccao.y)) {
			bolinha.vel.x = bolinha.vel.x * -1
		}
		else {
			bolinha.vel.y = bolinha.vel.y * -1
		}

	}
})
bolinha.on("collisionend", () => {
	colidindo = false
})
bolinha.on("exitviewport", () => {
	alert("Perdeu patrão")
	window.location.reload()
})
//Pontos


/*const textopontos = new Text({
	text: "hello World",
	font: new Font({size: 30})})

const objetotexto = new Actor({
	x: game.drawWidth - 100,
	y: game.drawHeight - 50
})
objetotexto.graphics.use(textopontos)
game.add(objetotexto)*/

//inicia o jogo
await game.start(sons)