import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 1,
  iterations: 1,
  thresholds:{
    http_req_failed: ['rate < 0.01']
  }
};


export default function() {
  const respostaHomePageLojinha = http.get('http://165.227.93.41/lojinha-web/v2/');
  // console.log(respostaHomePageLojinha.status);
  // console.log(respostaHomePageLojinha.status_text);
  // console.log(respostaHomePageLojinha.remote_ip);
  // console.log(respostaHomePageLojinha.html().find('h4').text());
  // console.log(respostaHomePageLojinha.html().find('title').text());
  // console.log(respostaHomePageLojinha.html().find('#btn-entrar').attr('name'));
  // console.log(respostaHomePageLojinha.body);


  check(respostaHomePageLojinha, {
    'Checar se meu status code é 200': r => r.status === 200,
    'Checar que o titulo da página é Lojinha': r => r.html().find('title').text() === 'Lojinha'
  })


const corpoDaRequestLogin = {
  usuario: 'admin',
  senha: 'admin'
}

const opcoesDaRequestDoLogin = {
  headers: {
    'Content-type': 'application/x-www-form-urlencoded'
  }
}

const respostaLogin = http.post('http://165.227.93.41/lojinha-web/v2/login/entrar', 
            corpoDaRequestLogin, 
            opcoesDaRequestDoLogin
)


  const cookieJar = http.cookieJar();
  const cookies = cookieJar.cookiesForURL(respostaLogin.url)

  http.get('http://165.227.93.41/lojinha-web/v2/produto', {
    cookies: cookies
  })

  http.get('http://165.227.93.41/lojinha-web/v2/produto/novo', {
    cookies: cookies
  })

  http.post('http://165.227.93.41/lojinha-web/v2/produto/novo', {
    cookies: cookies
    
  })




  const corpoDaRequestSalvarProduto = {
    produtonome: 'bola',
    produtovalor: '10.00',
    produtocores: 'branca'
  }
  
  const opcoesDaRequestSalvarProduto = {
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  }
  
  const respostaSalvarproduto = http.post('http://165.227.93.41/lojinha-web/v2/produto/salvarproduto', 
              corpoDaRequestSalvarProduto, 
              opcoesDaRequestSalvarProduto
    )



  console.log(respostaSalvarproduto.headers['Refresh'])  


  check(respostaSalvarproduto, {
    'Validando que o produto foi salvo': r => r.headers['Refresh'].includes('Produto adicionado com sucesso')
  })


  const respostaAbrirEdicaoProduto = http.get(encodeURI(respostaSalvarproduto.headers['Refresh'].replace('0;url=', '')))
  

  check(respostaAbrirEdicaoProduto, {
    'Validando que entrei na página de edição do produto': r => r.html().find('#produtonome').attr('value') === 'bola'
  })


  sleep(1);
}
