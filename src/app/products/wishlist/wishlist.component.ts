import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlistItems:any=[]
  constructor(private api:ApiService){}
  ngOnInit(): void {
  this.api.getWishlistItems().subscribe(
    (result:any)=>{
      console.log(result);
      this.wishlistItems=result
    },
    (result:any)=>{
      console.log(result.error)
    }
  )
  }
//remove item from wishlist
removeWishlistItem(id:any){
  //api call
  this.api.removeWishlistItem(id).subscribe(
    (result:any)=>{
      this.wishlistItems=result
    },
    (result:any)=>{
      console.log(result.error);
    }
  )
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
      //to remove wishlist 
      this.removeWishlistItem(product.id)
      alert(result)
    },
    (result:any)=>{
      alert(result.error)
    }
  )
}
}
