

function task() {
    
//TASK 1  
/* const N=4;
const K=2;
const elements =[1,3,4,4];

function repetition(N,K,elements){
  let count=0;
  for(let i=0; i<N; i++){
    if(elements[i]===K){
      count++
    }
  }
  if(count>0){
    return count
  }else{
    return -1
  }
}

// import logo from './logo.svg';
// import './App.css';
// import { useEffect, useState } from 'react';

// function App() {
// //   Display the products by utilizing the following API in ReactJS
// // https://dummyjson.com/products
// const [products,setproducts]=useState("")
// const data useEffect({
//   fetchProducts
// })
// function fetchProducts(){
//   const response=fetch("https://dummyjson.com/products")
//   const res=JSON.stringify(response)
//   console.log(res)
//   if(!res){
//     console.log("Error")
//   }
// else{
// setproducts(res);
// }
// }
// console.log("===",setproducts)

// return(
//   <div>
//     <h1>JSON Data</h1>
    
//   </div>
// )




// }

// export default App;

// Online Javascript Editor for free
// Write, Edit and Run your Javascript code using JS Online Compiler
// et data = [1,5,10,45,5,10]
// sort the data without build in function

// let data=[1,5,10,45,5,10]

// function sort(data){
//     len=data.length;
//     for(i=0;i<len;i++){
//         for(j=1;j<len-1;j++){
//             if(data[j]>data[j+1]){
//             data[j]==data[len]
//             let temp=data[j]
//             data[j]=data[j+1]
//             data[j+1]=temp
//             }
//         }
      
//     }
//       return data;
    
// }

// console.log(sort(data));


const r=repetition(N,K,elements)
console.log(r) */

//TASK 2
function printSeperate(input){
  let sepIn=input.split("").join(" ")
  console.log(sepIn)
}

const input= "maheswari"
printSeperate(input)

  
}

export default task
