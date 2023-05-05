import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder } from '@angular/forms';
import {IPayPalConfig,ICreateOrderRequest } from 'ngx-paypal';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{
  //paypal property 
  public payPalConfig ? : IPayPalConfig;
  cartItems:any=[]
  cartTotalPrice:number=0
  offerStatus:boolean=false
  finalAmount:number=0
  offerTagStatus:boolean=false
  paymentBtn:boolean=false
  makepaymentStatus:boolean=false
  showSuccess:boolean=false;
  showError:boolean=false;
  showCancel:boolean=false;
  user:any={}
  addressForm=this.fb.group({
    username:[''],
    addr1:[''],
    addr2:[''],
    state:['']
  })
  constructor(private api:ApiService,private fb:FormBuilder){}
  ngOnInit(): void {
    this.getCart()
    this.initConfig();
  }
  getCart(){
    this.api.getCart().subscribe(
      (result:any)=>{
        console.log(result);
        this.cartItems=result
        //call cart price
        this.getCartTotalPrice()
      },
      (result:any)=>{
        console.log(result.error)
      }
    )
  }
  //getCartTotalPrice
  getCartTotalPrice(){
    let total=0
    this.cartItems.forEach((item:any)=>{
      total+=item.grandTotal
      this.cartTotalPrice=Math.ceil(total)
      this.finalAmount=this.cartTotalPrice
    })
  }
  //remove cart item
  removeCartItem(id:any){
    this.api.removeCartItem(id).subscribe(
    (result:any)=>{
      this.cartItems=result
      //call cart price
      this.getCartTotalPrice()
      //to change cart count
      this.api.cartCount()
    },
    (result:any)=>{
      alert(result.error)
    }
    )
  }
  //increment cart item
  incrCartItem(id:any){
    this.api.incrCartItem(id).subscribe(
      (result:any)=>{
        this.cartItems=result
        //call cart price
        this.getCartTotalPrice()
        //to change cart count
        this.api.cartCount()
      },
      (result:any)=>{
        alert(result.error)
      }
    )
  }
  decrCartItem(id:any){
    this.api.decrCartItem(id).subscribe(
      (result:any)=>{
        this.cartItems=result
        //call cart price
        this.getCartTotalPrice()
        //to change cart count
        this.api.cartCount()
      },
      (result:any)=>{
        alert(result.error)
      }
    )
  }
  //empty cart
  emptyCart(){
    this.api.emptyCart().subscribe(
      //200
      (result:any)=>{
        this.cartItems=[]
         //call cart price
         this.getCartTotalPrice()
         //to change cart count
         this.api.cartCount()
      },(result:any)=>{
        alert(result.error)
      }
    )
  }
  //viewOffers
  viewOffers(){
    this.offerStatus=true
  }
  //discount10
  discount10(){
    let discount=this.cartTotalPrice*10/100
    this.finalAmount=this.cartTotalPrice-discount
    this.offerStatus=false
    this.offerTagStatus=false
  }
  //discount50
  discount50(){
    let discount=this.cartTotalPrice*50/100
    this.finalAmount=this.cartTotalPrice-discount
    this.offerStatus=false
    this.offerTagStatus=false
  }
  submit(){
    if(this.addressForm.valid){
      this.paymentBtn=true
      this.user.username=this.addressForm.value.username
      this.user.addr1=this.addressForm.value.addr1
      this.user.addr2=this.addressForm.value.addr2
      this.user.state=this.addressForm.value.state
    }else{
      alert('invalid form')
    }
  }
  //make payment update
  makepayment(){
    this.makepaymentStatus=true;
  }
  private initConfig(): void {
    this.payPalConfig = {
        currency: 'EUR',
        clientId: 'sb',
        createOrderOnClient: (data) => < ICreateOrderRequest > {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'EUR',
                    value: '9.99',
                    breakdown: {
                        item_total: {
                            currency_code: 'EUR',
                            value: '9.99'
                        }
                    }
                },
                items: [{
                    name: 'Enterprise Subscription',
                    quantity: '1',
                    category: 'DIGITAL_GOODS',
                    unit_amount: {
                        currency_code: 'EUR',
                        value: '9.99',
                    },
                }]
            }]
        },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'paypal',
            layout: 'vertical'
        },
        onApprove: (data, actions) => {
            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then((details:any) => {
                console.log('onApprove - you can get full order details inside onApprove: ', details);
            });

        },
        onClientAuthorization: (data) => {
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
            this.showSuccess = true;
            this.emptyCart()
            this.makepaymentStatus=false
        },
        onCancel: (data, actions) => {
            console.log('OnCancel', data, actions);
            this.showCancel = true;
            this.makepaymentStatus=false

        },
        onError: err => {
            console.log('OnError', err);
            this.showError = true;
            this.makepaymentStatus=false
        },
    }
}
modalClose(){
  this.addressForm.reset()
  this.paymentBtn=false
  this.makepaymentStatus=false;
 this.showCancel=false
 this.showError=false
 this.showSuccess=false
}
}