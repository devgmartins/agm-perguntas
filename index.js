// Importações de frameworks, bibliotecas e etc
const express       = require('express')
const app           = express()
const bodyParser    = require('body-parser')
const connection    = require('./database/database')
const Pergunta      = require('./database/pergunta')
const Resposta      = require('./database/resposta')

// Conexao com o banco de dados
connection
    .authenticate()
    .then(() => { // Se a conexao ocorrer corretamente, exibir:
        console.log('Conexao feita com o banco de dados!')
    })
    .catch((msgErro) => { // Caso a conexao nao ocorrer corretamente, exibir:
        console.log(msgErro)
    })

// Estou dizendo para o Express usar o EJS como View Engine
app.set('view engine','ejs')
app.use(express.static('public'))
// Body parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
// Rotas
app.get('/',(req,res) =>{
    // Faz a pesquisa das perguntas e manda a lista para a variavel perguntas
    Pergunta.findAll({ raw: true, order: [
        ['id','DESC'] // Ordenando perguntas de forma decrescente, ASC = crescente || DESC = decrescente
    ]}).then(perguntas => {
        res.render('index', { // E envia a variavel para o FrontEnd usando o res.render
            perguntas: perguntas
        })
    })
})

app.get('/perguntar', (req, res) => {
    res.render('perguntar')
})

app.post('/salvarpergunta',(req,res) => {
    // Recebe os dados do formulario e salva dentro das variaveis
    var titulo = req.body.titulo
    var descricao = req.body.descricao
    // Salvo no banco de dados dentro da tabela de perguntas
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => { // Caso a ação der certo, redirecionar o usuario para a pagina principal
        res.redirect('/')
    })
})

app.get('/pergunta/:id',(req,res) => {
    var id = req.params.id
    Pergunta.findOne({ // Manda o model pesquisar no banco uma pergunta com ID igual ao ID passado
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){ // Pergunta achada

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order:[
                    ['id','DESC']
                ]
            }).then(respostas => {
                res.render('pergunta',{
                    pergunta: pergunta,
                    respostas: respostas 
                })
            })

        }else{ // Pergunta não encontrada
            res.redirect('/') // Redireciona para a pagina inicial
        }
    })
})

app.post('/responder',(req,res) => {
    var corpo = req.body.corpo
    var perguntaId = req.body.pergunta
    Resposta.create({ // Cria uma resposta com um corpo, e o id da pergunta
        corpo: corpo,
        perguntaId: perguntaId,
    }).then(() => { // Quando a resposta for criada, redireciona o usuario para a pagina da pergunta que ele respondeu
        res.redirect('/pergunta/'+perguntaId)
    })
})

app.listen(2117,() => {
    console.log('App rodando')
})