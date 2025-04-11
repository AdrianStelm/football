const buttons = document.querySelectorAll('.likeButton');
buttons.forEach(button =>{
    button.addEventListener('click',()=>{
        button.classList.toggle('liked');
    }
)
}
)
document.querySelector('.burger').addEventListener('click', function(){
    this.classList.toggle('active');
})