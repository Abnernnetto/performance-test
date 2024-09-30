import http from 'k6/http';
import { sleep } from 'k6';
import { numeroAleatorioAte } from './utils/numeros.js';

export const options = {
  //vus: 20,
  //duration: '10s',
  thresholds:{
    http_req_waiting: ['p(90) >= 10', 'p(90) <= 50', 'avg < 60'] 
    // Aqui nós estamos usando a estrategia, que é o http_req_waiting e a estatistica que é o percentil e o average
  },
  cloud: {
    name: 'Exercicio 01',
    projectID: 3716303
  },
  stages:[ //Average Load - CARGA
    { target: 20, duration: '5s'},
    { target: 20, duration: '20s'},
    { target: 0,  duration: '5s'}
  ],
  stages:[
    { target: 20, duration: '5s'},
    { target: 20, duration: '20s'},
    { target: 0,  duration: '5s'}
  ]
  


};


export default function() {
  //Passo 1 = Acesse a pagina do k6
  http.get('https://test.k6.io'); //tempo de resposta do servidor


  //Passo 2 = Espere uma quantidade de segundos menor que 20
  sleep(numeroAleatorioAte(5)); // User Think Time - Usuario na pagina/percorrendo, durante até 5s randomincos
}
