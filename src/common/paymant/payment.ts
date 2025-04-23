import { Injectable } from "@nestjs/common";
import Stripe from "stripe";

@Injectable()
export class PaymentService {
    constructor() {}
    private readonly stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
    async crateChekoutSession({customer_email,metadata,line_items,discounts}) {
        return await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email, 
            metadata: {
                ...metadata
            },
            success_url: 'http://127.0.0.1:5000/success',
            cancel_url: `http://127.0.0.1:5000/cancel`,
            line_items,
            discounts,
        })
    }
    async createCoupon({name ,percent_off}) {
        return await this.stripe.coupons.create({
            name,
            percent_off
        })
    }
    async refund({paymentIntentId,amount,reason}){
        return await this.stripe.refunds.create({
            payment_intent:paymentIntentId,
            amount,
            reason
        })
    }
}