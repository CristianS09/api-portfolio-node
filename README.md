API que retorna dados pro meu portfólio pessoal:
https://cristian-dev-portfolio.vercel.app/

## EndPoints
<span style="color:green">GET</span>
|
<span style="color:orange">POST</span>
<br>
<ul>

<li>
<strong>/projetos</strong>
</li>

<li>
<strong>/experiencias</strong>
-> Experiências profissionas.
</li>

<li>
<strong>
/certificados
</strong>
</li>
</ul>

<span style="color:green">GET</span>

<ul>

<li>
<strong>
/projetos/appsloja
</strong>
-> Informações dos aplicativos na loja.
</li>

<li>
<strong>
/projetos/stacks
</strong>
-> Stacks utilizadas nos projetos.
</li>

</ul>

<br>

<span style="color:orange">POST</span>
<ul>

<li>
<strong>/projetos/imagens</strong>
</li>
</ul>

<br>
<strong>Obs</strong>: 
Os métodos POST só podem ser utilizados usando um token interno, caso contrário a API irá retornar com erro.


### Link da api hospedada: 

https://api-portfolio-node-pied.vercel.app/projetos


## Diagrama das tabelas:
<img src="./diagrams/mapeamento-tabelas.png" style="border-radius:8px">
<img src="./diagrams/mapeamento-tabelas2.png" style="border-radius:8px">

