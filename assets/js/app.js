const cl = console.log;

const postscontainer = document.getElementById("postscontainer");
const titleControl = document.getElementById("title");
const ContentControl = document.getElementById("Content");
const postform = document.getElementById("postform");
const userIdControl = document.getElementById("userId");
const submitbtn = document.getElementById("submitbtn");
const updatebtn = document.getElementById("updatebtn");
const loader = document.getElementById("loader");

const BASE_URL = `https://jsonplaceholder.typicode.com`;

const POST_URL = `${BASE_URL}/posts`; //this url will be used for GET and POST method

let postsArr = [];

const templating = (arr) =>{
let result = " ";

arr.forEach(ele => {

    result +=`<div class="col-md-4 mb-3">
                <div class="card postcard h-100" id="${ele.id}">
                    <div class="card-header">
                        <h3 class="m-0">${ele.title}</h3>
                    </div>
                    <div class="card-body">
                        <p class="m-0">${ele.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn btninfo" onclick = "onEdit(this)">Edit</button>
                    <button class="btn btn bg-danger btnrem" onclick = "onRemove(this)">Remove</button>
                    </div>
                </div>
            </div>`
    
});
postscontainer.innerHTML = result;
}


const fetchPosts = () => {
    //API call starts => loader show
    loader.classList.remove(`d-none`)
    //1. create xhr object

let xhr = new XMLHttpRequest();  //object


//2.configuration

//xhr.open(METHODNAME , API_URL)

xhr.open("GET" , POST_URL)


//3

xhr.send();

//4.after getting response

xhr.onload = function(){
    cl(xhr.status)
    if(xhr.status >= 200 && xhr.status < 300){
    //API call success
    postsArr = JSON.parse(xhr.response)
    cl(postsArr)
    // templating
    templating(postsArr);
    
    }
        
    loader.classList.add(`d-none`) //Loader hide
     
}
}

fetchPosts();

// const SINGLE_POST_URL = `${BASE_URL}/posts/:id`

//id=> params i.e just placeholder

//we used xhr => XmlHttpRequest //It was used in previous

//fetch =>now we used fetch it is a browser API. Angular 17 used fetch api call.

//4 steps


const OnpostAdd = (eve)=>{
    eve.preventDefault();

    //create new obj from form

    let newpost = {
        title:titleControl.value,
        body:ContentControl.value.trim(),
        userId:userIdControl.value

    }
    cl(newpost)
    postform.reset();

    loader.classList.remove(`d-none`)

    //XMLHttpRequest ka instance

    let xhr = new XMLHttpRequest();

    //configuration

    xhr.open("POST", POST_URL);

    //response

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status < 300){
            cl(xhr.response)
            newpost.id = JSON.parse(xhr.response).id;
            // postsArr.unshift(newpost);
            // templating(postsArr);

            let div = document.createElement(`div`);
            div.className = `col-md-4 mb-3`;
            div.innerHTML = `<div class="card postcard h-100" id="${newpost.id}">
                    <div class="card-header">
                        <h3 class="m-0">${newpost.title}</h3>
                    </div>
                    <div class="card-body">
                        <p class="m-0">${newpost.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn btninfo" onclick = "onEdit(this)">Edit</button>
                    <button class="btn btn bg-danger btnrem" onclick = "onRemove(this)">Remove</button>
                    </div>
                </div>`

                postscontainer.prepend(div)
        }
        loader.classList.add(`d-none`)
    }

    //send to DB

    xhr.send(JSON.stringify(newpost))
}


const onEdit = (ele)=> {
    // cl(ele)
    let editId = ele.closest(".card").id;
    // cl(editId);
    localStorage.setItem("editId", editId);

    let EDIT_URL = `${BASE_URL}/posts/${editId}`;

    //API call => loader show
    loader.classList.remove(`d-none`);

    let xhr = new XMLHttpRequest()

    xhr.open("GET", EDIT_URL)

    xhr.onload = function(){
        setTimeout(()=>{
            if(xhr.status >= 200 && xhr.status < 300){
                cl(xhr.response)
                let post = JSON.parse(xhr.response);
    
                titleControl.value = post.title;
                ContentControl.value = post.body;
                userIdControl.value = post.userId;
                submitbtn.classList.add(`d-none`);
                updatebtn.classList.remove(`d-none`);
        }

        loader.classList.add(`d-none`); //loader hide(we get response success or error)
        },5000)
}

    xhr.send()
}


const onupdatepost = () => {
    //update id
    let updateId = localStorage.getItem("editId");
    //update obj
    let updateobj = {
        title:titleControl.value,
        body:ContentControl.value.trim(),
        userId:userIdControl.value

    }

    //API URL => updateid
    let UPDATE_URL = `${BASE_URL}/posts/${updateId}`

    //API call to update post on DB 
    loader.classList.remove(`d-none`);

    let xhr = new XMLHttpRequest();

    xhr.open("PATCH", UPDATE_URL);

   xhr.onload = function(){
    if(xhr.status >= 200 && xhr.status < 300){
        cl(xhr.response)
        let card = [...document.getElementById(updateId).children]
        // cl(card)
        card[0].innerHTML= `<h3 class="m-0">${updateobj.title}</h3>`;
        card[1].innerHTML=`<p class="m-0">${updateobj.body}</p>`;
        postform.reset();
        updatebtn.classList.add(`d-none`);
        submitbtn.classList.remove(`d-none`);
    }

    loader.classList.add(`d-none`);
}

    xhr.send(JSON.stringify(updateobj))

}

const onRemove = (ele) => {
  let removeId = ele.closest(`.card`).id;
  cl(removeId);

  //URL
  let REMOVE_URL = `${BASE_URL}/posts/${removeId}`;

  //API call

  //loader show

  loader.classList.remove(`d-none`)

  let xhr = new XMLHttpRequest();

  xhr.open("DELETE", REMOVE_URL);

  xhr.onload = function(){
    if(xhr.status >= 200 && xhr.status < 300){
        ele.closest(`.card`).parentElement.remove()
    }

    loader.classList.add(`d-none`)
  }

  xhr.send()


}







postform.addEventListener("submit",OnpostAdd)
updatebtn.addEventListener("click",onupdatepost)