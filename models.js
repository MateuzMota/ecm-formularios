model = [
    {id:1,texto:"teste1"},
    {id:2,texto:"12345678910"},
    {id:3,texto:"teste@gmail.com"},
    {id:4,texto:"Nao"},
    {id:5,texto:"Sim"},
    {id:6,texto:"08/02/2020"},
    {id:7,texto:"5098"},
]
modelJson = JSON.stringify(model)
console.log(JSON.parse(modelJson))