import express, { Request, Response } from "express";
import { Produto } from "./Produto";

const dns = require('dns'); //resposta do stack overflow para um erro de conexão que tinha no postman

// Set default result order for DNS resolution
dns.setDefaultResultOrder('ipv4first');

const app = express();
const PORT = process.env.PORT ?? 3000;
app.use(express.json());

const produtos: Produto[] =[];

function hellworld(req: Request, res: Response):void{
    res.status(200).send('Hello World!!');
}

function filtraProdutoPorID(req: Request, res: Response):void{
    try{
        let id:any = Number(req.params.id);
        const filtrados = produtos.filter(produtos => produtos.id === id);
        if (filtrados.length > 0){
        res.status(200).json(filtrados[0]);
    }   else {
        res.status(404).json({ Message: "Produto não encontrado" });
    }

    }catch(e: unknown){
        res.status(400).json({Message: "Informar ID valido"});
    }
}

function listarProdutos(req: Request, res: Response):void{
    try{
        if (produtos.length > 0){
        res.status(200).json(produtos);
    }   else {
        res.status(404).json({ Message: "Lista de produtos vazia." });
    }

    }catch(e: unknown){
        res.status(400).json({Message: "Erro desconhecido."});
    }
}

function filtraProdutoPorNome(req: Request, res: Response):void{
    try{
        let name:any = req.query.name;
        res.status(200).json({Name: name });

    }catch(e: unknown){
        res.status(400).json({Message: "Necessário informar um ID válido"});
    }
}

function criarProduto(req: Request, res: Response):void{
    try{
        let data:any = req.body;
        if(!data.id || !data.preco || !data.fabricante || !data.nome){
            throw new Error("Favor enviar os valores corretos");
        }

        let produto = new Produto(data.id,data.nome,data.preco,data.fabricante);
        produtos.push(produto);
        res.status(201).json(produto);

    }catch(e: unknown){
        res.status(400).json({Message: "Necessário informar as informações do produto."});
    }
}

function alterarProduto(req: Request, res: Response):void{
    try{
        let data:any = req.body;
        if(!data.id || !data.preco || !data.fabricante || !data.nome){
            throw new Error("Favor enviar os valores corretos");
        }
        let id:any = req.params.id;
        const filtrados = produtos.filter(produtos => produtos.id === id);
        if (filtrados.length > 0){
        filtrados[0].id = data.id;
        filtrados[0].preco = data.preco;
        filtrados[0].nome = data.nome;
        filtrados[0].fabricante = data.fabricante;
        filtrados[0].fabricante.nome = data.fabricante;
        filtrados[0].fabricante.endereco = data.fabricante.endereco;
        filtrados[0].fabricante.endereco.cidade = data.fabricante.endereco.cidade;
        filtrados[0].fabricante.endereco.pais = data.fabricante.endereco.pais;
        res.status(201).json(filtrados[0]);
    }   else {
        res.status(404).json({ Message: "Produto não encontrado" });
    }

    }catch(e: unknown){
        res.status(400).json({Message: "Necessário enviar valores validos"});
    }
}

function removerProdutoPorID(req: Request, res: Response):void{
    try{
        let id:any = Number(req.params.id);
        const filtrados = produtos.filter(produtos => produtos.id === id);
        if (filtrados.length > 0){
        res.status(200).json(filtrados.shift());
    }   else {
        res.status(404).json({ Message: "Produto não encontrado" });
    }

    }catch(e: unknown){
        res.status(400).json({Message: "Informar ID valido"});
    }
}


app.get('/api/produto/:id', filtraProdutoPorID);
app.get('/api/produto', filtraProdutoPorNome);
app.get('/api/produto/list', listarProdutos);
app.post('/api/produto',criarProduto);
app.put('/api/produto:id',alterarProduto);
app.delete('/api/produto:id',removerProdutoPorID);

app.listen(PORT, () => console.log(`API rodando na URL : http://localhost:${PORT}`));