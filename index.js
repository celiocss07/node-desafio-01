const express = require('express')

const app = express()

const PORT = 3366

app.use(express.json())
app.listen(PORT, ()=>{
    console.log("SERVER IS RUNNING...")
    
})

var PROJECTS = [ ]

//MIDDLEWARE PRA CHECKAR SE O PROJECTO EXISTE
function checkproject(req, res, next){
    if(!PROJECTS[req.params.id]){
        return res.status(404).json({error: "Project not found"})
    }else if(!req.params.id){
        return res.status(400).json({error: "Id is required"})
    }
    return next()
}

//MIDDLEWARE GLOBAL PARA FAZER CONTAGEM DE REQUISIÇÕES
app.use((req, res, next)=>{
    console.count("COUNTER")
    return next()
})

//ROTA QUE RETORNA TODOS PROJECTOS EXISTENTES
app.get('/projects', (req, res, next) => {
    return res.json(PROJECTS)
})

//ROTA PARA CADASTRAR NOVO PROJECTO
app.post('/projects', (req, res, next) => {
    //console.log("TESTANDO ",req.body)
    const {id, title} = req.body

    PROJECTS.push({id, title, tasks: []})
    return res.status(200).json({msg: "Created", PROJECTS})
})

//ROTA PARA ADD TAREFA
app.post('/projects/:id/tasks',checkproject, (req, res, next) => {
    
    const {id} = req.params
    const {title} = req.body

    PROJECTS[id].tasks.push(title)
    return res.status(200).json({msg: "Created", PROJECTS})
})

//ROTA PARA ACTUALIZAR PROJECTO
app.put('/projects/:id',checkproject, (req, res, next) => {
    const {id} = req.params
    const {title} = req.body

    console.log("INFO => ", PROJECTS[parseInt(id)], id)
    PROJECTS[id] = {
        ...PROJECTS[id],
        title: title
    }
    return res.json(PROJECTS)
      
})

//ROTA PARA DELETAR PROJECTO
app.delete('/projects/:id',checkproject, async (req, res, next) => {
    const {id} = req.params
  
        PROJECTS.splice(id, 1)
    
    return res.status(200).json(PROJECTS) 
})
