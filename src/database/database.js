import { config } from "dotenv";
import { Client } from "pg";

//Inicia leitura do arquivo .env
config({ path: ['../.env', './.env'] });

//Configuração do banco.
const client = new Client({
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.PORT,
    database: process.env.DATABASE
});

//Realiza conexão com o banco.
const connect = await client.connect();

/*Obtém token do banco de dados para 
validar ao fazer um na api POST.
*/
async function getToken() {
    const result = await connect.query(`SELECT token FROM 
        token_api_tb LIMIT 1`);
    //Retorna token.
    return result.rows[0].token;
}

//Verifica se o projeto existe.
async function checkProject(id) {
    //Executa query.
    const result = await connect.query(`SELECT id_projeto FROM projetos_tb 
        WHERE id_projeto = ${id}`);
    //Se a lista estiver vazia retorna false, se não retorna true.
    if (result.rows.length === 0) {
        return false;
    } else {
        return true;
    }
}

//Obtém imagens dos projetos.
async function getImages() {
    //Retorna imagens do projeto.
    const result = await connect.query('SELECT id_projeto,url FROM imagens_tb ORDER BY id ASC');
    return result.rows;
}

//Obtém stacks do projeto.
async function getStacks() {
    //Obtém stacks do projeto;
    const result = await connect.query(`
    SELECT stacks_tb.nome_stack,stacks_tb.cor,projetos_stacks_tb.id_projeto FROM stacks_tb
    INNER JOIN projetos_stacks_tb on stacks_tb.id = projetos_stacks_tb.id_stacks`)

    //Retorna stacks do projeto.    
    return result.rows;
}


//Obtém todos os projetos.
async function getProjects() {
    //Obtém os projetos que não foram publicados na loja.
    const projects = await connect.query(`
            SELECT id_projeto,TO_CHAR(data_envio,'DD/MM/YYYY') as data_formatada, nome,descricao,url_projeto,url_hospedagem FROM projetos_tb 
            WHERE app_loja = 'N'
            ORDER BY data_envio DESC
`);
    //Obtém imagens do projeto.
    const images = await getImages();
    //Obtém stacks do projeto;
    const stacks = await getStacks();

    const result = projects.rows.map((project) => {
        //Cria novo objeto com a lista de imagem para cada projeto.
        return {
            id: project.id_projeto,
            titulo: project.nome,
            descricao: project.descricao,
            url_projeto: project.url_projeto,
            data_envio: project.data_formatada,
            url_hospedagem: project.url_hospedagem,
            //Obtém imagem de acordo com o id do projeto.
            imagens: images.filter((image) => image.id_projeto === project.id_projeto),
            stacks: stacks.filter((stack) => stack.id_projeto === project.id_projeto),
        }
    });

    return result;
}

//Obtém projetos públicados na loja de apps.
async function getAppInStore() {
    //Obtém os projetos que foram públicados na loja de aplicativo.
    const projects = await connect.query(`SELECT * FROM projetos_tb
            WHERE app_loja = 'S'
             ORDER BY data_envio DESC
            `);

    //Obtém imagens do projeto.
    const images = await getImages();
    //Obtém stacks do projeto;
    const stacks = await getStacks();
    //Cria novo objeto com a lista de imagem para cada projeto.
    const result = projects.rows.map((project) => {
        //Cria novo objeto com a lista de imagem para cada projeto.
        return {
            id: project.id_projeto,
            titulo: project.nome,
            descricao: project.descricao,
            url_projeto: project.url_projeto,
            url_hospedagem: project.url_hospedagem,
            //Obtém imagem de acordo com o id do projeto.
            imagens: images.filter((image) => image.id_projeto === project.id_projeto),
            stacks: stacks.filter((stack) => stack.id_projeto === project.id_projeto),
            icone: project.icone
        }
    });

    return result;
}

//Obtém certificados.
async function getCertification() {
    const result = await connect.query(`
        SELECT TO_CHAR(data_conclusao,'DD/MM/YYYY') as data,
        imagem_url,
        descricao
        FROM certificados_tb
        ORDER BY data_conclusao DESC
        `);
    //Retorna com os dados do certificado.
    return result.rows;
}

//Retorna experiências profissionais.
async function getExperiences() {
    //Executa consulta.
    const result = await connect.query(`
        SELECT nome_empresa,cargo,TO_CHAR(data_inicio,'DD/MM/YYYY') as data_inicial, TO_CHAR(data_final,'DD/MM/YYYY') as data_final FROM experiencias_profissional_tb
        ORDER BY data_inicio DESC
        `);
    //Retorna com os dados das experiências profissionais.
    return result.rows;
}

//Adiciona nova experiência.
async function addExperiences(nome_empresa, cargo, data_inicial, data_final) {
    //Query
    const query = {
        text: `INSERT INTO experiencias_profissional_tb(nome_empresa,cargo,data_inicio,data_final) 
        VALUES ($1,$2,$3,$4)`,
        values: [nome_empresa, cargo, data_inicial, data_final]
    }
    //Executa insert no banco
    await connect.query(query);
}

//Adiciona novo projeto.
async function addProject(nome, descricao, data_envio, url_projeto, url_hospedagem, app_loja = 'N', icone) {
    const query = {
        text: `
            INSERT INTO projetos_tb(nome,descricao,data_envio,url_projeto,url_hospedagem,app_loja,icone)
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            `,
        values: [nome, descricao, data_envio, url_projeto, url_hospedagem, app_loja, icone]
    }
    //Insere registros.
    await connect.query(query);
}


//Insere imagem do projeto
function addProjectImages(id, imagens) {
    //Insere cada imagem da lista
    imagens.forEach(async (imagem) => {
        //Query para insert.
        const query = {
            text: `
        INSERT INTO imagens_tb(id_projeto,url)
        VALUES ($1,$2)
        `,
            values: [id, imagem]
        }
        //Executa query.
        await connect.query(query);
    })
}

//Adiciona certificado.
async function addCertification(descricao, imagem_url, data_conclusao) {
    //Query banco de dados.
    const query = {
        text: `INSERT INTO certificados_tb(descricao,imagem_url,data_conclusao) 
        VALUES ($1,$2,$3)`,
        values: [descricao, imagem_url, data_conclusao]
    }
    //Insere certificado
    await connect.query(query);
}

//Exporta funções.
export { getProjects, getAppInStore, addProject, getToken, checkProject, addProjectImages, getCertification, addCertification, getExperiences, addExperiences, getStacks }