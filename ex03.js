import http from 'k6/http';
import { sleep, check, group } from 'k6';
import { faker } from 'https://esm.sh/@faker-js/faker'



export default function(){

   

    let extraiToken;

    group('Obtendo o Token do usuários', () => {
        const endpoint = 'http://165.227.93.41/lojinha/v2/login';
    
        const body = JSON.stringify({ //JSON é um objeto do JS,que é um metodo que esse objeto JS seja convertido para um JSON que é um string
        usuarioLogin: __ENV.USUARIOLOGIN,
        usuarioSenha: __ENV.USUARIOSENHA
        })
    
        const options = {
            headers: {
                'Content-type': 'application/json'
            }
        }
    
        const respostaLogin = http.post(
                endpoint, 
                body, 
                options
        )
        
        check(respostaLogin, {
            'Status code é igual a 200': r => r.status === 200,
            'A mensagem de sucesso ao realizar um login foi apresentada': r => r.json().message === 'Sucesso ao realizar o login'
        })
        extraiToken = respostaLogin.json('data.token');
    })

    group('Cadastrar um novo produto', () => {
        const endpointProduto = 'http://165.227.93.41/lojinha/v2/produtos';

        const bodyProduto = JSON.stringify({ 
            produtoNome: faker.food.fruit(),
            produtoValor: '50',
            produtoCores: ['Preto', 'Branco'],
            produtoUrlMock: ''
        })
        
        const optionsProduto = {
            headers: {
                'Content-type': 'application/json',
                token: extraiToken
            }
        }

        const respostaCadastraProduto = http.post(
            endpointProduto, 
            bodyProduto, 
            optionsProduto
        )
        

        check(respostaCadastraProduto, {
            'Validar o status code 200': r => r.status === 201,
            'Validar a mensagem Produto adicionado com sucesso': r => r.json('message') === 'Produto adicionado com sucesso',
            'Validar a segunda cor do produto branco': r => r.json('data.produtoCores.1')  === 'Branco'
        })

        
    })
    
    group('User Think Time após o Cadastro', () => {
        sleep(1); //Entenda o comportamento do seu usuário
    })
   
}


