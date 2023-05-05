import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit{
  //to hold product id
  productId:string=""
  //to hold product details
  product:any;
 constructor(private viewActivatedRoute:ActivatedRoute,private api:ApiService){ }
  ngOnInit(): void {
    //get path parameter form component route
   this.viewActivatedRoute.params.subscribe((data:any)=>{console.log(data)
    this.productId=data.id
  })
this.api.viewAproduct(this.productId).subscribe(
  //200
  (result:any)=>{
    console.log(result) 
    this.product=result   
  },
  (result:any)=>{
    console.log(result.error);
    
  }
)}
addToWishlist(product:any){
  this.api.addtowishlist(product)
  .subscribe((result:any)=>{
    alert(result)
  },
  (result:any)=>{
    alert(result.error)
  })
}
addtocart(product:any){
  //add quantity key to product object with value as 1
  Object.assign(product,{quantity:1})//if more than one key value pair give them as array
  console.log(product)
  //callapi
  this.api.addToCart(product)
  .subscribe(
    (result:any)=>{
      //call method to get cart count
      this.api.cartCount()
      alert(result)
    },
    (result:any)=>{
      alert(result.error)
    }
  )
}
}
