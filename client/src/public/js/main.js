const buttons = document.querySelectorAll('.like');
buttons.forEach(button =>{
    button.addEventListener('click',()=>{
        button.classList.toggle('liked');
    }
)
}
)
const toggle = document.getElementById('theme-toggle');
toggle.addEventListener('click',()=>{
    toggle.classList.toggle('active');
    document.body.classList.toggle('dark-theme');
    if(document.body.classList.contains('dark-theme')){
        localStorage.setItem('theme','dark');
    }else{
        localStorage.setItem('theme','light');
    }
});
window.addEventListener('DOMContentLoaded',()=>{
    const savedTheme = localStorage.getItem('theme');
    if(savedTheme === 'dark'){
        document.body.classList.add('dark-theme');
    }else{
        const prefersDark = window.matchMedia("('prefers-color-theme:dark)").matches;
        if(prefersDark){
            document.body.classList.add('dark-theme');
        }
    }
})
const delts = document.querySelectorAll('.delete');
    delts.forEach(delt =>{
    delt.addEventListener('click',()=>{
    const article = delt.closest("article");
    article.classList.add('fade-out');
    setTimeout(()=>article.remove(),300);
})
    })
let counts = 0;
counts.forEach(count =>{
count.addEventListener('click',()=>{
    count ++;
    document.querySelectorAll('like-count').textContent = count;
})
})