import express, { json } from 'express';
import cors from 'cors';
import { getProjects, getAppInStore, getToken, addProject, checkProject, addProjectImages, getCertification, addCertification, getExperiences, addExperiences, getStacks } from './database/database.js';
//Inicia aplicação.
const app = express();
//Usa json.
app.use(json());
//Libera acesso para todas as origens.
app.use(cors({ origin: "*" }))

//Definição da porta.
const port = 3000;
app.listen(port);

//Verifica se o token informado é o mesmo do banco de dados.
async function checkToken(token) {
    //Token do banco de dados.
    const tokenDataBase = await getToken();
    /*Retorna true se o token for válido e false se não for um token válido. */
    if (token === tokenDataBase) {
        return true;
    } else {
        return false;
    }
}

//Redireciona para (/projetos).
app.get('/', (request, response) => {
    response.redirect('/projetos')
})

//Obtém os projetos.
app.get('/projetos', async (request, response) => {
    try {
        //Retorna com os dados do projeto.
        response.json(await getProjects());
    } catch (err) {
        console.log('Ocorreu um erro ao obter os projetos: ' + err);
        response.sendStatus(500);
    }
})

//Obtém experiências.
app.get('/experiencias', async (request, response) => {
    try {
        //Responde com os dados das experiências profissionais.
        response.json(await getExperiences());
    }
    catch (err) {
        console.log('Ocorreu um erro ao obter as experiências profissionais.')
    }
})

//Retorna aplicativos publicados na loja de apps.
app.get('/projetos/appsloja', async (request, response) => {
    try {
        response.json(await getAppInStore());
    }
    catch (err) {
        console.log('Ocorreu um erro ao obter o projeto.' + err);
        response.sendStatus(500);
    }
})

//Obtém certificados
app.get('/certificados', async (request, response) => {
    try {
        //Obtém dados dos certificados da base.
        const result = await getCertification();
        response.json(result);
    }
    catch (err) {
        console.log("Ocorreu um erro ao obter os certificados: " + err);
        response.sendStatus(500);
    }
})

//Obtém stacks
app.get('/projetos/stacks', async (request, response) => {
    try {
        //Obtém stacks da base.
        const result = await getStacks();
        //Retorna responde com o resultado.
        response.json(result);
    } catch (err) {
        //Retorna com erro caso ocorra.
        console.log('Ocorreu um erro ao obter as stacks.' + err);
        response.sendStatus(500);
    }
})

//Insere projeto
app.post('/projetos', async (request, response) => {
    try {
        //Verifica se o corpo da requisição foi informado.
        if (!request.body) {
            response.json({ "error": "O corpo da requisição não foi informado." });
            return;
        }
        //Corpo da requisição.
        const { token, nome, descricao, data_envio, url_projeto, url_hospedagem, app_loja, icone } = request.body;

        if (!token) {
            //Retorna erro se o token não for informado.
            response.json({ "error": "O token de acesso não foi no informado no corpo da requisição." });
            return;
        }
        //Valida token
        const tokenValidation = await checkToken(token);
        if (tokenValidation) {
            //Valida campos obrigatórios
            if (!nome || !descricao || !data_envio || !url_projeto) {
                response.json({ "error": "Existem campos obrigatórios não informados no corpo da requisição." })
            } else {
                addProject(nome, descricao, data_envio, url_projeto, url_hospedagem, app_loja, icone);
                response.sendStatus(201);
            }
        } else {
            response.json({ "error": "O token informado é inválido." });
        }
    }

    catch (err) {
        console.log('Ocorreu um erro ao inserir o projeto: ' + err);
        response.sendStatus(500);
    }
})

//Insere imagens do projeto.
app.post('/projetos/imagens', async (request, response) => {
    try {
        //Verifica se o corpo da requisição foi informado.
        if (!request.body) {
            response.json({ "error": "O corpo da requisição não foi informado." });
            return;
        }
        //Corpo da requisição.
        const { id, imagens, token } = request.body;

        //Verifica se o token foi informado.
        if (!token) {
            response.json({ "error": "O token de acesso não foi no informado no corpo da requisição." })
            return;
            //Valida se os dados foram enviados no corpo da requisição
        } else if (!imagens || !id) {
            response.json({ "error": "Existem campos obrigatórios não informados no corpo da requisição." })
            return;
        }

        //Valida token.
        const tokenValidation = await checkToken(token);
        if (tokenValidation) { } else {
            response.json({ "error": "O token informado é inválido." });
            return;
        }

        //Verifica se o id do projeto é válido.
        const projectValidation = await checkProject(id);
        if (!projectValidation) {
            response.json({ "error": "O id do projeto informado não é válido." })
            return;
        }

        //Verifica se imagens é do tipo lista e se tem registros.
        if (!Array.isArray(imagens)) {
            response.json({ "error": "As imagens devem ser enviadas no formato de lista." });
        } else if (imagens.length < 1) {
            response.json({ "error": "A lista enviada não pode estar vazia." });
        }
        else {
            addProjectImages(id, imagens);
            response.sendStatus(201);
        }
    } catch (err) {
        console.log('Ocorreu um erro ao adiconar a imagem ao projeto: ' + err);
        response.sendStatus(500)
    }
})

//Insere certificado.
app.post('/certificados', async (request, response) => {
    try {
        //Verifica se o corpo da requisição foi informado.
        if (!request.body) {
            response.json({ "error": "O corpo da requisição não foi informado." });
            return;
        }
        //Corpo da requisição.
        const { token, imagem_url, descricao, data_conclusao } = request.body;
        //Valida campos.
        if (!token) {
            response.json({ "error": "O token de acesso não foi no informado no corpo da requisição." });
            return;
        } else if (!imagem_url || !descricao || !data_conclusao) {
            response.json({ "error": "Existem campos obrigatórios não informados no corpo da requisição." })
            return;
        }

        //Valida token
        const tokenValidation = await checkToken(token);
        if (tokenValidation) {
            addCertification(descricao, imagem_url, data_conclusao);
            response.sendStatus(201);
        } else {
            response.json({ "error": "O token informado é inválido." });
        }
    } catch (err) {
        console.log('Ocorreu um erro ao inserir o certificado: ' + err);
        response.sendStatus(500);
    }
})

//Insere experiência.
app.post('/experiencias', async (request, response) => {
    try {
        //Verifica se o corpo da requisição foi informado.
        if (!request.body) {
            response.json({ "error": "O corpo da requisição não foi informado." });
            return;
        }
        //Obtém corpo de resposta.
        const { token, nome_empresa, cargo, data_inicio, data_final } = request.body;
        //Verifica se o token foi enviado.
        if (!token) {
            response.json({ "error": "O token de acesso não foi no informado no corpo da requisição." });
            return;
        }

        //Valida token
        const tokenValidation = await checkToken(token);
        if (tokenValidation) {

        } else {
            response.json({ "error": "O token informado é inválido." });
            return;
        }

        if (!nome_empresa || !cargo || !data_inicio) {
            response.json({ "error": "Existem campos obrigatórios não informados no corpo da requisição." })
            return;
        } else {
            addExperiences(nome_empresa, cargo, data_inicio, data_final);
            response.sendStatus(201);
        }

    }
    //Retorna status code 500 caso ocorra algum erro.
    catch (err) {
        console.log('Ocorreu um erro ao inserir a experiência: ' + err);
        response.statusCode(500)
    }
})