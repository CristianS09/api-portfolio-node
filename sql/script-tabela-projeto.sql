--Cria tabela de projetos.
CREATE TABLE projetos_tb(
	id_projeto SERIAL PRIMARY KEY,
	nome VARCHAR(80) NOT NULL,
	descricao VARCHAR(100) NOT NULL,
	data_envio date NOT NULL,
	url_projeto VARCHAR(5000) NOT NULL
	url_hospedagem VARCHAR(5000) NULL,
	--Ícone do aplicativo publicado.
	icon VARCHAR(5000) NULL,
	--Diferencia projetos públicados na loja de aplicativo (PlayStore)
	app_loja CHAR(1) DEFAULT 'N' NULL
);


--Cria tabela de imagens do projeto.
CREATE TABLE imagens_tb(
  id SERIAL PRIMARY KEY,
  id_projeto INT NOT NULL,
  url VARCHAR(5000) NOT NULL,
  CONSTRAINT id_projeto_fk_imagens FOREIGN KEY(id_projeto) REFERENCES projetos_tb(id_projeto)
);

--Cria tabela de stacks do projeto.
CREATE TABLE stacks_tb(
	id SERIAL PRIMARY KEY,
	nome_stack VARCHAR(80) NOT NULL,
	cor VARCHAR(100) NOT NULL
);

--Tabela de referência das stacks do projeto.
CREATE TABLE projetos_stacks_tb(
	id SERIAL PRIMARY KEY,
	id_projeto INT NOT NULL,
	id_stacks INT NOT NULL,
	CONSTRAINT id_projeto_fk FOREIGN KEY(id_projeto) REFERENCES projetos_tb(id_projeto),
	CONSTRAINT id_stacks_fk FOREIGN KEY(id_stacks) REFERENCES stacks_tb(id)
);

--Tabela de certificados.
CREATE TABLE certificados_tb(
	id SERIAL PRIMARY KEY,
	descricao VARCHAR(100) NOT NULL,
	imagem_url VARCHAR(5000) NOT NULL,
	data_conclusao DATE NOT NULL
);

--Tabela de Experiências profissionais
CREATE TABLE experiencias_profissional_tb(
	id SERIAL PRIMARY KEY,
	nome_empresa VARCHAR(100) NOT NULL,
	cargo VARCHAR(80) NOT NULL,
	data_inicio date not null,
	data_final date null	
);