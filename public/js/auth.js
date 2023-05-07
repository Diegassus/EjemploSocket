
const form = document.querySelector('form')

const url = (window.location.hostname.includes('localhost'))
                   ? 'http://localhost:8080/api/auth/'
                   : 'https://restserverbasico.up.railway.app/api/auth/'

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const formData = {}
    for(let el of form.elements ){
        if(el.name.length > 0){
            formData[el.name] = el.value 
        }
    }

    fetch(url + 'login',{
        method:'POST',
        body:JSON.stringify(formData),
        headers:{ 'Content-Type' : 'application/json' }
    }).then(res => res.json()).then(({msg,token})=>{
        if(msg){
            return console.error(msg);
        }
        localStorage.setItem('token' , token);
        window.location = 'chat.html'
    }).catch(e=>{
        console.log(e);
    })
})



function handleCredentialResponse(response) {

    const body = { id_token : response.credential }
    
    fetch(url + 'google',{
       method:'POST',
       headers:{
          'Content-Type': 'application/json'
       },
       body : JSON.stringify(body)
    }).then( r => r.json() )
    .then(({token}) =>{
       localStorage.setItem('token',token)
       //location.reload();
    })
    .catch(console.warn)
 
 }

 const signOut = document.getElementById('google_signout');
 signOut.onclick=()=>{
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();
    google.accounts.id.revoke(localStorage.getItem('email'),done=>{
       localStorage.clear();
       location.reload();
    })
 }