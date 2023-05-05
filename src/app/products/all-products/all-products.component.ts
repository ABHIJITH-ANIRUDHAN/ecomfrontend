import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit{
  allProducts:any=[]
  //variable for search key
  searchKey:string=''
  constructor(private api:ApiService){}
  ngOnInit(): void {
    //make api call to get all prouucts
    this.api.getAllProducts().subscribe(
      (result:any)=>{console.log(result)
      this.allProducts=result},
      (result:any)=>{console.log(result.errror)}
    )
    //get behaviour subject from api service
    this.api.searchTerm.subscribe((result:any)=>{
      console.log(result);
      this.searchKey=result
    })
  }
  //addtocart(product)
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

