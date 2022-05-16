var modal = document.getElementById("modal-overlay");                  //Create variables for all modal elements
var btn = document.getElementById("add-article-button");
var closeBtn = document.getElementById("modal-cancel-button");
var submitBtn = document.getElementById("modal-submit-button");
var titleInput = document.getElementById('modalTitle');
var tagInput = document.getElementById('modalTag');
var authorInput = document.getElementById('modalAuthor');
var dateInput = document.getElementById('modalDate');
var imageInput = document.getElementById('modalImage');
var contentInput = document.getElementById('modalContent');
var deleteModal = document.getElementById('delete-modal-container-overlay');
var modalCancelDeleteButton = document.getElementById('delete-modal-cancel-button');
var modalDeleteButton = document.getElementById('delete-modal-submit-button');
var nextPageButton = document.getElementById('next-page-button');
var previousPageButton = document.getElementById('previous-page-button');
var currentId;
var nrOfArticles;
var currentPage = 1;


function clearMain(){                                                        //Clear Main tag function
    document.getElementById('main').innerHTML = "";
}

function getCurrentId(articles){
    articles.forEach((article) => {
        currentId = article.id + 1;
    })
    console.log(currentId);
}

async function fetchArticles() {                                             //Fetch articles
    const response = await fetch('http://localhost:3000/articles');
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    await response.json().then((response) => {
        renderArticles(response);
    });
  }

function renderArticles(articles){                                           //Render articles
    clearMain();
    nrOfArticles = articles.length;
    if(currentPage * 3 > nrOfArticles){var iUpperLimit = nrOfArticles;}
        else{var iUpperLimit = currentPage * 3;}
    for(let i = (currentPage - 1) * 3; i < iUpperLimit; i++){
        const articleContainer = document.createElement('article');          //Create all elements needed for the article and add the respective classes
        articleContainer.classList.add("article");
        const articleInfo = document.createElement('div');
        articleInfo.classList.add("article-info");
        const articleEditClearfix = document.createElement('div');
        articleEditClearfix.classList.add("article-edit-section-clearfix");
        const articleEdit = document.createElement('div');
        articleEdit.classList.add("article-edit-section");
        const title = document.createElement('h1');
        title.classList.add("title", "article-title");
        const infoText = document.createElement('span');
        infoText.classList.add('article-info-text');
        const tagText = document.createElement('span');
        tagText.classList.add('article-info-text');
        const dateText = document.createElement('span');
        dateText.classList.add('article-info-text');
        const authorText = document.createElement('span');
        authorText.classList.add('article-info-text--dark');
        const editButton = document.createElement('button');
        editButton.classList.add('article-edit-button');
        const editButtonDecoration = document.createElement('span');
        editButtonDecoration.classList.add('article-edit-decoration');
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('article-edit-button');
        const articleImage = document.createElement('img');
        const articleContent = document.createElement('p');
        articleContent.classList.add('text-paragraph', 'article-paragraph');

        editButton.onclick = () => editArticle(articles[i]);
        deleteButton.onclick = () => confirmDeleteArticle(articles[i]);

        title.textContent = articles[i].title;                         //Fill the created elements with the corresponding values
        dateText.textContent =  articles[i].date;
        tagText.textContent = articles[i].tag;
        authorText.textContent = articles[i].author;
        infoText.textContent = "Added by: ";
        editButton.textContent = "Edit";
        deleteButton.textContent = "Delete";
        editButtonDecoration.textContent = "|";
        articleImage.setAttribute('src', articles[i].image);
        articleContent.textContent = articles[i].content;

        document.getElementById('main').appendChild(articleContainer);  //Append all elements to the main tag to create the page itself
        articleContainer.appendChild(title);
        articleContainer.appendChild(articleInfo);
        articleContainer.appendChild(articleEditClearfix);
        articleContainer.appendChild(articleImage);
        articleContainer.appendChild(articleContent);
        articleInfo.appendChild(tagText);
        articleInfo.appendChild(infoText);
        infoText.appendChild(authorText);
        articleInfo.appendChild(dateText);
        articleEditClearfix.appendChild(articleEdit);
        articleEdit.appendChild(editButton);
        articleEdit.appendChild(editButtonDecoration);
        articleEdit.appendChild(deleteButton);  
    }
    getCurrentId(articles);
}

function clearForm(){
    titleInput.value = "";
    tagInput.value = "";
    authorInput.value = "";
    dateInput.value = "";
    imageInput.value = "";
    contentInput.value = "";
}

function editArticle(article){                                              //Edit Article In Modal
    modalDisplay();
    titleInput.value = article.title;
    tagInput.value = article.tag;
    authorInput.value = article.author;
    dateInput.value = article.date;
    imageInput.value = article.image;
    contentInput.value = article.content;
    submitBtn.onclick = () => saveEditedArticle(article.id);
}    

async function saveEditedArticle(id){                                              //Save Article Edit
    const body = {  
      title: titleInput.value,
      tag: tagInput.value,
      author: authorInput.value,
      date: dateInput.value,
      image: imageInput.value,
      content: contentInput.value
    }
    const response = await fetch('http://localhost:3000/articles/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
    });

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    submitBtn.onclick = () => {};
}

function confirmDeleteArticle(article){                                              //Confirm Article Deletion
    deleteModalDisplay();
    modalDeleteButton.onclick = () => deleteArticle(article.id);
    modalCancelDeleteButton.onclick = () => {deleteModal.style.display = "none"}
}
async function deleteArticle(id){                                                   //Delete Article
    const body = {  }
    const response = await fetch('http://localhost:3000/articles/' + id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
    });

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
}

function writeArticle(){                                              //Open Modal for New Article
    modalDisplay();
    submitBtn.onclick = () => checkArticle();
}
function checkArticle(){
    if(areInputsFilled()) addNewArticle();
        
}
function areInputsFilled(){                                             //Check if inputs are filled
    inputs = document.getElementsByClassName('input');
    for(let i = 0; i < inputs.length; i++){
        if (inputs[i].value.length == 0){ 
            alert("Va rog completati fiecare casuta");  	
            return false; 
        }  	
    }
    return true;
}
async function addNewArticle(){                                          //Save New Article
    const body = {  
        title: titleInput.value,
        tag: tagInput.value,
        author: authorInput.value,
        date: dateInput.value,
        image: imageInput.value,
        content: contentInput.value
    }  
    const response = await fetch('http://localhost:3000/articles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
    });

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    submitBtn.onclick = () => {};                                                             
}


                         
function modalDisplay() {                                                   //Show and close modal functions
    modal.style.display = "block";
}  
function deleteModalDisplay(){
    deleteModal.style.display = "block";
}
closeBtn.onclick = () => {
    modal.style.display = "none";
    clearForm();
}



function previousPage() {
    if(currentPage > 1){
        currentPage -= 1;
        fetchArticles();
    }
}
function nextPage() {
    if(currentPage * 3 < nrOfArticles){
        currentPage += 1;
        fetchArticles();
    }
}

fetchArticles();
btn.onclick = () => writeArticle();
previousPageButton.onclick = () => previousPage();
nextPageButton.onclick = () => nextPage();
