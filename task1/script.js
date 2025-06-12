let inner=document.getElementById("inner");
let btn=document.getElementById("btn");
x=0;
btn.addEventListener("click",()=>{
if(x<100){
     x=x+10;
    inner.style.width=x + "%"
}
})