import http from 'k6/http';
import { sleep } from 'k6';
import { SharedArray } from 'k6/data'


const dados = new SharedArray('dados', () => {
    return JSON.parse(open('./dados/ex05.json'))
})


export const options = {
  cloud: {
    name: 'Exercicio 04',
    projectID: 3716303
  },
  scenarios:{
    dtt: {
        executor: 'shared-iterations',
        vus: 2,
        iterations: dados.length //iterations precisam ser maiores ou iguais que o numero de vus sempre refletindo a qtd de items no arq de dados

    }
  }
  


};


export default function() {
    
    http.get('http://165.227.93.41/lojinha-web/v2/'); 
    http.post(
            'http://165.227.93.41/lojinha-web/v2/login/entrar', 
            {
                usuario: dados[__VU - 1].usuarioLogin,
                senha: dados[__VU - 1].usuarioSenha
            },
            {
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
    )
  
    sleep(1);
  }
